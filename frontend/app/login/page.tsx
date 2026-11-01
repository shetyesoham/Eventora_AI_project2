"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("aarav@eventora.ai");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Instant authentic session transition
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  }

  function handleQuickDemo() {
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#54265F] to-[#75458B] flex items-center justify-center shadow-xl shadow-[#54265F]/20">
            <Sparkles className="w-7 h-7 text-[#F3E5C8]" />
          </div>
        </Link>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#54265F]">
          Welcome to Eventora AI
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto">
          Sign in to your intelligent celebration cockpit or explore the live multi-agent demo.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#EEE7F3] shadow-xl shadow-[#54265F]/5 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block">Organizer Email</label>
              <div className="mt-1.5 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav@eventora.ai"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none transition"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 block">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo password pre-filled. Click 'Sign In to Cockpit'."); }} className="text-[11px] font-semibold text-[#75458B] hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="mt-1.5 relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none transition"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl gradient-ai-button text-xs font-bold shadow-lg shadow-[#54265F]/15 flex items-center justify-center gap-2 transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "Authenticating Session..." : "Sign In to Cockpit"}</span>
              <ArrowRight className="w-4 h-4 text-[#F3E5C8]" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EEE7F3]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-semibold text-[10px] tracking-wider">
                Or Instant Access
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-3 rounded-xl bg-[#F8F4FA] border border-[#EEE7F3] text-[#54265F] text-xs font-bold hover:bg-[#EEE7F3]/60 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#C58B76]" />
            <span>Explore as Guest Demo User</span>
          </button>

          <div className="pt-2 text-center text-gray-400 text-[11px] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#31966A]" />
            <span>256-bit encrypted session • Powered by Eventora AI</span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Return to <Link href="/" className="font-bold text-[#54265F] hover:underline">Eventora Home</Link>
        </p>
      </div>
    </div>
  );
}

