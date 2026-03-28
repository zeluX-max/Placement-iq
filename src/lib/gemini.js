import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
})
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json", // This forces pure JSON output instantly
  }
});
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