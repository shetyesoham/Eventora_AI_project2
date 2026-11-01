"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Calendar, Sparkles, PieChart, Palette, 
  Store, Users, CheckSquare, ShieldAlert, HeartHandshake, 
  Smartphone, BarChart3, Settings, HelpCircle, Bell
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  const mainNav = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Events", href: "/events", icon: Calendar },
    { name: "AI Event Copilot", href: "/copilot", icon: Sparkles, highlight: true },
    { name: "Budget Planner", href: "/budget", icon: PieChart },
    { name: "Cultural Planner", href: "/cultural-planner", icon: Palette },
    { name: "Vendor Hub", href: "/vendors", icon: Store },
    { name: "Guest Management", href: "/guests", icon: Users },
    { name: "Timeline & Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Risk Management", href: "/risks", icon: ShieldAlert },
    { name: "Community Events", href: "/community", icon: HeartHandshake },
    { name: "Event Day Dashboard", href: "/event-day", icon: Smartphone },
    { name: "Reports & Analytics", href: "/reports", icon: BarChart3 },
  ];

  const secondaryNav = [
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help & Support", href: "/support", icon: HelpCircle },
  ];

  return (
    <aside className={`h-screen sticky top-0 bg-[#54265F] text-white flex flex-col transition-all duration-300 z-30 ${collapsed ? "w-20" : "w-64"}`}>
      {/* Brand Header */}
      <div className="p-6 border-b border-[#75458B]/50 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F3E5C8] to-[#C58B76] flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-[#54265F]" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-serif text-xl tracking-tight font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFFDF9] to-[#F3E5C8]">
                Eventora AI
              </span>
              <p className="text-[10px] tracking-widest uppercase text-[#F3E5C8]/80">Plan Smarter</p>
            </div>
          )}
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="text-[11px] font-semibold text-[#F3E5C8]/70 px-3 pb-2 uppercase tracking-wider">
          {!collapsed && "Modules"}
        </div>
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? "bg-[#75458B] text-white shadow-md shadow-[#25212A]/20"
                  : item.highlight
                  ? "bg-gradient-to-r from-[#75458B]/40 to-[#F3E5C8]/10 text-[#F3E5C8] hover:bg-[#75458B]/70"
                  : "text-[#EEE7F3]/80 hover:bg-[#75458B]/40 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${item.highlight ? "text-[#F3E5C8]" : ""}`} />
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && item.highlight && (
                <span className="ml-auto text-[10px] bg-[#F3E5C8] text-[#54265F] font-semibold px-2 py-0.5 rounded-full">
                  AI
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 border-t border-[#75458B]/40 text-[11px] font-semibold text-[#F3E5C8]/70 px-3 pb-2 uppercase tracking-wider">
          {!collapsed && "System"}
        </div>
        {secondaryNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                isActive ? "bg-[#75458B] text-white" : "text-[#EEE7F3]/70 hover:bg-[#75458B]/30 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* User Info Footer */}
      <div className="p-4 border-t border-[#75458B]/50 bg-[#3F1A48]/50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#75458B] border border-[#F3E5C8]/40 flex items-center justify-center font-bold text-sm text-[#F3E5C8]">
          AD
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">Aarav Deshmukh</p>
            <p className="text-[10px] text-[#F3E5C8]/80 truncate">Pune • Organizer</p>
          </div>
        )}
      </div>
    </aside>
  );
}

