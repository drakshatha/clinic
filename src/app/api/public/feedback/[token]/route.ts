/**
 * GET  /api/public/feedback/[token]  — load feedback request (patient uses this)
 * POST /api/public/feedback/[token]  — submit rating + comment
 */
import { NextRequest, NextResponse } from "next/server";
import { getFeedback, submitFeedback, markReviewRequested } from "@/lib/db";
import { sendWhatsAppText, normalizePhone } from "@/lib/whatsapp";
import { site } from "@/lib/site";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const fb = await getFeedback(token);
  if (!fb) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    token,
    name: fb.lead.name,
    treatment: fb.lead.treatment,
    alreadySubmitted: !!fb.submittedAt,
    rating: fb.rating,
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const fb = await getFeedback(token);
  if (!fb) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (fb.submittedAt) return NextResponse.json({ error: "Already submitted" }, { status: 409 });

  const body = await req.json();
  const rating = parseInt(body.rating, 10);
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating 1-5 required" }, { status: 400 });
  }

  await submitFeedback(token, rating, body.comment ?? "");

  // 4-5 stars → send Google Review link to patient
  if (rating >= 4) {
    const reviewMsg =
      `Thank you, ${fb.lead.name}! 🌟 We're thrilled you had a great experience at ${site.name}.\n\n` +
      `Your Google review would mean the world to us and help other patients find us:\n` +
      `⭐ ${site.googleReviewUrl}\n\n` +
      `It only takes 1 minute and makes a huge difference. Thank you! 🙏`;

    await sendWhatsAppText(normalizePhone(fb.patientPhone), reviewMsg);
    await markReviewRequested(token);
  } else {
    // 1-3 stars → alert admin on WhatsApp
    const alertMsg =
      `⚠️ *Low rating alert!*\n\n` +
      `Patient: ${fb.lead.name} (${fb.patientPhone})\n` +
      `Rating: ${"⭐".repeat(rating)} (${rating}/5)\n` +
      (body.comment ? `Comment: "${body.comment}"` : "") +
      `\n\nPlease follow up to address their concern.`;
    await sendWhatsAppText(site.whatsapp, alertMsg);
  }

  return NextResponse.json({ ok: true, rating, googleReviewSent: rating >= 4 });
}
