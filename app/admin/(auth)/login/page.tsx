"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div className="min-h-screen bg-[#FEFEFD] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[#CDCAC3] p-8">
        <h1 className="font-serif text-2xl font-bold text-black mb-1">Sutura Admin</h1>
        <p className="text-sm text-black/50 mb-7">Sign in to manage your store</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-black/70 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#CDCAC3] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B7A51] transition-colors"
              placeholder="admin@suturabyfeesah.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-black/70 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#CDCAC3] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B7A51] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9B7A51] hover:bg-[#6C3D0C] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}