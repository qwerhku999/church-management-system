"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { authService } from "@/services/auth.service";
import { toast } from "@/components/ui/Toast";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent — check your inbox");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to send reset link";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel />

      <div className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-lg font-bold text-white">
                M
              </div>
              <span className="font-display text-lg font-bold">MinistryFlow</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Reset password</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Enter your account email and we&apos;ll send you a secure link to reset your password.
            </p>
          </div>

          {sent ? (
            <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6 text-center animate-fade-in">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)]">
                <MailCheck size={26} />
              </div>
              <h2 className="font-display text-lg font-semibold">Check your email</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                If an account exists for <span className="font-medium text-[var(--text)]">{email}</span>, a password
                reset link is on its way.
              </p>
              <Button
                variant="secondary"
                className="mt-6 w-full"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                Send to a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@church.org"
                required
              />

              {error ? (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="group w-full" size="lg" disabled={submitting}>
                {submitting ? "Sending link…" : "Send reset link"}
                {!submitting ? (
                  <ArrowRight size={17} className="ml-2 transition group-hover:translate-x-0.5" />
                ) : null}
              </Button>
            </form>
          )}

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-white"
          >
            <ArrowLeft size={16} /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
