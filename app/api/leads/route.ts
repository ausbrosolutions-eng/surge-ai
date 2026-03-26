import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// Prevent Next.js from statically analyzing this route at build time
export const dynamic = "force-dynamic";
// Extend Vercel/Next.js function timeout to 30s for AI generation
export const maxDuration = 30;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Lazy-init Resend so module-level import doesn't throw during Next.js build
let _resend: Resend | null = null;
const getResend = () => {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
};

// ─── Email HTML Template ─────────────────────────────────────────────────────
function buildBlueprintEmail(
  name: string,
  company: string,
  snapshot: {
    revenueGap: { title: string; description: string };
    topChannels: { rank: number; name: string; reason: string; expectedResult: string }[];
    weekAction: { title: string; description: string };
    blindSpot: string;
    fullBlueprintHint: string;
  }
): string {
  const firstName = name.split(" ")[0];
  const rankColors = ["#00D4C8", "#FF6B47", "#a78bfa"];

  const channelsHtml = snapshot.topChannels
    .map(
      (ch) => `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; vertical-align: top;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="32" style="vertical-align: top; padding-top: 2px;">
                <div style="width:28px;height:28px;border-radius:50%;background:${rankColors[ch.rank - 1] ?? "#666"};color:#fff;font-weight:700;font-size:13px;text-align:center;line-height:28px;">${ch.rank}</div>
              </td>
              <td style="padding-left: 12px;">
                <div style="font-weight:700;color:#0A1628;font-size:15px;margin-bottom:2px;">${ch.name}</div>
                <div style="display:inline-block;background:${rankColors[ch.rank - 1] ?? "#666"}18;color:${rankColors[ch.rank - 1] ?? "#666"};font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;margin-bottom:6px;">${ch.expectedResult}</div>
                <div style="color:#555;font-size:14px;line-height:1.5;">${ch.reason}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Blueprint Snapshot — Surge AI</title>
</head>
<body style="margin:0;padding:0;background:#F8F7F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F8F7F4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0A1628;border-radius:16px 16px 0 0;padding:32px 40px 28px;">
              <div style="color:#00D4C8;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Blueprint Snapshot — ${company}</div>
              <div style="color:#fff;font-size:24px;font-weight:800;line-height:1.3;">${firstName}, here's what we found.</div>
              <div style="color:rgba(255,255,255,0.5);font-size:14px;margin-top:6px;">Personalized for your business. Not a template.</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:0 40px 8px;">

              <!-- Revenue Gap -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:28px;background:#00D4C808;border:1px solid #00D4C840;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="color:#008F8A;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Your #1 Revenue Gap</div>
                    <div style="color:#0A1628;font-size:16px;font-weight:700;margin-bottom:8px;">${snapshot.revenueGap.title}</div>
                    <div style="color:#444;font-size:14px;line-height:1.6;">${snapshot.revenueGap.description}</div>
                  </td>
                </tr>
              </table>

              <!-- Top Channels -->
              <div style="color:#555;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:28px 0 10px;">Top 3 Channels — Ranked by ROI for You</div>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #eee;border-radius:12px;overflow:hidden;">
                ${channelsHtml}
              </table>

              <!-- This Week's Action -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:20px;background:#FF6B4708;border:1px solid #FF6B4740;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="color:#FF6B47;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Do This This Week</div>
                    <div style="color:#0A1628;font-size:16px;font-weight:700;margin-bottom:8px;">${snapshot.weekAction.title}</div>
                    <div style="color:#444;font-size:14px;line-height:1.6;">${snapshot.weekAction.description}</div>
                  </td>
                </tr>
              </table>

              <!-- Competitive Blind Spot -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:20px;background:#a78bfa08;border:1px solid #a78bfa40;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="color:#7c3aed;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Your Competitive Blind Spot</div>
                    <div style="color:#444;font-size:14px;line-height:1.6;">${snapshot.blindSpot}</div>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="border-top:1px solid #eee;margin:28px 0;"></div>

              <!-- Next Steps -->
              <div style="color:#0A1628;font-size:16px;font-weight:700;margin-bottom:8px;">What's next?</div>
              <div style="color:#555;font-size:14px;line-height:1.6;margin-bottom:20px;">${snapshot.fullBlueprintHint}</div>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="https://withsurge.xyz/#contact" style="display:inline-block;background:#FF6B47;color:#fff;font-weight:700;font-size:15px;padding:14px 36px;border-radius:12px;text-decoration:none;">Book a Free 15-min Strategy Call →</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0A1628;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <div style="color:rgba(255,255,255,0.4);font-size:12px;line-height:1.6;">
                Surge AI · Built for home service contractors<br/>
                <a href="https://withsurge.xyz" style="color:#00D4C8;text-decoration:none;">withsurge.xyz</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const SYSTEM_PROMPT = `You are a senior home service marketing strategist with 30+ years of experience. You've helped hundreds of HVAC, plumbing, roofing, electrical, restoration, landscaping, pest control, and cleaning businesses grow revenue predictably.

You know these revenue benchmarks cold:
- Under $500k: 1-2 trucks, referral-dependent, no real marketing system
- $500k–$1M: inconsistent lead flow, over-relying on one channel, no tracking
- $1M–$3M: growth plateau, needs diversified digital channels, GBP often neglected
- $3M–$8M: full marketing stack needed — LSA + GBP + SEO + PPC all must be firing
- $8M–$20M: multi-location or high-volume, needs brand authority + AI search presence
- Over $20M: enterprise-level, franchise-ready marketing infrastructure

You know the highest-ROI channels for home services ranked:
1. Google Local Service Ads (pay-per-lead, $20–$150/lead, highest intent)
2. Google Business Profile (free, 68% of local consumers contact direct from GBP)
3. Local SEO (compounding returns, 3–12 month runway)
4. Google Search Ads / PPC (immediate, scalable, $50–$150 CPL)
5. Email/SMS re-engagement (existing customers, near-zero cost)
6. Reputation/review system (powers everything else)
7. AI search optimization (ChatGPT, Perplexity — emerging, high-converting)
8. Social media / Facebook Ads (brand + awareness)
9. Nextdoor (hyper-local, underutilized, high trust)

Be direct, specific, and expert. No fluff. Reference real benchmarks and tools.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, monthlyRevenue, biggestChallenge } = body;

    if (!name || !email || !company || !monthlyRevenue || !biggestChallenge) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const prompt = `Generate a Blueprint Snapshot for this home service business owner.

Owner: ${name}
Company: ${company}
Annual Revenue: ${monthlyRevenue}
Biggest Challenge: ${biggestChallenge}

Return ONLY valid JSON — no markdown fences, no explanation, just the raw JSON object:

{
  "revenueGap": {
    "title": "5-8 word title naming their single biggest revenue gap",
    "description": "2-3 sentences. Be specific to their revenue range and challenge. Include a concrete benchmark or stat. Be direct — this is what's costing them real money right now."
  },
  "topChannels": [
    {
      "rank": 1,
      "name": "Channel name",
      "reason": "One sentence: why this is #1 given their exact revenue range and challenge.",
      "expectedResult": "Concrete metric: e.g. '$40–$80 per booked lead' or '3–4x ROI in 60 days'"
    },
    {
      "rank": 2,
      "name": "Channel name",
      "reason": "One sentence specific to their situation.",
      "expectedResult": "Concrete metric"
    },
    {
      "rank": 3,
      "name": "Channel name",
      "reason": "One sentence specific to their situation.",
      "expectedResult": "Concrete metric"
    }
  ],
  "weekAction": {
    "title": "Action title in 4-6 words",
    "description": "Exactly one specific action this week. Name the exact tool, platform, or step — 'open Google Business Profile → Posts → publish a post with [seasonal offer] + Book Now link' level of specific. Not vague advice."
  },
  "blindSpot": "One sentence of insider knowledge about their market or competitor situation they almost certainly don't know. Make it feel like something only an expert who's worked in their trade and revenue range would know.",
  "fullBlueprintHint": "One sentence hinting at what the full Blueprint reveals — reference something specific like their city's competitive gap, their CAC vs. industry benchmark, or their full 9-channel prioritized strategy."
}`;

    // Generate snapshot with one automatic retry on failure
    const generateSnapshot = async () => {
      const stream = client.messages.stream({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        thinking: { type: "adaptive" },
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      });
      const message = await stream.finalMessage();
      const textBlock = message.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text response from model");
      }
      const jsonText = textBlock.text
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
      return JSON.parse(jsonText);
    };

    let snapshot: ReturnType<typeof JSON.parse>;
    try {
      snapshot = await generateSnapshot();
    } catch (firstError) {
      console.warn("[LEAD API] First attempt failed, retrying in 1s...", firstError);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      snapshot = await generateSnapshot(); // throws if second attempt also fails
    }

    // Log the lead
    console.log("[LEAD]", {
      name,
      email,
      company,
      monthlyRevenue,
      biggestChallenge,
      timestamp: new Date().toISOString(),
    });

    // Send blueprint email (non-blocking — don't fail the request if email fails)
    if (process.env.RESEND_API_KEY) {
      getResend().emails
        .send({
          from: process.env.RESEND_FROM_EMAIL ?? "Surge AI <blueprint@withsurge.xyz>",
          to: email,
          subject: `${name.split(" ")[0]}, your Blueprint Snapshot is ready — ${company}`,
          html: buildBlueprintEmail(name, company, snapshot),
        })
        .then(() => console.log("[EMAIL SENT]", email))
        .catch((err: unknown) => console.error("[EMAIL ERROR]", err));
    } else {
      console.warn("[EMAIL SKIPPED] RESEND_API_KEY not set");
    }

    return NextResponse.json({ snapshot });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: "We tried twice — something's off on our end. Try again in a moment." },
      { status: 500 }
    );
  }
}
