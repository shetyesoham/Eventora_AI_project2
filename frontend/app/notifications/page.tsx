"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useEvent } from "@/context/EventContext";
import { 
  Bell, CheckCircle2, AlertTriangle, Clock, 
  Calendar, Store, ShieldAlert, Sparkles, Trash2, CheckCheck
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "alert" | "info" | "success" | "reminder";
  title: string;
  message: string;
  time: string;
  read: boolean;
  module: string;
}

export default function NotificationsPage() {
  const { currentEvent } = useEvent();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      type: "alert",
      title: "Critical Task Due Soon",
      message: "Mandap and floral layout approval is pending and required 45 days prior to wedding day.",
      time: "10 mins ago",
      read: false,
      module: "Tasks"
    },
    {
      id: "2",
      type: "success",
      title: "RSVP Confirmed with Dietary Preference",
      message: "Ramesh & Sunita Shah confirmed attendance (2 Guests, Jain Dietary Profile, Table 2).",
      time: "45 mins ago",
      read: false,
      module: "Guests"
    },
    {
      id: "3",
      type: "reminder",
      title: "Vendor Advance Payment Due",
      message: "Milestone payment for Shree Maharashtrian Caterers scheduled for next Monday.",
      time: "2 hours ago",
      read: false,
      module: "Budget"
    },
    {
      id: "4",
      type: "info",
      title: "Municipal Sound Clearance Verified",
      message: "Police Station & Sound Dept approved outdoor loudspeaker license until 10:00 PM.",
      time: "5 hours ago",
      read: true,
      module: "Community"
    },
    {
      id: "5",
      type: "alert",
      title: "Weather Contingency Safeguard Active",
      message: "Predictive Risk Engine detected unseasonal rain forecast. Indoor Banquet Hall B reserved.",
      time: "Yesterday",
      read: true,
      module: "Risks"
    }
  ]);

  function markAllAsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function toggleRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  }

  function deleteNotification(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayed = filter === "all" ? notifications : notifications.filter(n => !n.read);

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#54265F]">
              Activity & Notifications Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Live updates for <strong>{currentEvent?.title || "Active Celebration"}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#EEE7F3] bg-white text-xs font-semibold text-[#54265F] hover:bg-[#F8F4FA] transition shadow-2xs"
            >
              <CheckCheck className="w-4 h-4 text-[#31966A]" />
              <span>Mark all as read</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between border-b border-[#EEE7F3] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === "all" 
                  ? "bg-[#54265F] text-white shadow-xs" 
                  : "bg-[#F8F4FA] text-gray-600 hover:text-[#54265F]"
              }`}
            >
              All Notifications ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === "unread" 
                  ? "bg-[#54265F] text-white shadow-xs" 
                  : "bg-[#F8F4FA] text-gray-600 hover:text-[#54265F]"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          <span className="text-xs text-gray-400">Real-time cross-module updates</span>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {displayed.length > 0 ? (
            displayed.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                  n.read
                    ? "bg-white border-[#EEE7F3]"
                    : "bg-[#FFFDF9] border-[#54265F]/20 shadow-xs ring-1 ring-[#54265F]/10"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
                    n.type === "alert" ? "bg-red-50 text-red-600" :
                    n.type === "success" ? "bg-emerald-50 text-[#31966A]" :
                    n.type === "reminder" ? "bg-amber-50 text-[#E7A23B]" :
                    "bg-[#54265F]/10 text-[#54265F]"
                  }`}>
                    {n.type === "alert" ? <AlertTriangle className="w-5 h-5" /> :
                     n.type === "success" ? <CheckCircle2 className="w-5 h-5" /> :
                     n.type === "reminder" ? <Clock className="w-5 h-5" /> :
                     <Bell className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F8F4FA] text-[#75458B]">
                        {n.module}
                      </span>
                      <h3 className="font-serif text-sm font-bold text-[#25212A]">{n.title}</h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#54265F]"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-gray-400 font-medium block pt-1">{n.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleRead(n.id)}
                    title={n.read ? "Mark as unread" : "Mark as read"}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#54265F] hover:bg-gray-100 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteNotification(n.id)}
                    title="Dismiss"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#EEE7F3] space-y-2">
              <Bell className="w-8 h-8 text-gray-300 mx-auto" />
              <h4 className="font-bold text-sm text-[#25212A]">All caught up!</h4>
              <p className="text-xs text-gray-400">No unread notifications for this event.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

