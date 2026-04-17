// ============================================================
// Weekly Digest Email Template
// Converts a WeeklyReport into branded HTML for owner inbox
// ============================================================

import type { WeeklyReport, RetainerClient } from "../types";

export interface EmailTemplateOutput {
  subject: string;
  htmlBody: string;
  plainText: string;
}

export function buildWeeklyDigest(
  report: WeeklyReport,
  client: RetainerClient
): EmailTemplateOutput {
  const firstName = client.contactName.split(" ")[0];
  const weekStart = new Date(report.weekStarting).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const weekEnd = new Date(report.weekEnding).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const subject = `${client.companyName} weekly: $${report.highlights.revenueRecovered.toLocaleString()} recovered, ${report.highlights.actionItemsCompleted} actions done`;

  const concernsHtml =
    report.concerns.length > 0
      ? `
<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px;margin:20px 0;border-radius:2px;">
  <p style="margin:0 0 8px 0;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#dc2626;">
    Flagged for your attention
  </p>
  <ul style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:1.6;">
    ${report.concerns.map((c) => `<li style="margin-bottom:8px;">${c}</li>`).join("")}
  </ul>
</div>`
      : "";

  const topPerformersHtml = report.topPerformers
    .map((p, i) => {
      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
      return `
<tr>
  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;">
    <span style="font-size:18px;margin-right:8px;">${medal}</span>
    <strong>${p.name}</strong>
  </td>
  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;text-align:right;">
    <strong style="color:#B87333;">${p.score}/100</strong>
  </td>
</tr>`;
    })
    .join("");

  const prioritiesHtml = report.nextWeekPriorities
    .map(
      (p, i) => `
<tr>
  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;vertical-align:top;">
    <strong style="color:#B87333;margin-right:8px;">${i + 1}.</strong>
    ${p}
  </td>
</tr>`
    )
    .join("");

  const recoveryDelta = report.weekOverWeek.recoveryChange;
  const deltaLabel =
    recoveryDelta > 0
      ? `<span style="color:#059669;">▲ $${recoveryDelta.toLocaleString()}</span>`
      : recoveryDelta < 0
      ? `<span style="color:#dc2626;">▼ $${Math.abs(recoveryDelta).toLocaleString()}</span>`
      : `<span style="color:#6b7280;">→ flat</span>`;

  const htmlBody = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1f2937;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5f5f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:4px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#0A0A0A;padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#B87333;">
                      Weekly Performance · ${weekStart} – ${weekEnd}
                    </p>
                    <h1 style="margin:6px 0 0 0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                      ${client.companyName}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting + summary -->
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <p style="margin:0 0 14px 0;font-size:16px;">${firstName},</p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#4b5563;">
                ${report.summary}
              </p>
            </td>
          </tr>

          <!-- Hero recovery number -->
          <tr>
            <td style="padding:0 32px;">
              <div style="background:linear-gradient(135deg,#B87333 0%,#8b5a28 100%);color:#ffffff;padding:24px;border-radius:4px;margin:20px 0;">
                <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;opacity:0.9;">
                  Revenue recovered this month
                </p>
                <p style="margin:8px 0 4px 0;font-size:40px;font-weight:800;letter-spacing:-1px;">
                  $${report.highlights.revenueRecovered.toLocaleString()}
                </p>
                <p style="margin:0;font-size:14px;opacity:0.9;">
                  vs. last period: ${deltaLabel.replace(/<span[^>]*>/g, "").replace(/<\/span>/g, "")}
                </p>
              </div>
            </td>
          </tr>

          <!-- Highlights grid -->
          <tr>
            <td style="padding:8px 32px 0 32px;">
              <h2 style="margin:16px 0 12px 0;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#111827;">
                This week at a glance
              </h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 12px;background:#f9fafb;border-radius:2px;width:33%;">
                    <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#6b7280;">Jobs Closed</p>
                    <p style="margin:4px 0 0 0;font-size:20px;font-weight:700;color:#111827;">${report.highlights.jobsClosed}</p>
                  </td>
                  <td style="width:8px;"></td>
                  <td style="padding:10px 12px;background:#f9fafb;border-radius:2px;width:33%;">
                    <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#6b7280;">Supplements</p>
                    <p style="margin:4px 0 0 0;font-size:20px;font-weight:700;color:#111827;">${report.highlights.supplementsApproved}</p>
                  </td>
                  <td style="width:8px;"></td>
                  <td style="padding:10px 12px;background:#f9fafb;border-radius:2px;width:33%;">
                    <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#6b7280;">Actions Done</p>
                    <p style="margin:4px 0 0 0;font-size:20px;font-weight:700;color:#111827;">${report.highlights.actionItemsCompleted}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Top Performers -->
          ${
            report.topPerformers.length > 0
              ? `
          <tr>
            <td style="padding:24px 32px 0 32px;">
              <h2 style="margin:16px 0 12px 0;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#111827;">
                Leaderboard
              </h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                ${topPerformersHtml}
              </table>
            </td>
          </tr>`
              : ""
          }

          <!-- Concerns -->
          <tr>
            <td style="padding:0 32px;">
              ${concernsHtml}
            </td>
          </tr>

          <!-- Next Week Priorities -->
          <tr>
            <td style="padding:8px 32px 24px 32px;">
              <h2 style="margin:16px 0 12px 0;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#111827;">
                Next week priorities
              </h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                ${prioritiesHtml}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0A0A0A;padding:24px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;">
                Generated by the <strong style="color:#B87333;">Surge Advisory</strong> platform<br>
                Your success manager: <strong style="color:#E8E2D8;">Austin Brooks</strong>
              </p>
              <p style="margin:12px 0 0 0;font-size:11px;color:#6B7280;">
                Questions? Reply to this email.<br>
                austin@surgeadvisory.co
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Plain-text fallback for email clients that don't render HTML
  const plainText = `
${client.companyName} — Weekly Performance
${weekStart} – ${weekEnd}

${firstName},

${report.summary}

────────────────────────────────────────────────────────
RECOVERED THIS MONTH: $${report.highlights.revenueRecovered.toLocaleString()}
vs. last period: ${recoveryDelta > 0 ? "+" : ""}$${recoveryDelta.toLocaleString()}

This week at a glance:
  Jobs Closed:        ${report.highlights.jobsClosed}
  Supplements:        ${report.highlights.supplementsApproved}
  Actions Completed:  ${report.highlights.actionItemsCompleted}
  Documentation:      ${report.highlights.documentationGapScore}/100

Leaderboard:
${report.topPerformers.map((p, i) => `  ${i + 1}. ${p.name} — ${p.score}/100`).join("\n")}

${
  report.concerns.length > 0
    ? `
Flagged for your attention:
${report.concerns.map((c) => `  • ${c}`).join("\n")}
`
    : ""
}
Next week priorities:
${report.nextWeekPriorities.map((p, i) => `  ${i + 1}. ${p}`).join("\n")}

────────────────────────────────────────────────────────
Generated by the Surge Advisory platform
Your success manager: Austin Brooks
austin@surgeadvisory.co
`.trim();

  return { subject, htmlBody, plainText };
}

// ── Send stub (ready for Resend/SendGrid integration) ──────

export interface SendEmailParams {
  to: string;
  toName: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendEmail(_params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // TODO: Wire up Resend, SendGrid, or Postmark when API key is available.
  //
  // Example Resend integration:
  //
  //   const res = await fetch("https://api.resend.com/emails", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       from: "Austin at Surge <austin@surgeadvisory.co>",
  //       to: params.to,
  //       reply_to: params.replyTo || "austin@surgeadvisory.co",
  //       subject: params.subject,
  //       html: params.html,
  //       text: params.text,
  //     }),
  //   });
  //   return res.ok ? { success: true, messageId: (await res.json()).id } : { success: false };
  //
  // For now: mock success so UI flow works.

  await new Promise((r) => setTimeout(r, 800)); // simulate network
  return {
    success: true,
    messageId: `mock-${Date.now()}`,
  };
}
