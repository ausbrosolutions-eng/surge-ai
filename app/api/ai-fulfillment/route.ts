import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

// Extend Vercel/Next.js function timeout to 30s for AI generation
export const maxDuration = 30;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface TaskConfig {
  systemPrompt: string;
  buildUserPrompt: (data: Record<string, string | number>) => string;
}

const TASK_CONFIGS: Record<string, TaskConfig> = {
  "gbp-posts": {
    systemPrompt:
      "You are a Google Business Profile expert for home service contractors.",
    buildUserPrompt: ({ trade, city, month }) =>
      `Write 4 ready-to-publish GBP posts for a ${trade} company in ${city} for ${month}. Each post: 150-200 words, includes a clear CTA (call now/book online), seasonal or timely angle, no hashtags, no emojis. Label them Post 1, Post 2, Post 3, Post 4.`,
  },
  "review-sms": {
    systemPrompt:
      "You are a reputation management specialist for home service contractors.",
    buildUserPrompt: ({ trade, techName }) =>
      `Write 3 SMS templates for a ${trade} company to send after job completion to request a Google review. Technician name is ${techName}. Each SMS: under 160 characters, personal tone, includes a [REVIEW LINK] placeholder. Label them SMS 1, SMS 2, SMS 3.`,
  },
  "monthly-report": {
    systemPrompt:
      "You are a marketing strategist writing client reports for home service businesses.",
    buildUserPrompt: ({ clientName, leads, calls, reviews }) =>
      `Write a 2-paragraph client-facing monthly report narrative for ${clientName}. This month: ${leads} new leads, ${calls} tracked calls, ${reviews} new Google reviews. Paragraph 1: celebrate wins with specific numbers. Paragraph 2: what we're doing next month and why. Tone: confident, direct, results-focused. No fluff.`,
  },
  "blog-outline": {
    systemPrompt:
      "You are an SEO content strategist for home service businesses.",
    buildUserPrompt: ({ trade, keyword }) =>
      `Create a detailed SEO blog post outline for a ${trade} company targeting the keyword '${keyword}'. Include: H1 title, meta description (under 160 chars), intro paragraph hook, 4-5 H2 sections each with 2-3 H3 subsections, FAQ section with 3 questions, conclusion CTA. Focus on local intent and E-E-A-T signals.`,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskType, clientData } = body as {
      taskType: string;
      clientData: Record<string, string | number>;
    };

    if (!taskType || !clientData) {
      return NextResponse.json(
        { error: "taskType and clientData are required." },
        { status: 400 }
      );
    }

    const config = TASK_CONFIGS[taskType];
    if (!config) {
      return NextResponse.json(
        { error: `Unknown taskType: ${taskType}` },
        { status: 400 }
      );
    }

    const userPrompt = config.buildUserPrompt(clientData);

    // Stream the response and collect the full message
    const stream = client.messages.stream({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      system: config.systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const message = await stream.finalMessage();

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from model");
    }

    return NextResponse.json({ result: textBlock.text });
  } catch (error) {
    console.error("AI fulfillment error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
