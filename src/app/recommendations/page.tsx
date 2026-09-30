"use client";

import { useEffect, useRef, useState } from "react";
import PathDrawingPortfolioHero from "@/components/ui/path-drawing-portfolio-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Quote,
  Link as LinkIcon,
  Send,
  CheckCircle,
  Loader2,
  MessageSquareQuote,
  ShieldCheck,
} from "lucide-react";
import {
  RECOMMENDATIONS_CONFIG,
  recommendationsCsvUrl,
  toCommunityRecommendations,
  isFormConfigured,
  isSheetConfigured,
  type CommunityRecommendation,
} from "@/lib/recommendations";

// ---------------------------------------------------------------------------
// LinkedIn recommendation (verbatim from the LinkedIn profile)
// ---------------------------------------------------------------------------
const linkedInRecommendation = {
  author: "Dariusz Wilisowski",
  role: "Sales Operations & Deal Desk | Salesforce CPQ, SAP, Order-to-Cash | Google Cloud EMEA & PMI",
  relationship: "Worked with Akshay on different teams",
  date: "June 2023",
  text: `I highly recommend Akshay! He is known for his exceptional analytical skills, and deep industry knowledge. Akshay's expertise in analyzing and interpreting complex data, coupled with his warm and personable nature, makes him a great part of the team. He is not only highly skilled but also a great team player!`,
  profileUrl: "https://www.linkedin.com/in/akshayiyer23/details/recommendations/",
};

function RecommendationCard({
  name,
  role,
  relationship,
  date,
  text,
  accent = "cyan",
}: {
  name: string;
  role: string;
  relationship?: string;
  date?: string;
  text: string;
  accent?: "cyan" | "purple";
}) {
  const accentText = accent === "cyan" ? "text-sci-cyan" : "text-sci-purple";
  const borderHover =
    accent === "cyan" ? "hover:border-sci-cyan/50" : "hover:border-sci-purple/50";
  return (
    <Card className={`card-sci group transition-all duration-300 ${borderHover}`}>
      <CardContent className="p-6 sm:p-8">
        <Quote className={`mb-4 h-8 w-8 rotate-180 ${accentText} opacity-70`} />
        <blockquote className="whitespace-pre-line text-sm leading-relaxed text-white/80 sm:text-base">
          {text}
        </blockquote>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <div>
            <p className="font-orbitron text-sm font-bold text-white">{name}</p>
            {role && <p className={`text-xs font-medium ${accentText}`}>{role}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {relationship && (
              <Badge variant="outline" className="border-white/20 text-white/60">
                {relationship}
              </Badge>
            )}
            {date && (
              <Badge variant="outline" className="border-white/20 text-white/60">
                {date}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RecommendationsPage() {
  const [community, setCommunity] = useState<CommunityRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const formReady = isFormConfigured();
  const sheetReady = isSheetConfigured();

  useEffect(() => {
    if (!sheetReady) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch(recommendationsCsvUrl())
      .then((res) => {
        if (!res.ok) throw new Error("csv fetch failed");
        return res.text();
      })
      .then((csv) => {
        if (!cancelled) setCommunity(toCommunityRecommendations(csv));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sheetReady]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    // Submit to Google Forms in a hidden iframe so the page never navigates away.
    const iframe = document.createElement("iframe");
    iframe.name = "rec-hidden-submit";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframeRef.current = iframe;
    const finish = () => {
      setSubmitting(false);
      setSubmitted(true);
      form.reset();
      window.setTimeout(() => iframe.remove(), 5000);
    };
    iframe.addEventListener("load", finish, { once: true });
    // Fallback in case the load event never fires (offline/blocked).
    window.setTimeout(() => {
      if (!submitted) finish();
    }, 8000);
    form.target = "rec-hidden-submit";
    form.submit();
  };

  const { formAction, fields, consentValue } = RECOMMENDATIONS_CONFIG;

  return (
    <main className="min-h-screen bg-[#050510]">
      <PathDrawingPortfolioHero
        brand="Akshay Iyer"
        tagline="What people say about working with me"
        eyebrow="Recommendations"
        className="w-full"
      />

      {/* LinkedIn recommendation */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="font-orbitron text-3xl font-bold text-sci-cyan">
              From LinkedIn
            </h2>
            <a
              href={linkedInRecommendation.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-sci-cyan"
            >
              <LinkIcon className="h-4 w-4" />
              View on LinkedIn
            </a>
          </div>
          <RecommendationCard
            name={linkedInRecommendation.author}
            role={linkedInRecommendation.role}
            relationship={linkedInRecommendation.relationship}
            date={linkedInRecommendation.date}
            text={linkedInRecommendation.text}
          />
        </div>
      </section>

      {/* Community recommendations */}
      <section className="relative z-10 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent px-6 py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="flex items-center gap-3">
            <MessageSquareQuote className="h-6 w-6 text-sci-purple" />
            <h2 className="font-orbitron text-3xl font-bold text-sci-purple">
              Community
            </h2>
          </div>

          {loading && (
            <div className="flex items-center gap-3 text-white/50">
              <Loader2 className="h-5 w-5 animate-spin text-sci-cyan" />
              <span className="text-sm">Loading recommendations…</span>
            </div>
          )}

          {!loading && loadError && (
            <p className="text-sm text-white/50">
              Couldn&apos;t load community recommendations right now. Please check
              back later.
            </p>
          )}

          {!loading && !loadError && community.length === 0 && (
            <Card className="card-sci">
              <CardContent className="p-8 text-center">
                <p className="text-white/60">
                  No community recommendations yet — yours could be the first.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-8">
            {community.map((rec, i) => (
              <RecommendationCard
                key={`${rec.name}-${i}`}
                name={rec.name}
                role={rec.role}
                relationship={rec.relationship}
                date={rec.date}
                text={rec.text}
                accent="purple"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Submission form */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <div>
            <h2 className="font-orbitron text-3xl font-bold text-sci-magenta">
              Add your recommendation
            </h2>
            <p className="mt-3 flex items-start gap-2 text-sm text-white/60">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sci-cyan" />
              Worked with me? Leave a few words below. Submissions are reviewed
              before they appear on this page.
            </p>
          </div>

          {!formReady ? (
            <Card className="card-sci">
              <CardContent className="p-8 text-center text-sm text-white/60">
                The recommendation form is being wired up — check back soon.
              </CardContent>
            </Card>
          ) : submitted ? (
            <Card className="card-sci border-sci-cyan/40">
              <CardContent className="p-10 text-center">
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-sci-cyan" />
                <h3 className="font-orbitron text-xl font-bold text-white">
                  Thank you!
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
                  Your recommendation was received and will appear here after a
                  quick review.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-white/20 text-white/70 hover:border-sci-cyan/50 hover:text-sci-cyan"
                  onClick={() => setSubmitted(false)}
                >
                  Write another
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-sci">
              <CardContent className="p-6 sm:p-8">
                <form
                  action={formAction}
                  method="POST"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="rec-name" className="text-white/80">
                        Your name *
                      </Label>
                      <Input
                        id="rec-name"
                        name={fields.name}
                        required
                        placeholder="Jane Kowalska"
                        className="border-white/15 bg-white/5 text-white placeholder:text-white/30 focus:border-sci-cyan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rec-role" className="text-white/80">
                        Your role & company *
                      </Label>
                      <Input
                        id="rec-role"
                        name={fields.role}
                        required
                        placeholder="Data Analyst, Acme Corp"
                        className="border-white/15 bg-white/5 text-white placeholder:text-white/30 focus:border-sci-cyan"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rec-rel" className="text-white/80">
                      How we worked together
                    </Label>
                    <Input
                      id="rec-rel"
                      name={fields.relationship}
                      placeholder="e.g. Managed Akshay directly at HCLTech"
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/30 focus:border-sci-cyan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rec-text" className="text-white/80">
                      Your recommendation *
                    </Label>
                    <Textarea
                      id="rec-text"
                      name={fields.text}
                      required
                      rows={6}
                      placeholder="What was it like working with Akshay?"
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/30 focus:border-sci-cyan"
                    />
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-white/60">
                    <input
                      type="checkbox"
                      name={fields.consent}
                      value={consentValue}
                      required
                      className="mt-1 h-4 w-4 shrink-0 accent-cyan-400"
                    />
                    <span>
                      I agree to have my name, role, and recommendation published
                      on this website.
                    </span>
                  </label>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-sci-cyan font-orbitron text-sm font-bold text-black transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit recommendation
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
