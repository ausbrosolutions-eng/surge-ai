import { NextRequest, NextResponse } from "next/server";

interface LeadData {
  name: string;
  email: string;
  company: string;
  monthlyRevenue: string;
  biggestChallenge: string;
}

function validateLead(data: unknown): data is LeadData {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.name === "string" &&
    d.name.length > 0 &&
    typeof d.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) &&
    typeof d.company === "string" &&
    d.company.length > 0 &&
    typeof d.monthlyRevenue === "string" &&
    typeof d.biggestChallenge === "string"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!validateLead(body)) {
      return NextResponse.json(
        { error: "Invalid lead data. Please fill in all required fields." },
        { status: 400 }
      );
    }

    const lead: LeadData = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      company: body.company.trim(),
      monthlyRevenue: body.monthlyRevenue,
      biggestChallenge: body.biggestChallenge,
    };

    // Log the lead (replace with DB/CRM save in production)
    console.log("New lead received:", {
      ...lead,
      timestamp: new Date().toISOString(),
      source: "landing-page",
    });

    // TODO: Save to database (Prisma / Neon)
    // await prisma.lead.create({ data: { ...lead, status: 'NEW', source: 'landing-page' } })

    // TODO: Send notification email via Resend
    // await resend.emails.send({ from: '...', to: AGENCY_OWNER_EMAIL, subject: `New lead: ${lead.company}`, ... })

    // TODO: Send welcome email to lead
    // await resend.emails.send({ from: '...', to: lead.email, subject: 'Your free growth audit is on the way!', ... })

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you! We'll be in touch within 24 hours with your personalized growth audit.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  // TODO: Add admin auth check
  // Return leads for admin dashboard
  return NextResponse.json({
    leads: [],
    message: "Connect a database to retrieve leads.",
  });
}
