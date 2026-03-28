
// import Groq from "groq-sdk";

// const client = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// async function generate(prompt) {
//   const response = await client.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [{ role: "user", content: prompt }],
//     max_tokens: 500,
//     temperature: 0.2,
//   });
//   return response.choices[0].message.content;
// }

// // Drop-in replacement — same interface as before
// export const geminiModel = {
//   generateContent: async (content) => {
//     const prompt = Array.isArray(content)
//       ? content.map(c => c.text || '').join('\n')
//       : content;
//     const text = await generate(prompt);
//     return { response: { text: () => text } };
//   }
// };

// export function getGeminiModel() {
//   return geminiModel;
// }

// export function safeParseJSON(text) {
//   try {
//     // Find JSON object between first { and last }
//     const start = text.indexOf('{');
//     const end = text.lastIndexOf('}');
//     if (start === -1 || end === -1) {
//       console.error("No JSON object found in:", text?.slice(0, 200));
//       return null;
//     }
//     const clean = text.slice(start, end + 1);
//     return JSON.parse(clean);
//   } catch (err) {
//     console.error("JSON parse failed:", err);
//     console.error("Raw text was:", text?.slice(0, 200));
//     return null;
//   }
// }

// export async function parseProfileFromPDF(base64PDF) {
//   // Groq doesn't support PDF — extract text via Gemini fallback
//   // For now return a manual profile structure
//   const result = await geminiModel.generateContent([
//     { inlineData: { mimeType: "application/pdf", data: base64PDF } },
//     { text: `Extract profile, return ONLY JSON:
//       {"name":"","cgpa":null,"yearOfStudy":"","skills":[],
//       "techStack":[],"projects":[],"internships":[],
//       "certifications":[],"education":[]}` }
//   ]);
//   return safeParseJSON(result.response.text());
// }

// export async function analyzeProfile(studentProfile, companies) {
//   // Send only essential fields to save tokens
//   const slimCompanies = companies.map(c => ({
//     name: c.name,
//     role: c.role,
//     difficulty: c.difficulty,
//     minCGPA: c.minCGPA,
//     avgPackage: c.avgPackage,
//     requiredSkills: c.requiredSkills,
//     rounds: c.rounds,
//     topperTip: c.topperTip
//   }));

//   // Deduplicate by name+role
//   const seen = new Set();
//   const uniqueCompanies = slimCompanies.filter(c => {
//     const key = `${c.name}-${c.role}`;
//     if (seen.has(key)) return false;
//     seen.add(key);
//     return true;
//   });

//   const text = await generate(`
//     IMPORTANT: Respond with ONLY a JSON object. No explanation, no markdown.
//     You are a placement advisor for NIT Jalandhar.
//     Student: ${JSON.stringify(studentProfile)}
//     Companies: ${JSON.stringify(uniqueCompanies)}
//     Return ONLY JSON, max 3 ready, 2 stretch, 2 future:
//     {"ready":[{"name":"","role":"","avgPackage":"","rounds":[],"topperTip":""}],
//     "stretch":[{"name":"","role":"","avgPackage":"","missingSkills":[],"gapSize":"","topperTip":""}],
//     "future":[{"name":"","role":"","avgPackage":"","missingSkills":[]}],
//     "strengthSummary":"","topSkillGaps":[],"urgentActions":[]}
//   `);
//   return safeParseJSON(text);
// }

// export async function generateStudyPlan(studentProfile, gapAnalysis) {
//   const text = await generate(`
//     You are a placement coach for NIT Jalandhar.
//     Student: ${JSON.stringify(studentProfile)}
//     Gaps: ${JSON.stringify(gapAnalysis)}
//     Return ONLY JSON, 2 weeks, 2 tasks each, under 10 words per task:
//     {"totalHours":0,"targetCompany":"","weeks":[
//       {"weekNumber":1,"theme":"","dailyHours":0,
//       "tasks":[{"days":"","task":"","resource":""}],
//       "weeklyGoal":""}],"prioritySkills":[]}
//   `);
//   return safeParseJSON(text);
// }
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

// --- 1. SETUP BOTH CLIENTS ---

// Setup Groq
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Setup Gemini (Using a single key for simplicity here, but you can add your rotation back if needed)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- 2. GROQ HELPER (For Analysis & Study Plan) ---

async function generateWithGroq(prompt) {
  const response = await groqClient.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    // MASSIVELY INCREASED TOKENS: Prevents the JSON from being cut off mid-sentence
    max_tokens: 4000, 
    temperature: 0.2,
    // FORCES clean JSON output
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
        "name": "",
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