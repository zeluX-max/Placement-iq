import { supabaseServer } from '@/lib/supabase-server'
import { auth, currentUser } from '@clerk/nextjs/server'

export async function POST(req) {
  try {
    const supabase = await supabaseServer()
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clerkUser = await currentUser()
    const fullName = clerkUser ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() : null;

    const { profile, gapAnalysis, studyPlan } = await req.json()

    if (!profile || !gapAnalysis || !studyPlan) {
      return Response.json({ error: 'Missing required data' }, { status: 400 })
    }

    const { error: insertError } = await supabase
      .from('students')
      .upsert({
        user_id: userId,
        name: fullName || profile.name || 'Anonymous',
        cgpa: profile.cgpa,
        skills: profile.skills || [],
        ready_companies: gapAnalysis.ready ? gapAnalysis.ready.map(c => c.name) : [],
        stretch_companies: gapAnalysis.stretch ? gapAnalysis.stretch.map(c => c.name) : [],
        gap_analysis: gapAnalysis,
        study_plan: studyPlan
      }, { onConflict: 'user_id' })

    if (insertError) {
      console.error('Supabase save error:', insertError)
      throw insertError
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Save Profile API Error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
