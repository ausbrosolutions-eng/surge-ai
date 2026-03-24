import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

// Extend Vercel/Next.js function timeout to 30s for AI generation
export const maxDuration = 30;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

    // Use streaming + finalMessage() to avoid HTTP timeout on longer generations
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

    // Strip any accidental markdown fences
    const jsonText = textBlock.text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const snapshot = JSON.parse(jsonText);

    // Log the lead (replace with DB + email notification in production)
    console.log("[LEAD]", {
      name,
      email,
      company,
      monthlyRevenue,
      biggestChallenge,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ snapshot });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: "Failed to generate your snapshot. Please try again." },
      { status: 500 }
    );
  }
}
