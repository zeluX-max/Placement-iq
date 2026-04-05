import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function clerkIdToUuid(clerkId) {
  if (!clerkId) return null;
  const hash = crypto.createHash('md5').update(clerkId).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    hash.substring(12, 16),
    hash.substring(16, 20),
    hash.substring(20, 32)
  ].join('-');
}

export async function POST(req) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const uuid = clerkIdToUuid(userId);

    const clerkUser = await currentUser()
    const fullName = clerkUser ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() : null;

    const { profile, gapAnalysis, studyPlan } = await req.json()

    if (!profile || !gapAnalysis || !studyPlan) {
      return Response.json({ error: 'Missing required data' }, { status: 400 })
    }

    const { error: insertError } = await supabase
      .from('students')
      .upsert({
        user_id: uuid,
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
