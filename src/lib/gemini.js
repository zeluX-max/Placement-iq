// import { GoogleGenerativeAI } from "@google/generative-ai"

// const GEMINI_API_KEYS = [
//   process.env.GEMINI_API_KEY,
//   ...(process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : []),
// ].filter(Boolean);

// /**
//  * Gets a fresh Gemini model instance with a rotated API key.
//  * Uses random selection for balanced distribution in serverless environments.
//  */
// export function getGeminiModel(config = {}) {
//   if (GEMINI_API_KEYS.length === 0) {
//     throw new Error("Missing GEMINI_API_KEY/GEMINI_API_KEYS in environment");
//   }

//   const randomIndex = Math.floor(Math.random() * GEMINI_API_KEYS.length);
//   const selectedKey = GEMINI_API_KEYS[randomIndex];
  
//   // Debug log (masked key)
//   console.log(`[Gemini] Using key rotation index: ${randomIndex} (ending in ${selectedKey.slice(-4)})`);

//   const genAI = new GoogleGenerativeAI(selectedKey);
//   return genAI.getGenerativeModel({
//     model: "gemini-2.0-flash-lite",
//     generationConfig: {
//       maxOutputTokens: 200, // reduce from 800
//       temperature: 0.1,     // lower = faster + cheaper
//     },  // 1000 RPD free vs ~50 for 2.0, // Using 1.5-flash as per AGENTS.md rule 16 (Gemini 2.5/1.5 Flash API)
//     ...config
//   });
// }

// /**
//  * Proxy object for geminiModel to maintain backward compatibility 
//  * while enabling per-call API key rotation.
//  */
// export const geminiModel = {
//   generateContent: async (content) => {
//     let lastError;
//     for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
//       try {
//         const model = getGeminiModel();
//         return await model.generateContent(content);
//       } catch (err) {
//         if (err?.status === 429 || err?.message?.includes('429')) {
//           console.warn(`[Gemini] 429 hit, trying next key (attempt ${i + 1}/${GEMINI_API_KEYS.length})`);
//           lastError = err;
//           // wait before retrying: 1s, 2s, 4s...
//           await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
//           continue;
//         }
//         throw err;
//       }
//     }
//     throw lastError;
//   }
// };


// // Safely parse JSON from Gemini response
// export function safeParseJSON(text) {
//   try {
//     const clean = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim()
//     return JSON.parse(clean)
//   } catch (err) {
//     console.error("JSON parse failed:", err)
//     return null
//   }
// }

// // Parse a LinkedIn or Resume PDF
// export async function parseProfileFromPDF(base64PDF) {
//   const result = await geminiModel.generateContent([
//     {
//       inlineData: {
//         mimeType: "application/pdf",
//         data: base64PDF
//       }
//     },
//     {
//       text: `Extract this profile and return ONLY valid JSON, no markdown:
//       {
//         "name": "",
//         "cgpa": null,
//         "yearOfStudy": "",
//         "skills": [],
//         "techStack": [],
//         "projects": [{ "name": "", "description": "" }],
//         "internships": [{ "company": "", "role": "" }],
//         "certifications": [],
//         "education": [{ "institution": "", "degree": "", "year": "" }]
//       }
//       If CGPA is not found, leave it null.`
//     }
//   ])

//   return safeParseJSON(result.response.text())
// }

// // Run gap analysis against company database
// export async function analyzeProfile(studentProfile, companies) {
//   const result = await geminiModel.generateContent(`
//     You are a placement advisor for NIT Jalandhar students.

//     Student Profile:
//     ${JSON.stringify(studentProfile)}

//     Company Database:
//     ${JSON.stringify(companies)}
//     Analyze and return ONLY valid JSON. 
//     Keep response under 200 tokens. Be extremely concise.
//     LIMIT the 'ready' array to a maximum of 3 companies. 
//     LIMIT the 'stretch' array to a maximum of 2 companies
//     Analyze and return ONLY valid JSON, no markdown:
//     {
//       "ready": [
//         {
//           "name": "",
//           "role": "",
//           "avgPackage": "",
//           "rounds": [],
//           "topperTip": ""
//         }
//       ],
//       "stretch": [
//         {
//           "name": "",
//           "role": "",
//           "avgPackage": "",
//           "missingSkills": [],
//           "gapSize": "small | medium | large",
//           "topperTip": ""
//         }
//       ],
//       "future": [
//         {
//           "name": "",
//           "role": "",
//           "avgPackage": "",
//           "missingSkills": []
//         }
//       ],
//       "strengthSummary": "",
//       "topSkillGaps": [],
//       "urgentActions": []
//     }
//   `)

//   return safeParseJSON(result.response.text())
// }

// // Generate 4-week study plan
// export async function generateStudyPlan(studentProfile, gapAnalysis) {
//   const result = await geminiModel.generateContent(`
//     You are a placement coach for NIT Jalandhar students.

//     Student Profile:
//     ${JSON.stringify(studentProfile)}

//     Their Gap Analysis:
//     ${JSON.stringify(gapAnalysis)}

//     Generate a personalized study plan. 
//     LIMIT the plan to 2 weeks instead of 4. 
//     LIMIT the 'tasks' array to exactly 2 high-level tasks per week. 
//     Keep response under 200 tokens. Be extremely concise.
//     Keep task descriptions under 10 words. Return ONLY valid JSON:
//     {
//       "totalHours": 0,
//       "targetCompany": "",
//       "weeks": [
//         {
//           "weekNumber": 1,
//           "theme": "",
//           "dailyHours": 0,
//           "tasks": [
//             {
//               "days": "Mon - Tue",
//               "task": "",
//               "resource": ""
//             }
//           ],
//           "weeklyGoal": ""
//         }
//       ],
//       "prioritySkills": []
//     }
//   `)

//   return safeParseJSON(result.response.text())
// }
import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generate(prompt) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.2,
  });
  return response.choices[0].message.content;
}

// Drop-in replacement — same interface as before
export const geminiModel = {
  generateContent: async (content) => {
    const prompt = Array.isArray(content)
      ? content.map(c => c.text || '').join('\n')
      : content;
    const text = await generate(prompt);
    return { response: { text: () => text } };
  }
};

export function getGeminiModel() {
  return geminiModel;
}

export function safeParseJSON(text) {
  try {
    // Find JSON object between first { and last }
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
      console.error("No JSON object found in:", text?.slice(0, 200));
      return null;
    }
    const clean = text.slice(start, end + 1);
    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON parse failed:", err);
    console.error("Raw text was:", text?.slice(0, 200));
    return null;
  }
}

export async function parseProfileFromPDF(base64PDF) {
  // Groq doesn't support PDF — extract text via Gemini fallback
  // For now return a manual profile structure
  const result = await geminiModel.generateContent([
    { inlineData: { mimeType: "application/pdf", data: base64PDF } },
    { text: `Extract profile, return ONLY JSON:
      {"name":"","cgpa":null,"yearOfStudy":"","skills":[],
      "techStack":[],"projects":[],"internships":[],
      "certifications":[],"education":[]}` }
  ]);
  return safeParseJSON(result.response.text());
}

export async function analyzeProfile(studentProfile, companies) {
  // Send only essential fields to save tokens
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

  // Deduplicate by name+role
  const seen = new Set();
  const uniqueCompanies = slimCompanies.filter(c => {
    const key = `${c.name}-${c.role}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const text = await generate(`
    IMPORTANT: Respond with ONLY a JSON object. No explanation, no markdown.
    You are a placement advisor for NIT Jalandhar.
    Student: ${JSON.stringify(studentProfile)}
    Companies: ${JSON.stringify(uniqueCompanies)}
    Return ONLY JSON, max 3 ready, 2 stretch, 2 future:
    {"ready":[{"name":"","role":"","avgPackage":"","rounds":[],"topperTip":""}],
    "stretch":[{"name":"","role":"","avgPackage":"","missingSkills":[],"gapSize":"","topperTip":""}],
    "future":[{"name":"","role":"","avgPackage":"","missingSkills":[]}],
    "strengthSummary":"","topSkillGaps":[],"urgentActions":[]}
  `);
  return safeParseJSON(text);
}

export async function generateStudyPlan(studentProfile, gapAnalysis) {
  const text = await generate(`
    You are a placement coach for NIT Jalandhar.
    Student: ${JSON.stringify(studentProfile)}
    Gaps: ${JSON.stringify(gapAnalysis)}
    Return ONLY JSON, 2 weeks, 2 tasks each, under 10 words per task:
    {"totalHours":0,"targetCompany":"","weeks":[
      {"weekNumber":1,"theme":"","dailyHours":0,
      "tasks":[{"days":"","task":"","resource":""}],
      "weeklyGoal":""}],"prioritySkills":[]}
  `);
  return safeParseJSON(text);
}
