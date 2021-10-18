import { createTransport, getTestMessageUrl } from 'nodemailer';
import 'dotenv/config';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function emailTemplate(link: string, to: string): string {
  return `
    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ebecf0;">
      <tr>
        <td align="left" style="padding:0;">
          <table role="presentation" style="width:100%;border-collapse:collapse;border-spacing:0;">
            <tr>
              <td align="left" >
                  <div style="margin:20px;background:#fff;border-radius:10px;padding:40px;border:1px solid white;">
                      <h1 style="
                          font-size: 2rem;
                          background: red;
                          margin: 0;
                          text-align: center;
                          max-width: -webkit-fit-content;
                          max-width: -moz-fit-content;
                          max-width: fit-content;
                          padding: 5px 20px;
                          -webkit-transform: skewX(
                      -7deg);
                          -ms-transform: skewX(-7deg);
                          transform: skewX(
                      -7deg);
                          color: white;
                          text-transform: uppercase;
                          z-index: 2;
                          font-family: sans-serif;
                      ">Sick fits</h1>
                      <hr style="margin: 40px 0;"/>
                      <div style="font-size: 1.2rem; font-family:sans-serif">
                          <p>Hello,</p>
                          <p>We've received a request to reset the password for the Sick Fits account <em>${to}</em>.</p>
                          <p>Please reset your password by click the link below:</p>
                          <a href="${link}" style="display: block;max-width:700px;text-align: center;text-decoration:none;margin: 10px 0;padding: 15px 10px; cursor:pointer; font-weight: 600;font-size: 1.2rem; width: 100%;background: red;color: white;border: none;border-radius: 10px;">Reset your password</a>
                          <p>If you did not request a new password, please tell us immediately by replying to this email</p>
                          <p>&mdash; Sick Fits team 👋</p>
                      </div>
                  </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

export interface Envelope {
  from: string;
  to: string[] | null;
}

export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}

export async function sendPasswordEmail(
  resetToken: string,
  to: string
): Promise<void> {
  const info = (await transport.sendMail({
    from: 'zak.ali@sickfits.com',
    to,
    html: emailTemplate(
      `${process.env.FRONTEND_URL}/reset?token=${resetToken}`,
      to
    ),
  })) as MailResponse;

  if (process.env.MAIL_HOST.includes('mailtrap')) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Preview email sent: ${getTestMessageUrl(info)}`);
  }
}
