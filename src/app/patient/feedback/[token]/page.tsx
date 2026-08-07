"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

type FeedbackData = {
  token: string;
  name: string;
  treatment: string;
  alreadySubmitted: boolean;
  rating: number | null;
};

const STARS = [1, 2, 3, 4, 5];
const STAR_LABELS = ["", "Poor", "Below Average", "Average", "Good", "Excellent!"];

export default function FeedbackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [data, setData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [highRating, setHighRating] = useState(false);

  useEffect(() => {
    fetch(`/api/public/feedback/${token}`)
      .then(async (r) => {
        if (!r.ok) { setNotFound(true); return; }
        const d = await r.json();
        setData(d);
        if (d.alreadySubmitted) setSubmitted(true);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    const res = await fetch(`/api/public/feedback/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: selected, comment }),
    });
    if (res.ok) {
      const r = await res.json();
      setHighRating(r.googleReviewSent);
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  const display = hovered || selected;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted text-sm">Loading...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-6 text-center">
        <div className="text-5xl mb-4">🦷</div>
        <h1 className="text-xl font-bold text-navy mb-2">Link not found</h1>
        <p className="text-muted text-sm mb-6">This feedback link may have expired or is invalid.</p>
        <Link href="/" className="text-blue text-sm font-semibold hover:underline">
          Back to {site.name}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <div className="bg-navy text-white py-4 px-6 flex items-center gap-3">
        <span className="text-2xl">🦷</span>
        <div>
          <div className="font-bold text-sm">{site.name}</div>
          <div className="text-white/70 text-xs">{site.doctor}</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {submitted ? (
            <div className="rounded-3xl bg-white shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">{highRating ? "🌟" : "🙏"}</div>
              <h2 className="text-2xl font-bold text-navy mb-3">
                {highRating ? "Thank you!" : "Thank you for sharing!"}
              </h2>
              {data?.alreadySubmitted ? (
                <p className="text-muted text-sm">You&apos;ve already submitted your feedback. We appreciate it!</p>
              ) : highRating ? (
                <>
                  <p className="text-muted text-sm mb-6">
                    We&apos;re thrilled you had a great experience! Your Google review helps other patients find us.
                    We&apos;ve sent the review link to your WhatsApp.
                  </p>
                  <a
                    href={site.googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-blue px-8 py-3 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
                  >
                    ⭐ Write a Google Review
                  </a>
                </>
              ) : (
                <p className="text-muted text-sm">
                  We appreciate your honest feedback. Our team will reach out to you to make things right.
                </p>
              )}
              <div className="mt-8">
                <Link href={site.url} className="text-xs text-muted hover:text-navy">
                  {site.url}
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-navy">
                  How was your visit, {data?.name?.split(" ")[0] ?? ""}?
                </h2>
                {data?.treatment && (
                  <p className="text-muted text-sm mt-1">Treatment: {data.treatment}</p>
                )}
                <p className="text-muted text-sm mt-2">
                  Your feedback helps us improve and serve you better.
                </p>
              </div>

              {/* Star rating */}
              <div className="flex justify-center gap-3 mb-2">
                {STARS.map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelected(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="text-5xl transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <span className={display >= star ? "text-yellow-400" : "text-gray-200"}>★</span>
                  </button>
                ))}
              </div>
              <p className="text-center text-sm font-semibold text-navy h-5 mb-6 transition-all">
                {STAR_LABELS[display] ?? ""}
              </p>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-muted uppercase mb-2">
                  Tell us more (optional)
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like? Anything we can improve?"
                  className="w-full rounded-2xl border border-line px-4 py-3 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selected || submitting}
                className="w-full rounded-2xl bg-blue py-4 text-sm font-bold text-white hover:bg-blue-deep transition-colors disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
