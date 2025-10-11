# AI Math Problem Generator

This is a full-stack web application that generates math word problems for Singapore Primary 5 students, aligned with the 2021 MOE syllabus. Users can generate problems, submit answers, and receive AI-generated feedback. Built with Next.js, TypeScript, Tailwind CSS, Supabase, and Google Gemini AI.

## Live Demo
- **Vercel URL**: https://math-problem-generator-al1t.vercel.app/
- **GitHub Repository**: https://github.com/idontwindows/math-problem-generator.git

## Supabase Credentials
- **Project URL**: https://pqmbpfemnstgmltmiqwo.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxbWJwZmVtbnN0Z21sdG1pcXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjY5NjIsImV4cCI6MjA3NTcwMjk2Mn0.4AMDCB9GIETn8xkHhvcFjoCL7RTtT9upc4wBgzEu8EU

## Features
- Generates engaging math problems covering whole numbers, fractions, decimals, ratios, percentages, area/volume, angles, and geometry.
- Saves problems and user submissions to Supabase.
- Provides encouraging, age-appropriate feedback using Google Gemini AI.
- Responsive UI with Tailwind CSS, including error handling in the feedback section.
- Supports decimal answers (e.g., 33.75) for flexibility.

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase (PostgreSQL)
- **AI**: Google Gemini (gemini-2.5-flash)
- **Deployment**: Vercel
- **Version Control**: Git/GitHub

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/idontwindows/math-problem-generator.git
   cd math-problem-generator