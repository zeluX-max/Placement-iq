import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req) {
  try {
    const supabase = await supabaseServer()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { profile, gapAnalysis, studyPlan } = await req.json()

    if (!profile || !gapAnalysis || !studyPlan) {
      return Response.json({ error: 'Missing required data' }, { status: 400 })
    }

    const { error: insertError } = await supabase
      .from('students')
      .upsert({
        user_id: session.user.id,
        name: session.user.user_metadata?.full_name || profile.name || 'Anonymous',
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
