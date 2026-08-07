"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { authService } from "@/services/auth.service";
import { toast } from "@/components/ui/Toast";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Reset token is missing. Please use the link from your email.");
      return;
    }

    setSubmitting(true);
    try {
      await authService.resetPassword(token, password);
      toast.success("Password reset successfully — please sign in");
      router.push("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to reset password";
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
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)] text-lg font-bold text-white">
                M
              </div>
              <span className="font-display text-lg font-bold">MinistryFlow</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Set new password</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Choose a strong password to secure your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="New password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-[var(--muted)] transition hover:text-white"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Input
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error ? (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="group w-full" size="lg" disabled={submitting}>
              {submitting ? "Resetting…" : "Reset password"}
              {!submitting ? (
                <ArrowRight size={17} className="ml-2 transition group-hover:translate-x-0.5" />
              ) : null}
            </Button>
          </form>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/5 bg-[var(--surface)] px-4 py-3 text-xs text-[var(--muted)]">
            <ShieldCheck size={16} className="text-[var(--primary)]" />
            Use at least 8 characters with a mix of letters and numbers.
          </div>

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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
