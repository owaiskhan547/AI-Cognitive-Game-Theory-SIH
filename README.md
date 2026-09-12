# AI-Cognitive-Game-Theory-SIH

AI-powered cognitive care platform for elderly users with memory support, reminders, caregiver dashboards, and guided wellness tools.

## Project Overview

This app is a React + Vite web application that helps patients manage routines and allows caregivers to monitor progress and reminders.

## Prerequisites

- Node.js 18 or later
- npm

## Run locally

1. Open a terminal in the project root.
2. Install dependencies:

   npm install

3. Start the app:

   npm run dev -- --host 0.0.0.0

4. Open the local URL shown in the terminal, usually:

   http://localhost:3000/

## Demo login

This project includes local demo accounts so the app can run without Supabase credentials.

- Patient:
  - Email: patient@demo.local
  - Password: demo1234
- Caregiver:
  - Email: caregiver@demo.local
  - Password: demo1234

## Optional Supabase setup

If you want to connect to a real Supabase backend, create a `.env` file in the project root with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Then restart the app.

## Useful scripts

```bash
npm run dev
npm run build
npm run preview
```

## Notes

- On Windows PowerShell, if script execution is blocked, run:

  powershell -ExecutionPolicy Bypass -NoProfile -Command "npm run dev -- --host 0.0.0.0"

- The app uses a demo fall-back mode when Supabase environment variables are not configured.
