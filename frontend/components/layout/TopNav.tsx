"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Sparkles, User, ChevronDown, CalendarDays, LogOut, Home, Settings } from "lucide-react";
import { useEvent } from "@/context/EventContext";

interface TopNavProps {
  onToggleSidebar?: () => void;
}

export function TopNav({ onToggleSidebar }: TopNavProps) {
  const router = useRouter();
  const { currentEventId, currentEvent, eventsList, setCurrentEventId } = useEvent();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setIsProfileOpen(false);
    router.push("/");
  }

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[#EEE7F3] sticky top-0 z-20 px-6 flex items-center justify-between shadow-xs">
      {/* Event Context Switcher & Search */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-[#EEE7F3]/60 text-[#54265F] transition"
            aria-label="Toggle Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-2 bg-[#F8F4FA] border border-[#EEE7F3] px-3 py-1.5 rounded-xl">
          <CalendarDays className="w-4 h-4 text-[#75458B]" />
          <span className="text-xs font-semibold text-[#54265F]">Current Event:</span>
          <select 
            value={currentEventId}
            onChange={(e) => setCurrentEventId(e.target.value)}
            className="bg-transparent text-xs font-medium text-[#25212A] focus:outline-none cursor-pointer max-w-[200px] truncate"
          >
            {eventsList.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} ({ev.city})
              </option>
            ))}
          </select>
          <span className="text-[10px] bg-[#31966A]/15 text-[#31966A] font-semibold px-2 py-0.5 rounded-md">
            Active Context
          </span>
        </div>

        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search tasks, guests, vendors, rituals..."
            className="w-64 pl-9 pr-4 py-1.5 bg-[#FFFDF9] border border-[#EEE7F3] rounded-xl text-xs focus:outline-none focus:border-[#75458B] transition"
          />
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick AI Trigger */}
        <Link 
          href="/copilot"
          className="hidden sm:flex items-center gap-1.5 gradient-ai-button text-xs font-medium px-3 py-2 rounded-xl"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Copilot</span>
        </Link>

        {/* Notifications */}
        <Link 
          href="/notifications" 
          className="relative p-2 rounded-xl text-gray-600 hover:bg-[#EEE7F3]/60 transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D95C5C] rounded-full"></span>
        </Link>

        {/* User Avatar with Profile & Logout Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-2 border-l border-[#EEE7F3] hover:opacity-85 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#54265F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-[#25212A]">Aarav Deshmukh</p>
              <p className="text-[10px] text-gray-500">aarav@eventora.ai</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#EEE7F3] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-[#EEE7F3]">
                <p className="text-xs font-bold text-[#25212A]">Aarav Deshmukh</p>
                <p className="text-[11px] text-gray-400">Lead Event Organizer</p>
              </div>

              <div className="py-1">
                <Link
                  href="/"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-[#F8F4FA] hover:text-[#54265F] transition"
                >
                  <Home className="w-4 h-4 text-gray-400" />
                  <span>Main Landing Page</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-[#F8F4FA] hover:text-[#54265F] transition"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span>Settings & Preferences</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-[#EEE7F3]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition font-medium"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Log Out to Home</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
