import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Gemini AI with stable model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, userAnswer } = body;

    if (action === 'generate') {
      const prompt = `Generate a single math word problem for Singapore Primary 5 students, aligned with the 2021 MOE syllabus (topics: whole numbers, fractions, decimals, ratios, percentages, area/volume of triangles/cubes, angles, geometry). 
      The problem should be engaging and realistic. Return ONLY valid JSON with two fields: 
      {"problem_text": "The full problem text here.", "correct_answer": numerical_answer_as_number}.
      Example: {"problem_text": "A shop sold 120 pencils. On Tuesday, it sold 2/3 of Monday's amount. How many pencils were sold on Tuesday?", "correct_answer": 80}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let jsonStr = response.text().trim();

      // Remove Markdown code fences (```json
      jsonStr = jsonStr.replace(/^```json\n|\n```$/g, '').trim();

      // Parse the cleaned JSON
      const generated = JSON.parse(jsonStr);

      // Validate JSON structure
      if (!generated.problem_text || generated.correct_answer === undefined) {
        throw new Error('Invalid JSON structure from AI');
      }

      const { data: session, error } = await supabase
        .from('math_problem_sessions')
        .insert({ problem_text: generated.problem_text, correct_answer: generated.correct_answer })
        .select('id')
        .single();

      if (error) throw new Error('Failed to save problem: ' + error.message);

      return NextResponse.json({
        problem: { problem_text: generated.problem_text, correct_answer: generated.correct_answer },
        sessionId: session.id,
      });

    } else if (action === 'submit' && sessionId && userAnswer !== undefined) {
      const { data: session, error: sessionError } = await supabase
        .from('math_problem_sessions')
        .select('problem_text, correct_answer')
        .eq('id', sessionId)
        .single();

      if (sessionError || !session) throw new Error('Session not found');

      const isCorrect = Math.abs(Number(userAnswer) - Number(session.correct_answer)) < 0.01;

      const feedbackPrompt = `Generate encouraging feedback for a Primary 5 student on this math problem: "${session.problem_text}"
      Correct answer: ${session.correct_answer}. Student's answer: ${userAnswer}. Correct? ${isCorrect}.
      Provide 2-4 sentences: Praise effort, explain any mistake (e.g., fractions, ratios), suggest a tip. Keep it positive and age-appropriate.`;

      const result = await model.generateContent(feedbackPrompt);
      const feedback = (await result.response.text()).trim();

      const { error: submitError } = await supabase
        .from('math_problem_submissions')
        .insert({
          session_id: sessionId,
          user_answer: Number(userAnswer),
          is_correct: isCorrect,
          feedback_text: feedback,
        });

      if (submitError) throw new Error('Failed to save submission: ' + submitError.message);

      return NextResponse.json({ isCorrect, feedback });

    } else {
      throw new Error('Invalid request');
    }
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json({ error: 'Something went wrong: ' + error.message }, { status: 500 });
  }
}