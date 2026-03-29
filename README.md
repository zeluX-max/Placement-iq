# PlacementIQ

> Campus Placement Intelligence for NIT Jalandhar Students

Built at **HackMol 7.0** · NIT Jalandhar · 2026

---

## What is PlacementIQ?

PlacementIQ tells every NITJ student exactly where they stand for campus placements. Upload your LinkedIn PDF or resume — get a company-by-company readiness score, skill gap analysis, personalized 4-week study plan, and an AI voice mock interview in under 10 seconds.

No more guessing. Just your placement roadmap.

---

## Features

- **3 input methods** — LinkedIn PDF, Resume PDF, or manual form
- **Company readiness board** — Green / Amber / Red across 53 companies
- **Skill gap analysis** — exactly what's missing per target company
- **4-week study plan** — day-by-day tasks with resources
- **AI voice mock interview** — company-specific questions with full scorecard
- **Progress tracker** — checkbox-based daily task tracking
- **Live leaderboard** — compare readiness with batchmates
- **Persistent sessions** — results saved via Supabase Auth

---

## Tech Stack

| Layer           | Tool                    |
| --------------- | ----------------------- |
| Framework       | Next.js 15 (App Router) |
| Language        | JavaScript (JSX)        |
| Styling         | Tailwind CSS            |
| Animations      | Framer Motion           |
| AI Engine       | Gemini 2.5 Flash        |
| Database & Auth | Supabase                |
| Supabase SSR    | @supabase/ssr           |
| Package Manager | pnpm                    |
| Deployment      | Vercel                  |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- Gemini API key from [aistudio.google.com](https://aistudio.google.com)
- Supabase project from [supabase.com](https://supabase.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOURTEAM/placement-iq.git
cd placement-iq

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys — get them from team lead privately
```

### Environment Variables

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Table Setup

Run this in your Supabase dashboard under **SQL Editor**:

```sql
create table students (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  name text,
  cgpa float,
  skills text[],
  ready_companies text[],
  stretch_companies text[],
  gap_analysis jsonb,
  study_plan jsonb,
  created_at timestamp default now()
);

alter table students enable row level security;

create policy "Users can manage own data" on students
  for all using (auth.uid() = user_id);
```

### Run Locally

```bash
pnpm dev
```

Open [http://localhost:3000/home](http://localhost:3000/home)

---

## Project Structure

```
placement-iq/
├── .gemini/
│   └── GEMINI.md                  # Antigravity agent instructions
├── middleware.js                   # Route protection (@supabase/ssr)
├── src/
│   ├── app/
│   │   ├── home/page.jsx          # Pre-login landing page (public)
│   │   ├── login/page.jsx         # Sign up / Sign in
│   │   ├── auth/callback/route.js # Supabase auth callback
│   │   ├── page.jsx               # Main input page (protected)
│   │   ├── results/page.jsx       # Dashboard (protected)
│   │   ├── interview/
│   │   │   ├── page.jsx           # Company selector
│   │   │   ├── session/page.jsx   # Voice Q&A
│   │   │   └── report/page.jsx    # Interview scorecard
│   │   └── api/
│   │       ├── parse-profile/     # PDF → profile extraction
│   │       ├── analyze/           # Gap analysis + study plan
│   │       ├── save-profile/      # Save to Supabase
│   │       ├── interview-questions/ # Generate questions
│   │       └── interview-report/  # Analyze answers
│   ├── components/
│   │   ├── auth/                  # Auth components
│   │   ├── layout/Navbar.jsx      # Responsive navbar
│   │   ├── input/                 # Upload + manual form
│   │   ├── dashboard/             # Company board + cards
│   │   ├── plan/                  # Weekly plan + tracker
│   │   ├── leaderboard/           # Live leaderboard
│   │   ├── interview/             # Voice interview components
│   │   └── shared/LoadingState.jsx
│   ├── hooks/
│   │   ├── useUser.js             # Current user
│   │   └── useProfile.js          # Saved profile
│   ├── lib/
│   │   ├── gemini.js              # Gemini API helper
│   │   ├── supabase.js            # Browser client (@supabase/ssr)
│   │   ├── supabase-server.js     # Server client (@supabase/ssr)
│   │   ├── pdfToBase64.js         # PDF converter
│   │   └── parseJson.js           # JSON parser
│   └── data/
│       ├── companies.js           # 53 company database
│       └── skills.js              # Skills checklist
├── .env.example                   # Environment template
├── .gitattributes                 # Line ending rules
├── .npmrc                         # pnpm config
└── package.json
```

---

## Pages & Routes

| Route                | Page                      | Auth     |
| -------------------- | ------------------------- | -------- |
| `/home`              | Pre-login landing         | Public   |
| `/login`             | Sign up / Sign in         | Public   |
| `/auth/callback`     | Supabase callback         | Public   |
| `/`                  | Profile upload + analysis | Required |
| `/results`           | Placement dashboard       | Required |
| `/interview`         | Company selector          | Required |
| `/interview/session` | Voice Q&A                 | Required |
| `/interview/report`  | Scorecard                 | Required |

---

## API Routes

| Endpoint                   | Method | Description                   |
| -------------------------- | ------ | ----------------------------- |
| `/api/parse-profile`       | POST   | PDF → extracted profile       |
| `/api/analyze`             | POST   | Profile → gap analysis + plan |
| `/api/save-profile`        | POST   | Save results to Supabase      |
| `/api/interview-questions` | POST   | Generate company questions    |
| `/api/interview-report`    | POST   | Analyze answers → scorecard   |

---

## Team Collaboration

This project uses parallel feature branches for fast development.

### Branch Strategy

| Person   | Branch                    | Phases         |
| -------- | ------------------------- | -------------- |
| Lead (A) | `feature/auth-and-api`    | Phase 1 + 2    |
| Person B | `feature/input-dashboard` | Phase 3 + 4    |
| Person C | `feature/plan-interview`  | Phase 5 + 6    |
| Lead (A) | `feature/pages`           | Phase 7 (last) |

### Merge Order

```
Phase 1+2 → merge first
Phase 3+4 → merge second
Phase 5+6 → merge third
Phase 7   → merge last (depends on all components)
```

### Building With Antigravity

Open project in Antigravity and run:

```
Execute Phase X from GEMINI.md
```

Verify each phase before pushing. Each phase in GEMINI.md has a verify checklist.

### Git Workflow

```bash
# Create your branch
git checkout -b feature/your-phase

# Commit as you go
git add .
git commit -m "feat: add login page"
git push origin feature/your-phase

# Open Pull Request on GitHub for team lead to review
```

### Windows Teammates

- Use Git Bash as your terminal
- Run once: `git config --global core.autocrlf false`
- `.gitattributes` handles line endings automatically

---

## Voice Interview Notes

The AI mock interview uses the **Web Speech API**:

- Works on **Chrome and Edge only**
- Does not work on Firefox or Safari
- Language set to `en-IN` for Indian English
- Internet connection required

---

## How to Get Your LinkedIn PDF

1. Go to your LinkedIn profile
2. Click **More** button
3. Click **Save to PDF**
4. Upload the PDF to PlacementIQ

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Add environment variables:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click Deploy

Auto-deploys on every push to `main`.

---

## Companies Database

PlacementIQ tracks **53 companies** across all sectors:

**Product** — Google, Microsoft, Amazon, Flipkart, Samsung, Oracle, Tesla, Nvidia, Cisco, Intel, IBM

**Service** — TCS, Infosys, Wipro, Accenture, Cognizant, Deloitte, EY, KPMG, PwC, L&T, HAL, BHEL, NTPC

**Manufacturing** — Bosch, Tata Motors, Mahindra, Maruti, Hero MotoCorp, Siemens, Bharat Forge

**Startups** — Ola, Swiggy, Paytm, Zomato, Adani Green Energy

**FMCG** — HUL, Nestle, Asian Paints, ITC, Aditya Birla, Reliance

Each company includes minimum CGPA, required skills, interview rounds, average package, NITJ visit history, and topper tips.

---

## Final changes done

Used Grok ai for gap-analysis for companies
Used Gemini for pdf parsing
Used ElevenLabs for voice interview questions generation

## License

MIT License — free to use, modify, and distribute.

---

## Built By

Team **ElevateX** at HackMol 7.0 · NIT Jalandhar, March 2026

---

_PlacementIQ — Because "am I ready?" deserves a real answer._
