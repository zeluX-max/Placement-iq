
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

// --- 1. SETUP BOTH CLIENTS ---

// Setup Groq
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Setup Gemini (Using a single key fors simplicity here, but you can add your rotation back if needed)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- 2. GROQ HELPER (For Analysis & Study Plan) ---

async function generateWithGroq(prompt) {
  const response = await groqClient.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4000, 
    temperature: 0.2,
    response_format: { type: "json_object" } 
  });
  return response.choices[0].message.content;
}

// --- 3. JSON PARSER ---

export function safeParseJSON(text) {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
      console.error("No JSON object found.");
      return null;
    }
    const clean = text.slice(start, end + 1);
    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON parse failed:", err);
    return null;
  }
}

// --- 4. EXPORTED FUNCTIONS ---

// READ PDF: Uses Gemini because Groq cannot read PDFs
export async function parseProfileFromPDF(base64PDF) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Or gemini-1.5-flash
  
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "application/pdf",
        data: base64PDF
      }
    },
    {
      text: `Extract this profile and return ONLY valid JSON, no markdown:
      {
        
        "cgpa": null,
        "yearOfStudy": "",
        "skills": [],
        "techStack": [],
        "projects": [{ "name": "", "description": "" }],
        "internships": [{ "company": "", "role": "" }],
        "certifications": [],
        "education": [{ "institution": "", "degree": "", "year": "" }]
      }
      If CGPA is not found, leave it null.`
    }
  ]);

  return safeParseJSON(result.response.text());
}

// GAP ANALYSIS: Uses Groq for speed and reasoning
export async function analyzeProfile(studentProfile, companies) {
  const slimCompanies = companies.map(c => ({
    name: c.name,
    role: c.role,
    difficulty: c.difficulty,
    minCGPA: c.minCGPA,
    avgPackage: c.avgPackage,
    requiredSkills: c.requiredSkills,
    rounds: c.rounds,
    topperTip: c.topperTip
  }));

  const text = await generateWithGroq(`
    IMPORTANT: Respond with ONLY a JSON object. No explanation, no markdown.
    You are a placement advisor for NIT Jalandhar.
    Student: ${JSON.stringify(studentProfile)}
    Companies: ${JSON.stringify(slimCompanies)}
    Return ONLY JSON, max 3 ready, 2 stretch, 2 future:
    {
      "ready":[{"name":"","role":"","avgPackage":"","rounds":[],"topperTip":""}],
      "stretch":[{"name":"","role":"","avgPackage":"","missingSkills":[],"gapSize":"","topperTip":""}],
      "future":[{"name":"","role":"","avgPackage":"","missingSkills":[]}],
      "strengthSummary":"",
      "topSkillGaps":[],
      "urgentActions":[]
    }
  `);
  return safeParseJSON(text);
}

// STUDY PLAN: Uses Groq for speed and reasoning
export async function generateStudyPlan(studentProfile, gapAnalysis) {
  const text = await generateWithGroq(`
    You are a placement coach for NIT Jalandhar.
    Student: ${JSON.stringify(studentProfile)}
    Gaps: ${JSON.stringify(gapAnalysis)}
    Return ONLY JSON, 2 weeks, 2 tasks each, under 10 words per task:

    For the "resource" field, use these exact roadmap.sh URLs based on the task topic:
    - Java/Spring: https://roadmap.sh/java
    - Python: https://roadmap.sh/python  
    - JavaScript: https://roadmap.sh/javascript
    - React: https://roadmap.sh/react
    - Node.js: https://roadmap.sh/nodejs
    - SQL/Database: https://roadmap.sh/sql
    - DSA: https://roadmap.sh/datastructures-and-algorithms
    - System Design: https://roadmap.sh/system-design
    - DevOps: https://roadmap.sh/devops
    - Backend: https://roadmap.sh/backend
    - Frontend: https://roadmap.sh/frontend
    - Git: https://roadmap.sh/git-github
    - Docker: https://roadmap.sh/docker
    - AWS/Cloud: https://roadmap.sh/aws
    - Cybersecurity: https://roadmap.sh/cyber-security
    If no exact match, use https://roadmap.sh

    {
      "totalHours":0,
      "targetCompany":"",
      "weeks":[
        {
          "weekNumber":1,
          "theme":"",
          "dailyHours":0,
          "tasks":[{"days":"","task":"","resource":""}],
          "weeklyGoal":""
        }
      ],
      "prioritySkills":[]
    }
  `);
  return safeParseJSON(text);
}
// --- 5. LEGACY PROXY (For Interview Routes) ---
// This keeps interview-questions and interview-report from breaking
export const geminiModel = {
  generateContent: async (content) => {
    // Extract the text prompt, ignoring any complex Gemini-specific formatting
    const prompt = Array.isArray(content)
      ? content.map(c => c.text || '').join('\n')
      : content;
      
    // Route the prompt through our new Groq helper
    const text = await generateWithGroq(prompt);
    
    // Return it in the shape the old code expects: result.response.text()
    return { response: { text: () => text } };
  }
};