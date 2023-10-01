import { Resend } from 'resend';
import { secrets } from '@/constant/secrets';
import { baseUrl } from '@/constant/env';

interface EmailTemplateProps {
  title: string;
  button: {
    text: string;
    url: string;
    target?: string;
  };
  description: string;
}
export function EmailTemplate({
  button,
  description,
  title,
}: EmailTemplateProps) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <html lang="en">
  
    <head></head>
    <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Your login code for Linear<div></div>
    </div>
  
    <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
      <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px;width:560px">
        <tr style="width:100%">
          <td>
            <span
              style="font-size:24px;font-weight:600;color:#484848;letter-spacing:-0.5px;line-height:1.3"
            >
            MiracleMarket 
            </span>
            <h1 style="font-size:24px;letter-spacing:-0.5px;line-height:1.3;font-weight:400;color:#484848;padding:17px 0 0">${title}</h1>
            <table style="padding:27px 0 27px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
              <tbody>
                <tr>
                  <td><a href="${button.url}" target="${
                    button.target ?? '_self'
                  }" style="background-color:#5e6ad2;border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-decoration:none;text-align:center;display:inline-block;p-x:23px;p-y:11px;line-height:100%;max-width:100%;padding:11px 23px"><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%;mso-text-raise:16.5" hidden>&nbsp;</i><![endif]--></span><span style="background-color:#5e6ad2;border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-decoration:none;text-align:center;display:inline-block;p-x:23px;p-y:11px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:8.25px">${
                    button.text
                  }</span><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
                </tr>
              </tbody>
            </table>
            <p style="font-size:15px;line-height:1.4;margin:0 0 15px;color:#3c4149">${description}</p>
            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dfe1e4;margin:42px 0 26px" /><a target="_blank" style="color:#b4becc;text-decoration:none;font-size:14px" href="">Miracle Market</a>
          </td>
        </tr>
      </table>
    </body>
  
  </html>`;
}

export const resend = new Resend(secrets.resend);

export function sendVerificationEmail(
  email: string,
  token: string,
  redirectUrl: string,
) {
  const url = `${baseUrl}/auth/verify-email/${token}?redirectUrl=${redirectUrl}`;
  return async () => {
    const data = await resend.emails.send({
      from: 'Miracle-Market <noreply@rinyato.com>',
      to: email,
      subject: 'Welcome to MiracleMarket',
      html: EmailTemplate({
        title: 'Please verify your email address to continue',
        button: {
          text: 'Click Here to Verify',
          url,
        },
        description:
          'Thanks for signing up for MiracleMarket! We’re excited to have you as an early user. Before you can start using MiracleMarket, please verify your email address by clicking the button above.',
      }),
    });

    return data;
  };
}
