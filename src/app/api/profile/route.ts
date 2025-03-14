// import { NextResponse } from 'next/server';
// import { ensureUserProfile } from '@/lib/API/Services/supabase/user';

// export async function GET() {
//   try {
//     const sessionData = await ensureUserProfile();
//     if (!sessionData) {
//       return NextResponse.json({ error: 'No session found' }, { status: 401 });
//     }

//     return NextResponse.json({
//       session: sessionData. Supabase session
//       user: sessionData.user, // Supabase user (includes email)
//       profile: sessionData.profile // User profile from Supabase DB
//     });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
//   }
// }
