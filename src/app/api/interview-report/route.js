import { geminiModel, safeParseJSON } from '@/lib/gemini'

export async function POST(req) {
  try {
    const { transcript, company, role } = await req.json()
    
    if (!transcript || transcript.length === 0 || !company || !role) {
      return Response.json({ error: 'Missing interview transcript or metadata' }, { status: 400 })
    }

    // Format transcript for the prompt
    const transcriptText = transcript
      .map(m => `${m.role.toUpperCase()}: ${m.text}`)
      .join('\n')

    const prompt = `
      You are an expert technical and HR interviewer at ${company}. 
      Evaluate the following mock interview transcript for a ${role} position.
      
      TRANSCRIPT:
      ${transcriptText}
      
      Generate a detailed evaluation report. Identify the key questions asked and provide feedback for each.
      Return ONLY valid JSON, no markdown:
      {
        "overallScore": 0-100,
        "overallVerdict": "Strategic summary of the performance",
        "hireRecommendation": "yes | consider | no",
        "specificFeedback": [
          {
            "question": "The question or topic covered",
            "score": 0-100,
            "grade": "A | B | C | D",
            "whatWasGood": "Positive aspects of the response",
            "whatWasMissing": "Missing or weak points",
            "idealAnswer": "How a top candidate would answer this"
          }
        ],
        "topStrengths": ["Strength 1", "Strength 2"],
        "topWeaknesses": ["Weakness 1", "Weakness 2"],
        "nextSteps": ["Actionable improvement 1", "Actionable improvement 2"]
      }
    `

    const result = await geminiModel.generateContent(prompt)
    const report = safeParseJSON(result.response.text())

    if (!report) {
      return Response.json({ error: 'Failed to generate grading report' }, { status: 500 })
    }

    return Response.json(report)
  } catch (error) {
    console.error('Interview Report API Error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
