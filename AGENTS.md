<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# PlacementIQ — Antigravity Agent Instructions

# NIT Jalandhar · HackMol 7.0

## Project Overview

Next.js 15 app · JavaScript (JSX) · pnpm · Tailwind CSS
Gemini 2.5 Flash API · Supabase (@supabase/ssr) · App Router at src/app/
Campus placement intelligence tool for NIT Jalandhar students.

## How to Use This File

Tell Antigravity: "Execute Phase X from GEMINI.md"
Wait for completion and verify before moving to next phase.
Use Fast mode for all phases.

## Agent Rules

- Always use JavaScript (.jsx for components, .js for utilities)
- Never use TypeScript
- Never run pnpm dev autonomously
- Mobile-first always — base styles for mobile, md: for desktop
- Min touch target 44px for all buttons and interactive elements
- Never hardcode colors — always use Tailwind classes
- Single column default → multi-column at md: breakpoint
- Dark theme throughout: bg-gray-950 page, bg-gray-900 cards
- Confirm each file is complete before moving to next

## Supabase Package (IMPORTANT)

Using @supabase/ssr — NOT @supabase/auth-helpers-nextjs

- Browser client: createBrowserClient from @supabase/ssr
- Server client: createServerClient from @supabase/ssr
- Middleware: createServerClient from @supabase/ssr
- Never import from @supabase/auth-helpers-nextjs anywhere

## JavaScript Rules

- Use 'use client' directive on all interactive components
- Use regular function components
- PropTypes are optional — skip for hackathon speed
- Use @/ alias for all imports

## Pre-created Files (DO NOT recreate)

- src/data/companies.js — 53 company NITJ database
- src/data/skills.js — skills checklist by category
- src/lib/gemini.js — Gemini helper functions
- src/lib/pdfToBase64.js — PDF to base64 converter
- src/lib/parseJson.js — safe JSON parser
- src/lib/supabase.js — Supabase browser client
- src/lib/supabase-server.js — Supabase server client
- src/hooks/useUser.js — current user hook
- src/hooks/useProfile.js — saved profile hook
- middleware.js — route protection
- src/app/layout.jsx — root layout
- src/app/globals.css — global styles

## Environment Variables

GEMINI_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

## Design System (apply to ALL components)

### Colors

- Page bg: bg-gray-950
- Card bg: bg-gray-900
- Card border: border border-gray-800
- Primary CTA: bg-[#006633] hover:bg-green-700 text-white
- Active/highlight: purple (bg-purple-900 border-purple-700)
- Ready/success: bg-green-950 border-green-800 text-green-400
- Stretch/warning: bg-amber-950 border-amber-800 text-amber-400
- Future/danger: bg-red-950 border-red-800 text-red-400
- Body text: text-gray-100
- Muted: text-gray-400
- Hints: text-gray-500

### Typography

- Page title: text-2xl md:text-3xl font-medium
- Section title: text-lg md:text-xl font-medium
- Card title: text-sm font-medium
- Body: text-sm text-gray-300
- Label/hint: text-xs text-gray-500

### Spacing

- Page padding: px-4 md:px-8
- Section: py-8 md:py-12
- Card: p-4 md:p-6
- Gap: gap-3 md:gap-4

### Components

- Cards: rounded-xl border border-gray-800 bg-gray-900
- Buttons: rounded-lg min-h-[44px]
- Inputs: rounded-lg border border-gray-700 bg-gray-800 text-white
- Badges: rounded-full text-xs px-2 py-0.5
- Primary btn: bg-[#006633] hover:bg-green-700 text-white
  px-4 py-3 rounded-lg text-sm font-medium w-full md:w-auto

### Animations (Framer Motion)

- Card entrance: initial opacity-0 y-16, animate opacity-1 y-0
- Duration: 0.3s ease-out
- Stagger: 0.08s between children
- Progress bars: spring animation on width

### Mobile-First Rules

- ALWAYS write base styles for mobile first
- Use md: prefix to override for desktop
- Single column default → multi column at md:
- Full width buttons on mobile → auto width at md:
- Larger tap targets on mobile → tighter on desktop
- Horizontal scroll allowed only for tab bars
- No overflow-x on page level

---

## PHASE 0 — MANUAL FILES

### Create these by hand before running any Antigravity phase

### src/lib/supabase.js

```js
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
```

### src/lib/supabase-server.js

```js
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}
```

### middleware.js (root of project)

```js
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(req) {
  let supabaseResponse = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const protectedRoutes = ["/", "/results", "/interview"];
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/", "/results", "/interview/:path*"],
};
```

### src/hooks/useUser.js

```js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

### src/hooks/useProfile.js

```js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "./useUser";

export function useProfile() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("students")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setProfile(data);
        setLoading(false);
      });
  }, [user]);

  return { profile, loading };
}
```

### src/app/layout.jsx

```jsx
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PlacementIQ — NIT Jalandhar",
  description: "Campus placement intelligence for NITJ students",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
```

---

## PHASE 1 — AUTH PAGES

### Tell Antigravity: "Execute Phase 1 from GEMINI.md"

### Files to build: 2

1. src/app/login/page.jsx
   - 'use client'
   - Import supabase from @/lib/supabase
   - Import createBrowserClient from @supabase/ssr
   - Full page centered card: max-w-md mx-auto px-4
   - PlacementIQ logo + "NIT Jalandhar" subtitle at top
   - Toggle between Sign In and Sign Up on same page
   - Sign Up fields: full name, college email, password
   - Sign In fields: college email, password
   - supabase.auth.signUp with full_name in user_metadata
   - supabase.auth.signInWithPassword
   - router.push('/') on success
   - Inline red error messages below form
   - Primary CTA button full width bg-[#006633]
   - Toggle link at bottom: "Already have account? Sign in"
   - MOBILE: full width card px-4
   - DESKTOP: centered card max-w-md

2. src/app/auth/callback/route.js
   - GET handler
   - Import supabaseServer from @/lib/supabase-server
   - Get code from searchParams
   - const supabase = await supabaseServer()
   - supabase.auth.exchangeCodeForSession(code)
   - Redirect to requestUrl.origin on success

### Verify Phase 1:

- Visit /login — see login form
- Toggle between sign in and sign up works
- Sign up creates account in Supabase dashboard
- Sign in redirects to /

---

## PHASE 2 — API ROUTES

### Tell Antigravity: "Execute Phase 2 from GEMINI.md"

### Files to build: 5

1. src/app/api/parse-profile/route.js
   - POST handler
   - Import parseProfileFromPDF from @/lib/gemini
   - Accept { pdfBase64, type } where type is 'linkedin' or 'resume'
   - Call parseProfileFromPDF(pdfBase64)
   - Return Response.json({ profile })
   - try/catch → return Response.json({ error }, { status: 500 })

2. src/app/api/analyze/route.js
   - POST handler
   - Import companies from @/data/companies
   - Import analyzeProfile, generateStudyPlan from @/lib/gemini
   - Accept { profile }
   - Call both functions with profile + companies
   - Return Response.json({ gapAnalysis, studyPlan })
   - try/catch → 500 error

3. src/app/api/save-profile/route.js
   - POST handler
   - Import supabaseServer from @/lib/supabase-server
   - const supabase = await supabaseServer()
   - const { data: { session } } = await supabase.auth.getSession()
   - Accept { profile, gapAnalysis, studyPlan }
   - Insert into students table:
     user_id: session.user.id
     name: profile.name
     cgpa: profile.cgpa
     skills: profile.skills (text array)
     ready_companies: gapAnalysis.ready.map(c => c.name)
     stretch_companies: gapAnalysis.stretch.map(c => c.name)
     gap_analysis: gapAnalysis (jsonb)
     study_plan: studyPlan (jsonb)
   - Return Response.json({ success: true })

4. src/app/api/interview-questions/route.js
   - POST handler
   - Import geminiModel from @/lib/gemini
   - Accept { company, role, type, count }
   - Prompt Gemini to generate count interview questions
   - Questions JSON: { id, question, type, hint, timeLimit }
   - Return Response.json({ questions, interviewTitle })

5. src/app/api/interview-report/route.js
   - POST handler
   - Import geminiModel from @/lib/gemini
   - Accept { answers[], company, role }
   - Prompt Gemini to evaluate all answers
   - Report JSON: { overallScore, overallVerdict,
     hireRecommendation, answers[{ questionId, question,
     score, whatWasGood, whatWasMissing, idealAnswer, grade }],
     topStrengths[], topWeaknesses[], nextSteps[] }
   - Return Response.json(report)

### Verify Phase 2:

- Test /api/parse-profile returns profile JSON
- Test /api/analyze returns gapAnalysis + studyPlan
- All routes return proper error on failure

---

## PHASE 3 — INPUT COMPONENTS

### Tell Antigravity: "Execute Phase 3 from GEMINI.md"

### Files to build: 4

1. src/components/input/InputToggle.jsx
   - 'use client'
   - Props: onProfileReady(profile)
   - Three toggle buttons: LinkedIn PDF, Resume PDF, Manual Form
   - MOBILE: grid grid-cols-1 gap-2
   - DESKTOP md:: grid-cols-3
   - Active: border-2 border-purple-500 bg-purple-950
   - Inactive: border border-gray-700 hover:border-gray-500
   - Each button: emoji icon (font-size 16px) + label + subtitle
   - Renders LinkedInUpload / ResumeUpload / ManualForm below
   - Passes onProfileReady down to active component

2. src/components/input/LinkedInUpload.jsx
   - 'use client'
   - Props: onProfileReady(profile)
   - Upload zone: border-2 border-dashed border-gray-700
     rounded-xl p-8 text-center cursor-pointer min-h-[120px]
   - Accept PDF only: input type=file accept=application/pdf
   - Import pdfToBase64 from @/lib/pdfToBase64
   - On file: convert to base64, POST to /api/parse-profile
     with type: 'linkedin'
   - Show spinner while uploading
   - Show extracted name + skills preview after parsing
   - Hint: "LinkedIn → More → Save to PDF"
   - Green CTA: "Analyze my profile →" w-full min-h-[44px]
   - Chrome/Edge warning for voice features
   - Error state if not PDF or parse fails

3. src/components/input/ResumeUpload.jsx
   - Same structure as LinkedInUpload
   - type: 'resume'
   - Hint: "Upload any resume PDF"
   - Different label text

4. src/components/input/ManualForm.jsx
   - 'use client'
   - Props: onProfileReady(profile)
   - Import skillCategories from @/data/skills
   - CGPA: number input 0-10 step=0.1
   - Year of study: select 1st/2nd/3rd/4th
   - Skills: checkbox grid from skillCategories
     Each category has colored header + checkboxes below
   - Projects count: number input
   - Internship: yes/no toggle buttons
   - MOBILE: single column full width inputs
   - DESKTOP md:: some rows grid-cols-2
   - Submit: builds profile object, calls onProfileReady

### Verify Phase 3:

- Toggle switches between 3 modes correctly
- PDF upload shows preview after parsing
- Manual form collects all fields

---

## PHASE 4 — DASHBOARD COMPONENTS

### Tell Antigravity: "Execute Phase 4 from GEMINI.md"

### Files to build: 5

1. src/components/dashboard/SkillBadge.jsx
   - Props: skill (string), type ('have' | 'missing')
   - have: bg-green-900 text-green-400 border border-green-700
   - missing: bg-red-900 text-red-400 border border-red-700
   - rounded-full text-xs px-2 py-0.5 inline-block

2. src/components/dashboard/StrengthCard.jsx
   - Props: summary, urgentActions[]
   - bg-green-950 border border-green-800 rounded-xl p-4
   - "Your strengths" label xs uppercase green-600
   - Summary in green-200
   - "This week's actions" subtitle
   - urgentActions as numbered list green-300
   - Full width mobile + desktop

3. src/components/dashboard/StatsRow.jsx
   - Props: ready, stretch, future (numbers)
   - grid grid-cols-3 gap-3 always
   - Each: bg-gray-900 rounded-xl p-4 text-center
   - ready: text-green-400 text-3xl font-medium
   - stretch: text-amber-400 text-3xl font-medium
   - future: text-red-400 text-3xl font-medium
   - Label below: text-xs text-gray-500

4. src/components/dashboard/CompanyCard.jsx
   - Props: company (object), type ('ready'|'stretch'|'future')
   - ready: border-l-4 border-green-600
   - stretch: border-l-4 border-amber-600
   - future: border-l-4 border-red-600
   - Show: name, role, package, rounds count, location
   - stretch only: missing skills as SkillBadge components
   - Expandable topper tip (tap to toggle)
   - Framer Motion: initial opacity-0 y-4, animate opacity-1 y-0
   - MOBILE: full width rounded-xl p-4
   - Import SkillBadge from @/components/dashboard/SkillBadge

5. src/components/dashboard/CompanyBoard.jsx
   - Props: ready[], stretch[], future[]
   - Import CompanyCard from @/components/dashboard/CompanyCard
   - MOBILE: 3 stacked sections full width
     Colored label + count badge per section
   - DESKTOP md:: grid grid-cols-3 gap-4
   - Framer Motion staggerChildren 0.08s
   - Empty state if section has no companies

### Verify Phase 4:

- SkillBadge shows green/red correctly
- CompanyBoard shows 3 color-coded sections
- CompanyCard expands topper tip on click
- Animations play on mount

---

## PHASE 5 — PLAN + LEADERBOARD

### Tell Antigravity: "Execute Phase 5 from GEMINI.md"

### Files to build: 3

1. src/components/plan/WeeklyPlan.jsx
   - Props: plan { weeks[], totalHours, targetCompany }
   - Header: "X hours to reach targetCompany"
   - Week tabs: Week 1 / 2 / 3 / 4
   - MOBILE: flex overflow-x-auto scrollable tabs
   - DESKTOP: flex gap-2 no scroll
   - Active tab: bg-purple-900 text-purple-200 border-purple-600
   - Inactive: border-gray-700 text-gray-400
   - Each week: theme + daily hours subtitle
   - Task rows: day range | task text | resource link
   - Weekly goal box: bg-gray-800 rounded-lg p-3
   - MOBILE: full width comfortable padding py-3

2. src/components/plan/ProgressTracker.jsx
   - Props: tasks[], planId
   - Load checked from localStorage key: placementiq\_${planId}
   - Each task: checkbox + task text (line-through when checked)
   - Checkbox: min-w-[20px] min-h-[20px] cursor-pointer
   - MOBILE: py-3 min-h-[44px] full touch target
   - Progress: checkedCount / total \* 100
   - Animated progress bar bg-[#006633]
   - Summary: "X of Y hours completed"
   - Save to localStorage on checkbox change

3. src/components/leaderboard/Leaderboard.jsx
   - 'use client'
   - Import supabase from @/lib/supabase
   - Import useUser from @/hooks/useUser
   - Fetch top 10 students ordered by ready_companies length
   - Calculate readiness %: ready_companies.length / 53 \* 100
   - Highlight current user row: bg-purple-950 border-purple-700
   - Real-time: supabase.channel subscription on students table
   - MOBILE: full width rows px-3 py-3
   - DESKTOP: max-w-lg mx-auto

### Verify Phase 5:

- WeeklyPlan shows 4 tabs switching correctly
- ProgressTracker saves across page refresh
- Leaderboard fetches real Supabase data

---

## PHASE 6 — INTERVIEW FEATURE

### Tell Antigravity: "Execute Phase 6 from GEMINI.md"

### Files to build: 8

<!-- 1. src/components/interview/VoiceRecorder.jsx
   - 'use client'
   - Props: onAnswer(transcript), timeLimit
   - window.SpeechRecognition || window.webkitSpeechRecognition
   - continuous=true, interimResults=true, lang='en-IN'
   - Show Chrome/Edge warning if not supported
   - Not recording: green "Start speaking" button min-h-[44px]
   - Recording: red pulsing dot + timer + live transcript
     + "Stop & next →" button
   - Auto-stop at timeLimit if set
   - MOBILE: full width buttons

2. src/components/interview/QuestionCard.jsx
   - Props: question { question, type, hint }, number, total
   - bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6
   - Type badge: Technical=blue, HR=purple, Behavioral=amber
   - Question number: text-xs text-gray-500
   - Question text: text-white text-base leading-relaxed
   - Hint: italic text-xs text-gray-500 mt-3

3. src/components/interview/InterviewProgress.jsx
   - Props: current, total, company
   - Company name + "Mock Interview" title
   - "Question X of Y" right aligned
   - Thin progress bar bg-[#006633] h-1 animated width

4. src/components/interview/ReportCard.jsx
   - Props: answer { question, score, grade, whatWasGood,
     whatWasMissing, idealAnswer }
   - Collapsed by default, click to expand
   - Header: truncated question + grade badge + score%
   - Grade: A=green, B=blue, C=amber, D=red
   - Expanded: whatWasGood (green), whatWasMissing (red),
     idealAnswer (gray) with labels

5. src/components/interview/OverallScore.jsx
   - Props: score, verdict, recommendation,
     strengths[], weaknesses[], nextSteps[]
   - Score: text-6xl font-medium
   - 80+=green-400, 60-79=amber-400, below 60=red-400
   - Verdict text below score
   - Hire badge: yes=green, consider=amber, no=red
   - Strengths: green checkmarks
   - Weaknesses: red X marks
   - Next steps: numbered list

6. src/app/interview/page.jsx
   - 'use client'
   - Import companies from @/data/companies
   - Company dropdown from companies names
   - Interview type: Technical / HR / Mixed toggle
   - Question count: 5 / 8 / 10 selector
   - "Start Interview →" green button full width mobile
   - POST to /api/interview-questions on start
   - Save to localStorage: interviewQuestions, interviewMeta
   - router.push('/interview/session')
   - Loading spinner while generating

7. src/app/interview/session/page.jsx
   - 'use client'
   - Load questions from localStorage interviewQuestions
   - If empty: redirect to /interview
   - Show InterviewProgress + QuestionCard + VoiceRecorder
   - On answer: push to answers state
   - On last: save to localStorage interviewAnswers
     router.push('/interview/report')
   - Skip button for fallback
   - MOBILE: stacked full width px-4

8. src/app/interview/report/page.jsx
   - 'use client'
   - Load from localStorage: interviewAnswers, interviewMeta
   - If empty: redirect to /interview
   - POST to /api/interview-report on mount
   - Show LoadingState while generating
   - OverallScore at top full width
   - "Question Breakdown" section
   - ReportCard per answer with stagger animation
   - "Practice again" → /interview
   - "Back to dashboard" → /results

### Verify Phase 6:
- /interview shows company selector
- /interview/session records voice + shows transcript
- /interview/report shows full scorecard

--- -->

## PHASE 6 — ELEVENLABS AI INTERVIEW FEATURE

### Tell Antigravity: "Execute Phase 6 from GEMINI.md"

### Files to build: 6 (Updated for ElevenLabs SDK)

1. src/components/interview/VoiceInterface.jsx
   - 'use client'
   - Import { useConversation } from '@elevenlabs/react'
   - Props: onInterviewEnd(transcriptHistory)
   - State: transcript array to store conversation history
   - useConversation hook:
     - onConnect: set status to 'interviewing'
     - onMessage: push { role: 'ai' | 'user', text: message } to transcript state
     - onDisconnect: call onInterviewEnd(transcript)
   - UI:
     - Center screen pulsing orb (Framer Motion) when agent isSpeaking
     - "Start Interview" primary green button
     - "End Interview & Get Feedback" red button when connected
   - MOBILE: full width buttons, large touch targets

2. src/app/api/interview-report/route.js
   - POST handler
   - Import geminiModel from @/lib/gemini
   - Accept { transcript[], company, role }
   - Prompt Gemini 1.5 Flash to evaluate the entire transcript
   - Report JSON: { overallScore, overallVerdict,
     hireRecommendation, specificFeedback[{ question,
     score, whatWasGood, whatWasMissing, idealAnswer, grade }],
     topStrengths[], topWeaknesses[], nextSteps[] }
   - Return Response.json(report)

3. src/components/interview/ReportCard.jsx
   - Props: feedback { question, score, grade, whatWasGood, whatWasMissing, idealAnswer }
   - Collapsed by default, click to expand
   - Header: truncated question + grade badge + score%
   - Grade: A=green, B=blue, C=amber, D=red
   - Expanded: whatWasGood (green), whatWasMissing (red), idealAnswer (gray)

4. src/components/interview/OverallScore.jsx
   - Props: score, verdict, recommendation, strengths[], weaknesses[], nextSteps[]
   - Score: text-6xl font-medium
   - 80+=green-400, 60-79=amber-400, below 60=red-400
   - Hire badge: yes=green, consider=amber, no=red
   - Strengths: green checkmarks
   - Weaknesses: red X marks
   - Next steps: numbered list

5. src/app/interview/page.jsx
   - 'use client'
   - Import companies from @/data/companies
   - Form: Company dropdown, Role input, Interview Focus (Technical/HR)
   - "Connect to AI Interviewer →" green button
   - Save selection to localStorage: interviewMeta
   - router.push('/interview/session')

6. src/app/interview/session/page.jsx
   - 'use client'
   - Load interviewMeta from localStorage
   - Render VoiceInterface component
   - Handle onInterviewEnd:
     - Save transcript to localStorage
     - router.push('/interview/report')

7. src/app/interview/report/page.jsx
   - 'use client'
   - Load from localStorage: transcript, interviewMeta
   - POST to /api/interview-report on mount
   - Show LoadingState ("AI is grading your interview...")
   - Render OverallScore at top
   - Render ReportCard array below for question-by-question breakdown
   - "Back to dashboard" → /results

## PHASE 7 — ALL PAGES + NAVBAR

### Tell Antigravity: "Execute Phase 7 from GEMINI.md"

### Files to build: 5

1. src/components/shared/LoadingState.jsx
   - 3 animated dots: purple, teal, green (CSS keyframes)
   - Title: "Analyzing your profile"
   - Subtitle: "Comparing against 53 companies"
   - Animated progress bar bg-purple-600
   - Step tracker:
     Done: green dot "PDF extracted"
     Active: pulsing purple dot "Running gap analysis..."
     Pending: gray dot "Generating study plan"

2. src/components/layout/Navbar.jsx
   - 'use client'
   - Import useUser from @/hooks/useUser
   - Import supabase from @/lib/supabase
   - MOBILE: logo left + hamburger right
     Drawer full width slides down on tap
     Drawer: How it works, Leaderboard, AI Interview links
     Drawer bottom: user name + Sign out
   - DESKTOP md:: logo left + nav links center + user + signout
   - Logo: "PlacementIQ" green accent + "· NIT Jalandhar" gray
   - Sign out: supabase.auth.signOut() → router.push('/login')

3. src/app/home/page.jsx
   NOT protected — public route
   Import Link from next/link

   NAVBAR:
   Logo left, "Sign in" ghost + "Get started →" green → /login

   HERO:
   - Badge: "Built for NIT Jalandhar · HackMol 7.0"
     bg-purple-900 text-purple-300 rounded-full px-3 py-1 text-xs
   - Title: "Know if you're ready for campus placements"
     text-3xl md:text-4xl font-medium
   - "placements" in text-[#006633]
   - Subtitle: text-sm md:text-base text-gray-400 max-w-md
   - CTAs: "Check my readiness →" green → /login
     "See how it works" ghost smooth scroll #how
   - Stats: 53 companies · 10s results · 4-week plan
   - MOBILE: px-4 stacked full width buttons
   - DESKTOP: max-w-2xl mx-auto centered

   HOW IT WORKS (id="how"):
   - 3 step cards: Upload → AI analyzes → Get roadmap
   - MOBILE: grid-cols-1, DESKTOP md:: grid-cols-3

   WHAT YOU GET:
   - 4 feature cards with colored dots
   - Company board / Skill gaps / Study plan / AI interview
   - MOBILE: grid-cols-1, DESKTOP md:: grid-cols-2

   COMPANIES:
   - Chips from companies.js, color by difficulty
   - hard: bg-red-950 text-red-400 border-red-800
   - medium: bg-amber-950 text-amber-400 border-amber-800
   - easy: bg-green-950 text-green-400 border-green-800
   - flex flex-wrap gap-2 justify-center + color legend

   TESTIMONIALS:
   - 2 student cards with avatar initials
   - MOBILE: grid-cols-1, DESKTOP md:: grid-cols-2

   CTA:
   - "Ready to find out where you stand?"
   - Green button → /login
   - "Free for all NIT Jalandhar students"

   FOOTER:
   - Logo left + "Built at HackMol 7.0 · NIT Jalandhar · 2026"
   - border-t border-gray-800 py-6

4. src/app/page.jsx
   - 'use client' — protected by middleware
   - Import Navbar from @/components/layout/Navbar
   - Import InputToggle from @/components/input/InputToggle
   - Import LoadingState from @/components/shared/LoadingState
   - Hero: "Are you placement ready?" text-2xl md:text-3xl
   - Subtitle gray-400
   - InputToggle with onProfileReady:
     1. setLoading(true) → show LoadingState
     2. POST profile to /api/analyze
     3. POST to /api/save-profile
     4. localStorage.setItem('placementResults', JSON.stringify(data))
     5. router.push('/results')
   - MOBILE: px-4 full width
   - DESKTOP: max-w-2xl mx-auto

5. src/app/results/page.jsx
   - 'use client' — protected by middleware
   - Import Navbar + all dashboard + plan + leaderboard components
   - On mount: load localStorage placementResults
   - If empty: router.push('/')
   - MOBILE layout (stacked):
     Navbar
     StrengthCard full width
     StatsRow full width
     CompanyBoard stacked
     WeeklyPlan full width
     ProgressTracker full width
     Leaderboard full width
     Fixed bottom bar: "Re-analyze" green button
     fixed bottom-0 left-0 right-0 bg-gray-900 border-t p-4
   - DESKTOP md: layout:
     StrengthCard + StatsRow top
     CompanyBoard 3 columns
     grid-cols-2: WeeklyPlan | ProgressTracker
     Leaderboard max-w-lg mx-auto
     Floating bottom-right "Re-analyze" button
     fixed bottom-6 right-6

### Verify Phase 7:

- /home loads without login
- / shows input toggle, analysis works
- /results shows full dashboard
- Navbar hamburger works on mobile
- Re-analyze links back to /

---

## SUPABASE TABLE

### Run this SQL in Supabase dashboard before demo

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

---

## FINAL PRE-DEMO CHECKLIST

```
□ Sign up with real email
□ Upload real LinkedIn PDF
□ Verify gap analysis is accurate
□ Click all 4 week tabs in study plan
□ Complete a full mock interview
□ Check leaderboard shows your entry
□ Test on mobile Chrome
□ Verify QR code → Vercel URL works
□ Prepare demo script
□ Have backup video recorded
```
