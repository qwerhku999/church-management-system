"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/Toast";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("admin@ministryflow.church");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      toast.success("Welcome back to MinistryFlow");
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
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
            <h1 className="font-display text-3xl font-bold tracking-tight">Sign in</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Access your church management workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@church.org"
              required
            />
            <div className="relative">
              <Input
                label="Password"
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

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[var(--primary)] transition hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error ? (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="group w-full" size="lg" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
              {!submitting ? (
                <ArrowRight size={17} className="ml-2 transition group-hover:translate-x-0.5" />
              ) : null}
            </Button>
          </form>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/5 bg-[var(--surface)] px-4 py-3 text-xs text-[var(--muted)]">
            <ShieldCheck size={16} className="text-[var(--primary)]" />
            Demo mode: use any email and password to explore the dashboard.
          </div>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[var(--primary)] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
