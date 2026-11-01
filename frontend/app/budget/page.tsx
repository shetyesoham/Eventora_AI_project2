"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiService } from "@/services/api";
import { formatCurrency } from "@/lib/utils";
import { Expense } from "@/types";
import { useEvent } from "@/context/EventContext";
import { 
  Calculator, Sparkles, Plus, X, Check 
} from "lucide-react";

export default function BudgetPage() {
  const { currentEventId, currentEvent } = useEvent();
  const [budget, setBudget] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal State for Add Custom Expense
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [submittingExpense, setSubmittingExpense] = useState(false);

  // Form inputs for new expense
  const [expenseTitle, setExpenseTitle] = useState("");
  const [categoryName, setCategoryName] = useState("Decor & Mandap");
  const [estimatedAmount, setEstimatedAmount] = useState(50000);
  const [advancePaid, setAdvancePaid] = useState(15000);
  const [vendorName, setVendorName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"Unpaid" | "Partially Paid" | "Paid">("Partially Paid");

  // Simulator Inputs
  const [simGuests, setSimGuests] = useState(150);
  const [simCateringCost, setSimCateringCost] = useState(1200);
  const [simVenue, setSimVenue] = useState(300000);
  const [simDecor, setSimDecor] = useState(150000);
  const [simOther, setSimOther] = useState(100000);
  const [simResult, setSimResult] = useState<any>(null);

  async function fetchBudgetData() {
    if (!currentEventId) return;
    try {
      const b = await apiService.getBudget(currentEventId);
      setBudget(b);
      if (currentEvent) {
        setSimGuests(currentEvent.guest_count);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchBudgetData();
  }, [currentEventId, currentEvent]);

  async function handleSimulate() {
    if (!currentEventId) return;
    const res = await apiService.simulateBudget(currentEventId, {
      guest_count: simGuests,
      catering_cost_per_person: simCateringCost,
      venue_cost: simVenue,
      decor_cost: simDecor,
      other_expenses: simOther,
    });
    setSimResult(res);
  }

  async function handleCreateExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!currentEventId || !expenseTitle.trim() || submittingExpense) return;

    setSubmittingExpense(true);
    try {
      await apiService.addExpense(currentEventId, {
        title: expenseTitle,
        category_name: categoryName,
        estimated_amount: Number(estimatedAmount),
        actual_amount: Number(estimatedAmount),
        advance_paid: Number(advancePaid),
        payment_status: paymentStatus,
        vendor_name: vendorName || undefined,
        due_date: new Date().toISOString().split("T")[0]
      });

      // Reload fresh budget metrics and ledger table from database
      await fetchBudgetData();

      // Reset form and close modal
      setExpenseTitle("");
      setVendorName("");
      setIsAddExpenseOpen(false);
    } catch (err) {
      console.error("Error creating expense:", err);
    } finally {
      setSubmittingExpense(false);
    }
  }

  if (loading || !budget) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#54265F]"></div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#54265F]">
              Smart Budget Planner & Simulator
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Active for: <strong>{currentEvent?.title}</strong> ({currentEvent?.city})
            </p>
          </div>
          <button 
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#54265F] text-white text-xs font-semibold hover:bg-[#3F1A48] transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Expense</span>
          </button>
        </div>

        {/* 4 Financial Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Total Budget</span>
            <p className="text-2xl font-bold text-[#25212A] mt-1">{formatCurrency(budget.total_budget)}</p>
            <span className="text-[11px] text-[#75458B] font-semibold">Priority: {currentEvent?.budget_priority}</span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Estimated Total</span>
            <p className="text-2xl font-bold text-[#25212A] mt-1">{formatCurrency(budget.total_estimated)}</p>
            <span className="text-[11px] text-[#31966A] font-semibold">Category Allocations Active</span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Actual Spent / Advance</span>
            <p className="text-2xl font-bold text-[#54265F] mt-1">{formatCurrency(budget.total_spent)}</p>
            <span className="text-[11px] text-gray-500">{budget.utilization_rate}% disbursed</span>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-[#EEE7F3] shadow-xs">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Remaining Balance</span>
            <p className="text-2xl font-bold text-[#31966A] mt-1">{formatCurrency(budget.remaining_balance)}</p>
            <span className="text-[11px] text-[#31966A] font-semibold">Available liquid funds</span>
          </div>
        </div>

        {/* Interactive Simulator Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white to-[#F8F4FA] border border-[#EEE7F3] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#75458B] text-white flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#25212A]">Dynamic Budget Simulator</h3>
              <p className="text-xs text-gray-500">
                Adjust variables for {currentEvent?.title} to simulate real-time cost differences with zero guesswork.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600">Expected Guests</label>
              <input
                type="number"
                value={simGuests}
                onChange={(e) => setSimGuests(Number(e.target.value))}
                className="w-full mt-1.5 p-3 rounded-xl bg-white border border-[#EEE7F3] text-sm focus:border-[#75458B] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Catering Cost / Person (₹)</label>
              <input
                type="number"
                value={simCateringCost}
                onChange={(e) => setSimCateringCost(Number(e.target.value))}
                className="w-full mt-1.5 p-3 rounded-xl bg-white border border-[#EEE7F3] text-sm focus:border-[#75458B] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Venue Booking (₹)</label>
              <input
                type="number"
                value={simVenue}
                onChange={(e) => setSimVenue(Number(e.target.value))}
                className="w-full mt-1.5 p-3 rounded-xl bg-white border border-[#EEE7F3] text-sm focus:border-[#75458B] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Decor & Styling (₹)</label>
              <input
                type="number"
                value={simDecor}
                onChange={(e) => setSimDecor(Number(e.target.value))}
                className="w-full mt-1.5 p-3 rounded-xl bg-white border border-[#EEE7F3] text-sm focus:border-[#75458B] focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSimulate}
            className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-ai-button text-xs font-bold shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#F3E5C8]" />
            <span>Simulate & Recalculate</span>
          </button>

          {/* Simulation Output Card */}
          {simResult && (
            <div className="p-6 rounded-2xl bg-white border border-[#75458B]/30 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EEE7F3]">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Revised Total Estimate</span>
                  <p className="text-2xl font-bold text-[#54265F]">
                    {formatCurrency(simResult.new_estimated_budget)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Variance from Base</span>
                  <p className={`text-xl font-bold ${simResult.difference <= 0 ? "text-[#31966A]" : "text-[#D95C5C]"}`}>
                    {simResult.difference <= 0 ? "Savings: " : "Addition: "}
                    {formatCurrency(Math.abs(simResult.difference))}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Per-Guest Cost</span>
                  <p className="text-xl font-bold text-[#25212A]">
                    {formatCurrency(simResult.cost_per_guest)} / pax
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-700">AI Optimization Insights:</span>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  {simResult.optimization_suggestions.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Expenses Line Items Table */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EEE7F3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#54265F]">Tracked Category Expenses</h3>
            <span className="text-xs font-semibold text-gray-400">
              {budget.expenses?.length || 0} line items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F4FA] text-gray-500 font-semibold border-y border-[#EEE7F3]">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Estimated</th>
                  <th className="p-3">Advance Paid</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE7F3]">
                {budget.expenses && budget.expenses.map((e: Expense) => (
                  <tr key={e.id} className="hover:bg-[#FFFDF9] transition">
                    <td className="p-3 font-semibold text-[#54265F]">{e.category_name}</td>
                    <td className="p-3 font-medium text-[#25212A]">{e.title}</td>
                    <td className="p-3 text-gray-600">{e.vendor_name || "—"}</td>
                    <td className="p-3 font-bold">{formatCurrency(e.estimated_amount)}</td>
                    <td className="p-3 text-[#31966A] font-semibold">{formatCurrency(e.advance_paid)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        e.payment_status === 'Paid' ? 'bg-[#31966A]/10 text-[#31966A]' :
                        e.payment_status === 'Partially Paid' ? 'bg-[#E7A23B]/10 text-[#E7A23B]' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {e.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Custom Expense */}
        {isAddExpenseOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-[#EEE7F3]">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEE7F3]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#F8F4FA] text-[#54265F] flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#75458B]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#25212A]">
                      Add Custom Expense
                    </h3>
                    <p className="text-xs text-gray-400">
                      Record a line-item expense for <strong>{currentEvent?.title}</strong>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateExpense} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">Expense Title / Description *</label>
                  <input
                    type="text"
                    required
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    placeholder="e.g. Sangeet DJ Sound System or Kesar Modak Desserts"
                    className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs sm:text-sm focus:border-[#75458B] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Category</label>
                    <select
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                    >
                      <option value="Venue & Banqueting">Venue & Banqueting</option>
                      <option value="Catering & Beverages">Catering & Beverages</option>
                      <option value="Decor & Mandap">Decor & Mandap</option>
                      <option value="Photography & Videography">Photography & Videography</option>
                      <option value="Music, Sound & DJ">Music, Sound & DJ</option>
                      <option value="Attire & Jewellery">Attire & Jewellery</option>
                      <option value="Invitations & Gifts">Invitations & Gifts</option>
                      <option value="Logistics & Transport">Logistics & Transport</option>
                      <option value="Miscellaneous & Contingency">Miscellaneous & Contingency</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as any)}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs font-medium focus:border-[#75458B] focus:outline-none cursor-pointer"
                    >
                      <option value="Unpaid">Unpaid (Zero advance)</option>
                      <option value="Partially Paid">Partially Paid (Advance token)</option>
                      <option value="Paid">Fully Paid (Settled)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Total Quoted / Estimated (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={estimatedAmount}
                      onChange={(e) => setEstimatedAmount(Number(e.target.value))}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Advance Paid (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={advancePaid}
                      onChange={(e) => setAdvancePaid(Number(e.target.value))}
                      className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Vendor / Supplier Name (Optional)</label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="e.g. Pune Sound & Light Works or Shree Caterers"
                    className="w-full mt-1.5 p-3 rounded-xl bg-[#FFFDF9] border border-[#EEE7F3] text-xs focus:border-[#75458B] focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-[#EEE7F3] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddExpenseOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingExpense}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-ai-button text-xs font-bold shadow-md disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 text-[#F3E5C8]" />
                    <span>{submittingExpense ? "Recording..." : "Record Expense"}</span>
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
