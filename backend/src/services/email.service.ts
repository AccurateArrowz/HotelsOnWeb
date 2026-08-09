import { Resend } from 'resend';

let resend: Resend | null = null;

/**
 * Get or initialize Resend client
 */
function getResendClient(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

/**
 * Email service for sending transactional emails
 */
export class EmailService {
  /**
   * Send staff invitation email
   */
  static async sendInvitationEmail(
    invitedEmail: string,
    hotelName: string,
    inviterName: string,
    roleName: string,
    acceptLink: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const resendClient = getResendClient();
      const result = await resendClient.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@hotelsonweb.com',
        to: invitedEmail,
        subject: `You're invited to join ${hotelName} as ${roleName}`,
        html: this.getInvitationEmailHTML(hotelName, inviterName, roleName, acceptLink),
      });

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[EmailService] Failed to send invitation email:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Generate invitation email HTML
   */
  private static getInvitationEmailHTML(
    hotelName: string,
    inviterName: string,
    roleName: string,
    acceptLink: string
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 20px;
    }
    .content h2 {
      color: #1e293b;
      font-size: 20px;
      margin-top: 0;
    }
    .content p {
      color: #64748b;
      margin: 12px 0;
    }
    .highlight {
      background-color: #f1f5f9;
      border-left: 4px solid #667eea;
      padding: 16px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .highlight strong {
      color: #1e293b;
    }
    .cta-button {
      display: inline-block;
      background-color: #667eea;
      color: white;
      padding: 12px 32px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
      transition: background-color 0.3s;
    }
    .cta-button:hover {
      background-color: #5568d3;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #94a3b8;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HotelsOnWeb</h1>
    </div>
    
    <div class="content">
      <h2>You're invited to join ${hotelName}!</h2>
      
      <p>Hi there,</p>
      
      <p><strong>${inviterName}</strong> has invited you to join <strong>${hotelName}</strong> as a <strong>${roleName}</strong>.</p>
      
      <div class="highlight">
        <p><strong>Hotel:</strong> ${hotelName}</p>
        <p><strong>Role:</strong> ${roleName}</p>
        <p><strong>Invited by:</strong> ${inviterName}</p>
      </div>
      
      <p>Click the button below to accept the invitation and create your account:</p>
      
      <center>
        <a href="${acceptLink}" class="cta-button">Accept Invitation</a>
      </center>
      
      <p style="color: #94a3b8; font-size: 12px;">
        If the button above doesn't work, copy and paste this link in your browser:<br>
        <code style="background-color: #f1f5f9; padding: 4px 8px; border-radius: 4px; word-break: break-all;">${acceptLink}</code>
      </p>
      
      <p style="margin-top: 30px; color: #94a3b8; font-size: 14px;">
        This invitation will expire in 7 days. If you have any questions, please contact the hotel directly.
      </p>
    </div>
    
    <div class="footer">
      <p>© 2026 HotelsOnWeb. All rights reserved.</p>
      <p><a href="https://hotelsonweb.com">Visit our website</a></p>
    </div>
  </div>
</body>
</html>
    `;
  }
}
