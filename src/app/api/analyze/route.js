import { analyzeProfile, generateStudyPlan } from '@/lib/gemini'
import { companies } from '@/data/companies'


export const maxDuration = 60;
export async function POST(req) {
  try {
    const { profile } = await req.json()
    
    if (!profile) {
      return Response.json({ error: 'Missing profile data' }, { status: 400 })
    }

    // Call both functions in parallel or sequence, as they depend on each other's data
    const gapAnalysis = await analyzeProfile(profile, companies)
    
    if (!gapAnalysis) {
      return Response.json({ error: 'Failed to perform gap analysis' }, { status: 500 })
    }

    const studyPlan = await generateStudyPlan(profile, gapAnalysis)

    if (!studyPlan) {
      return Response.json({ error: 'Failed to generate study plan' }, { status: 500 })
    }

    return Response.json({ gapAnalysis, studyPlan })
  } catch (error) {
    console.error('Analyze API Error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
