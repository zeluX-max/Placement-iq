import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY,
  ...(process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : []),
].filter(Boolean);

/**
 * Gets a fresh Gemini model instance with a rotated API key.
 * Uses random selection for balanced distribution in serverless environments.
 */
export function getGeminiModel(config = {}) {
  if (GEMINI_API_KEYS.length === 0) {
    throw new Error("Missing GEMINI_API_KEY/GEMINI_API_KEYS in environment");
  }

  const randomIndex = Math.floor(Math.random() * GEMINI_API_KEYS.length);
  const selectedKey = GEMINI_API_KEYS[randomIndex];
  
  // Debug log (masked key)
  console.log(`[Gemini] Using key rotation index: ${randomIndex} (ending in ${selectedKey.slice(-4)})`);

  const genAI = new GoogleGenerativeAI(selectedKey);
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    generationConfig: {
      maxOutputTokens: 500, // reduce from 800
      temperature: 0.3,     // lower = faster + cheaper
    },  // 1000 RPD free vs ~50 for 2.0, // Using 1.5-flash as per AGENTS.md rule 16 (Gemini 2.5/1.5 Flash API)
    ...config
  });
}

/**
 * Proxy object for geminiModel to maintain backward compatibility 
 * while enabling per-call API key rotation.
 */
export const geminiModel = {
  generateContent: async (content) => {
    let lastError;
    for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
      try {
        const model = getGeminiModel();
        return await model.generateContent(content);
      } catch (err) {
        if (err?.status === 429 || err?.message?.includes('429')) {
          console.warn(`[Gemini] 429 hit, trying next key (attempt ${i + 1}/${GEMINI_API_KEYS.length})`);
          lastError = err;
          // wait before retrying: 1s, 2s, 4s...
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  }
};


// Safely parse JSON from Gemini response
export function safeParseJSON(text) {
  try {
    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()
    return JSON.parse(clean)
  } catch (err) {
    console.error("JSON parse failed:", err)
    return null
  }
}

// Parse a LinkedIn or Resume PDF
export async function parseProfileFromPDF(base64PDF) {
  const result = await geminiModel.generateContent([
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
  ])

  return safeParseJSON(result.response.text())
}

// Run gap analysis against company database
export async function analyzeProfile(studentProfile, companies) {
  const result = await geminiModel.generateContent(`
    You are a placement advisor for NIT Jalandhar students.

    Student Profile:
    ${JSON.stringify(studentProfile)}

    Company Database:
    ${JSON.stringify(companies)}
    Analyze and return ONLY valid JSON. 
    LIMIT the 'ready' array to a maximum of 3 companies. 
    LIMIT the 'stretch' array to a maximum of 2 companies
    Analyze and return ONLY valid JSON, no markdown:
    {
      "ready": [
        {
          "name": "",
          "role": "",
          "avgPackage": "",
          "rounds": [],
          "topperTip": ""
        }
      ],
      "stretch": [
        {
          "name": "",
          "role": "",
          "avgPackage": "",
          "missingSkills": [],
          "gapSize": "small | medium | large",
          "topperTip": ""
        }
      ],
      "future": [
        {
          "name": "",
          "role": "",
          "avgPackage": "",
          "missingSkills": []
        }
      ],
      "strengthSummary": "",
      "topSkillGaps": [],
      "urgentActions": []
    }
  `)

  return safeParseJSON(result.response.text())
}

// Generate 4-week study plan
export async function generateStudyPlan(studentProfile, gapAnalysis) {
  const result = await geminiModel.generateContent(`
    You are a placement coach for NIT Jalandhar students.

    Student Profile:
    ${JSON.stringify(studentProfile)}

    Their Gap Analysis:
    ${JSON.stringify(gapAnalysis)}

    Generate a personalized study plan. 
    LIMIT the plan to 2 weeks instead of 4. 
    LIMIT the 'tasks' array to exactly 2 high-level tasks per week. 
    Keep task descriptions under 10 words. Return ONLY valid JSON:
    {
      "totalHours": 0,
      "targetCompany": "",
      "weeks": [
        {
          "weekNumber": 1,
          "theme": "",
          "dailyHours": 0,
          "tasks": [
            {
              "days": "Mon - Tue",
              "task": "",
              "resource": ""
            }
          ],
          "weeklyGoal": ""
        }
      ],
      "prioritySkills": []
    }
  `)

  return safeParseJSON(result.response.text())
}