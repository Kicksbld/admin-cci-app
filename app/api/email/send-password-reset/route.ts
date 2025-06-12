// app/api/send-reset-email/route.ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/app/lib/email';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, url } = body;

  if (!email || !url) {
    return NextResponse.json({ error: 'Missing email or URL' }, { status: 400 });
  }

  try {
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      text: `Click the link to reset your password: ${url}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
