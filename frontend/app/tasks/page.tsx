"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiService } from "@/services/api";
import { TaskItem } from "@/types";
import { useEvent } from "@/context/EventContext";
import { CheckSquare, Plus, CheckCircle2, X, Check } from "lucide-react";

export default function TasksPage() {
  const { currentEventId, currentEvent } = useEvent();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [loading, setLoading] = useState(true);

  // Add Task Modal State
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("2026-11-25");
  const [priority, setPriority] = useState<any>("High");
  const [assignedTo, setAssignedTo] = useState("Aarav Deshmukh");
  const [category, setCategory] = useState("Logistics");

  async function loadTasks() {
    if (!currentEventId) return;
    try {
      const t = await apiService.getTasks(currentEventId);
      setTasks(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadTasks();
  }, [currentEventId]);

  async function toggleTaskStatus(taskId: string) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const nextStatus = task.status === "Completed" ? "In Progress" : "Completed";

    // 1. Optimistic UI update
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: nextStatus };
      }
      return t;
    }));

    // 2. Persist to backend API so Dashboard updates live
    try {
      await apiService.updateTask(taskId, {
        ...task,
        status: nextStatus
      });
    } catch (err) {
      console.error("Failed to update task status in backend:", err);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!currentEventId || !title.trim() || submitting) return;

    setSubmitting(true);
    try {
      await apiService.addTask(currentEventId, {
        title,
        description,
        due_date: dueDate,
        priority,
        status: "Not Started",
        assigned_to: assignedTo,
        category,
      });

      await loadTasks();
      setIsAddTaskOpen(false);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#54265F]">
              Timeline & Task Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Active for: <strong>{currentEvent?.title}</strong> ({tasks.length} milestones tracked)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#F8F4FA] p-1 rounded-xl border border-[#EEE7F3] flex items-center">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${view === "list" ? "bg-[#54265F] text-white" : "text-gray-600"}`}
              >
                List View
              </button>
              <button
                onClick={() => setView("kanban")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${view === "kanban" ? "bg-[#54265F] text-white" : "text-gray-600"}`}
              >
                Kanban Board
              </button>
            </div>
            <button 
              onClick={() => setIsAddTaskOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#54265F] text-white text-xs font-semibold hover:bg-[#3F1A48] transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* List View */}
        {view === "list" && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-4">
            <div className="divide-y divide-[#EEE7F3]">
              {tasks.map((t) => (
                <div key={t.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(t.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition ${
                        t.status === 'Completed' ? "bg-[#31966A] border-[#31966A] text-white" : "border-gray-300 hover:border-[#54265F]"
                      }`}
                    >
                      {t.status === 'Completed' && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${t.status === 'Completed' ? 'line-through text-gray-400' : 'text-[#25212A]'}`}>
                        {t.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
                        <span>👤 {t.assigned_to}</span>
                        <span>•</span>
                        <span>🏷️ {t.category}</span>
                        <span>•</span>
                        <span>📅 Due: {t.due_date}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    t.priority === 'Critical' ? 'bg-[#D95C5C]/10 text-[#D95C5C]' :
                    t.priority === 'High' ? 'bg-[#E7A23B]/10 text-[#E7A23B]' : 'bg-[#31966A]/10 text-[#31966A]'
                  }`}>
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kanban Board View */}
        {view === "kanban" && (
          <div className="grid md:grid-cols-3 gap-6">
            {(["Not Started", "In Progress", "Completed"] as const).map((col) => {
              const colTasks = tasks.filter(t => t.status === col);
              return (
                <div key={col} className="p-5 rounded-3xl bg-[#F8F4FA] border border-[#EEE7F3] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#54265F]">
                      {col} ({colTasks.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {colTasks.map((t) => (
                      <div key={t.id} className="p-4 bg-white rounded-2xl border border-[#EEE7F3] shadow-xs space-y-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                          t.priority === 'Critical' ? 'bg-[#D95C5C]/10 text-[#D95C5C]' : 'bg-[#E7A23B]/10 text-[#E7A23B]'
                        }`}>
                          {t.priority}
                        </span>
                        <p className="text-xs font-bold text-[#25212A]">{t.title}</p>
                        <p className="text-[11px] text-gray-400">Assigned: {t.assigned_to}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Add Task */}
        {isAddTaskOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-[#EEE7F3]">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEE7F3]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#F8F4FA] text-[#54265F] flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-[#75458B]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#25212A]">
                      Create Milestone Task
                    </h3>
                    <p className="text-xs text-gray-400">Assign preparation deadline for {currentEvent?.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddTaskOpen(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Confirm Sweet Modak Menu with Shree Caterers"
                    className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details, quantities, contact phone or notes..."
                    className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Due Date</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                    >
                      <option value="Critical">Critical (Immediate deadline)</option>
                      <option value="High">High (Core milestone)</option>
                      <option value="Medium">Medium (Standard)</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Assignee</label>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="e.g. Uncle Anand or Aarav"
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                    >
                      <option value="Catering">Catering</option>
                      <option value="Venue">Venue</option>
                      <option value="Invitations">Invitations</option>
                      <option value="Rituals">Rituals & Puja</option>
                      <option value="Logistics">Logistics & Accommodation</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EEE7F3] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddTaskOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-ai-button text-xs font-bold shadow-md disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 text-[#F3E5C8]" />
                    <span>{submitting ? "Saving..." : "Create Task"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
