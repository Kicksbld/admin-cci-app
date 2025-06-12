import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ecole By CCI <noreply@cbk-portfolio.com>', 
      to,
      subject,
      text,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error('Email sending error:', err);
    throw err;
  }
}
