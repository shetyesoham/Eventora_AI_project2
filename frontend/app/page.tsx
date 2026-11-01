import Link from "next/link";
import { Sparkles, Heart, ArrowRight, Star, Users, Music } from "lucide-react";

export default function LandingPage() {
  const categories = [
    { title: "Weddings", desc: "Multi-day ceremonies, mandap decor, traditional rituals & guest lodging.", icon: Heart, count: "50-1000+ guests" },
    { title: "Birthdays", desc: "Theme decors, live interactive games, cake artistry & entertainment.", icon: Sparkles, count: "20-200 guests" },
    { title: "Anniversaries", desc: "Intimate silver & golden jubilee soirees with bespoke dining.", icon: Star, count: "30-150 guests" },
    { title: "Festivals & Pujas", desc: "Ganesh Utsav, Navratri, Diwali community setups & vendor coordination.", icon: Music, count: "100-2000 guests" },
    { title: "Corporate Events", desc: "Annual general summits, awards galas & seamless catering logistics.", icon: Users, count: "50-800 delegates" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#25212A]">
      {/* Navigation */}
      <header className="border-b border-[#EEE7F3] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#54265F] to-[#75458B] flex items-center justify-center shadow-lg shadow-[#54265F]/20">
              <Sparkles className="w-6 h-6 text-[#F3E5C8]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#54265F]">
                Eventora AI
              </span>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-[#C58B76]">
                Plan Smarter. Celebrate Better.
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <Link href="#features" className="hover:text-[#54265F] transition">Features</Link>
            <Link href="#categories" className="hover:text-[#54265F] transition">Categories</Link>
            <Link href="#how-it-works" className="hover:text-[#54265F] transition">How It Works</Link>
            <Link href="/dashboard" className="hover:text-[#54265F] transition">Live Demo</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 text-[#54265F] hover:bg-[#EEE7F3]/50 rounded-xl transition"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-[#54265F] text-white hover:bg-[#3F1A48] shadow-md shadow-[#54265F]/20 transition"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEE7F3] border border-[#75458B]/20 text-[#54265F] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C58B76]" />
              Generative AI-Powered Multi-Agent Celebration Architecture
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#25212A] leading-[1.15]">
              Every Celebration Deserves a <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#54265F] to-[#C58B76]">Perfect Plan.</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Meet <strong>Eventora AI</strong> — your intelligent celebration companion. From grand weddings to joyful birthdays and community utsavs, orchestrate budgets, rituals, vendors, and guests effortlessly from one unified cockpit.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#54265F] text-white font-semibold text-sm hover:bg-[#3F1A48] shadow-lg shadow-[#54265F]/25 transition"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="px-6 py-3.5 rounded-xl bg-white border border-[#EEE7F3] text-[#54265F] font-semibold text-sm hover:bg-[#EEE7F3]/40 transition"
              >
                Explore Intelligent Features
              </Link>
            </div>

            {/* Metric proof */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#EEE7F3]">
              <div>
                <p className="font-serif text-2xl font-bold text-[#54265F]">10+</p>
                <p className="text-xs text-gray-500 font-medium">Event Archetypes</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#54265F]">8 AI Agents</p>
                <p className="text-xs text-gray-500 font-medium">Orchestrated in Sync</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#54265F]">₹0</p>
                <p className="text-xs text-gray-500 font-medium">Hidden Markups</p>
              </div>
            </div>
          </div>

          {/* Floating AI Glass Card Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md p-6 rounded-3xl glass-card border border-[#75458B]/20 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#EEE7F3]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#54265F] text-[#F3E5C8] flex items-center justify-center font-bold">
                    AI
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#25212A]">Your Wedding Plan is Ready!</h3>
                    <p className="text-[11px] text-gray-500">Maharashtrian Wedding • Pune</p>
                  </div>
                </div>
                <span className="text-[10px] bg-[#31966A]/10 text-[#31966A] font-bold px-2 py-1 rounded-full">
                  Synchronized
                </span>
              </div>

              {/* Stat Pills */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8F4FA] rounded-2xl border border-[#EEE7F3]">
                  <p className="text-[10px] text-gray-500 font-medium uppercase">Budget Optimized</p>
                  <p className="text-lg font-bold text-[#54265F]">₹15,00,000</p>
                  <p className="text-[10px] text-[#31966A] font-semibold">Saved ₹80,000 via AI</p>
                </div>
                <div className="p-3 bg-[#F8F4FA] rounded-2xl border border-[#EEE7F3]">
                  <p className="text-[10px] text-gray-500 font-medium uppercase">Guest Count</p>
                  <p className="text-lg font-bold text-[#25212A]">250 Guests</p>
                  <p className="text-[10px] text-gray-500">88% RSVP Confirmed</p>
                </div>
              </div>

              {/* Dynamic Task Snippet */}
              <div className="p-3 bg-white rounded-2xl border border-[#EEE7F3] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700">Preparation Timeline</span>
                  <span className="text-[10px] font-bold text-[#75458B]">12/16 Completed</span>
                </div>
                <div className="w-full bg-[#EEE7F3] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#75458B] h-full w-3/4 rounded-full"></div>
                </div>
                <p className="text-[11px] text-gray-500 italic">
                  &ldquo;Panditji samagri & modak dessert tasting finalized with Shree Caterers.&rdquo;
                </p>
              </div>

              <Link
                href="/dashboard"
                className="block text-center w-full py-2.5 rounded-xl gradient-ai-button text-xs font-bold"
              >
                Inspect Live Workspace →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section id="categories" className="py-20 bg-white border-y border-[#EEE7F3]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#54265F]">
              Crafted for Every Occasion
            </h2>
            <p className="text-gray-600 text-sm">
              Eventora AI customizes ceremony checklists, budgeting models, and vendor recommendations to your exact regional tradition and scale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="group p-6 rounded-3xl bg-[#FFFDF9] border border-[#EEE7F3] hover:border-[#75458B]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8F4FA] text-[#54265F] flex items-center justify-center group-hover:scale-110 transition">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#25212A]">{cat.title}</h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">{cat.count}</p>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{cat.desc}</p>
                  </div>
                  <div className="pt-6 border-t border-[#EEE7F3] mt-6 flex items-center justify-between text-xs font-semibold text-[#54265F]">
                    <span>Explore Template</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#54265F]">
              How Eventora AI Works
            </h2>
            <p className="text-gray-600 text-sm">
              Four simple steps from a rough idea to an impeccably coordinated celebration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Tell Us In Your Words", desc: "Describe your event in plain language: budget, location, tradition, and guest count." },
              { step: "02", title: "AI Orchestrates The Plan", desc: "Our 8 specialized agents generate mathematical budget breakdowns and cultural timelines." },
              { step: "03", title: "Manage Vendors & Guests", desc: "Compare quotations, track advance payments, seat guests, and share digital invites." },
              { step: "04", title: "Celebrate Stress-Free", desc: "Run your event with the mobile-optimized Event Day Dashboard & contingency matrix." },
            ].map((st) => (
              <div key={st.step} className="p-6 rounded-3xl bg-white border border-[#EEE7F3] space-y-3">
                <span className="font-serif text-3xl font-bold text-[#C58B76]">{st.step}</span>
                <h4 className="font-bold text-base text-[#25212A]">{st.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-[#54265F] text-white py-16 border-t border-[#75458B]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F3E5C8] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#54265F]" />
              </div>
              <span className="font-serif text-xl font-bold text-[#FFFDF9]">Eventora AI</span>
            </div>
            <p className="text-xs text-[#EEE7F3]/80 max-w-sm leading-relaxed">
              Empowering families, planners, and communities to design magnificent celebrations with the precision of multi-agent artificial intelligence.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-bold text-[#F3E5C8] uppercase tracking-wider text-[11px]">Modules</p>
            <p><Link href="/budget" className="hover:text-white text-[#EEE7F3]/80">Budget Planner</Link></p>
            <p><Link href="/cultural-planner" className="hover:text-white text-[#EEE7F3]/80">Cultural Ceremonies</Link></p>
            <p><Link href="/vendors" className="hover:text-white text-[#EEE7F3]/80">Vendor Management</Link></p>
            <p><Link href="/copilot" className="hover:text-white text-[#EEE7F3]/80">AI Event Copilot</Link></p>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-bold text-[#F3E5C8] uppercase tracking-wider text-[11px]">Quick Access</p>
            <p><Link href="/dashboard" className="hover:text-white text-[#EEE7F3]/80">Organizer Dashboard</Link></p>
            <p><Link href="/event-day" className="hover:text-white text-[#EEE7F3]/80">Event Day Dashboard</Link></p>
            <p><Link href="/reports" className="hover:text-white text-[#EEE7F3]/80">Analytics & Reports</Link></p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-[#75458B]/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#EEE7F3]/60">
          <p>© 2026 Eventora AI. All rights reserved.</p>
          <p>Built with Next.js, FastAPI & Google Gemini Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
