"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Toast from "@/components/Toast";
import { getPlatformToken } from "@/lib/auth";
import { getApiUrl, API_CONFIG, frappeAPI } from "@/lib/config";

// ───── Types ─────

interface CreditStatus {
  limit: number;
  usage: number;
  remaining: number;
  usage_percent: number;
  status: string;
  last_synced: string | null;
}

interface LedgerEntry {
  event_type: string;
  timestamp: string;
  credit_limit_before: number;
  credit_limit_after: number;
  credit_usage_before: number;
  credit_usage_after: number;
  credit_remaining_before: number;
  credit_remaining_after: number;
  notes: string | null;
}

interface BillingData {
  has_billing: boolean;
  credit?: CreditStatus;
  history?: LedgerEntry[];
  message?: string;
}

interface BillingPlan {
  plan_name: string;
  amount_inr: number;
  amount_usd: number;
  interval: string;
  credit_amount: number;
  description: string;
  features: string;
}

interface SubscriptionData {
  has_subscription: boolean;
  subscription?: {
    plan_name: string;
    amount_inr: number;
    amount_usd: number;
    interval: string;
    credit_amount: number;
    status: string;
    current_start: string | null;
    current_end: string | null;
    charge_at: string | null;
    total_paid: number;
    total_credits_provisioned: number;
    payment_count: number;
    razorpay_subscription_id: string;
  };
}

// ───── Constants ─────

type Currency = "INR" | "USD";

const CURRENCY_SYMBOL: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
};

const EVENT_LABELS: Record<string, string> = {
  provision: "Credits Provisioned",
  sync: "Usage Updated",
  top_up: "Credits Added",
  exhausted: "Credits Exhausted",
  alert_sent: "Low Credit Alert",
  key_disabled: "Key Disabled",
  key_enabled: "Key Re-enabled",
  subscription_payment: "Subscription Payment",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  exhausted: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  disabled: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  not_provisioned: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
};

const SUB_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "text-emerald-700 bg-emerald-50" },
  authenticated: { label: "Pending Activation", color: "text-blue-700 bg-blue-50" },
  created: { label: "Awaiting Payment", color: "text-yellow-700 bg-yellow-50" },
  pending: { label: "Payment Pending", color: "text-orange-700 bg-orange-50" },
  halted: { label: "Payment Failed", color: "text-red-700 bg-red-50" },
  cancelled: { label: "Cancelled", color: "text-gray-600 bg-gray-100" },
  completed: { label: "Completed", color: "text-gray-600 bg-gray-100" },
  expired: { label: "Expired", color: "text-gray-600 bg-gray-100" },
};

// ───── Razorpay Checkout Script Loader ─────

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.head.appendChild(script);
  });
}

// ───── Component ─────

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [currency, setCurrency] = useState<Currency>("INR");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showError = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  // ───── Helpers ─────

  function getPlanPrice(plan: BillingPlan): number {
    return currency === "USD" ? plan.amount_usd : plan.amount_inr;
  }

  function formatPrice(amount: number): string {
    return `${CURRENCY_SYMBOL[currency]}${amount.toLocaleString()}`;
  }

  // ───── Fetch billing overview ─────
  const fetchBilling = useCallback(async () => {
    const token = getPlatformToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const resp = await frappeAPI.call(
        getApiUrl(API_CONFIG.ENDPOINTS.GET_BILLING_OVERVIEW),
        {
          method: "POST",
          body: JSON.stringify({ platform_token: token }),
        }
      );
      const data = await resp.json();
      const result = data.message;

      if (result?.success) {
        setBilling(result);
      }
    } catch {
      // Billing fetch failed — still show plans
    } finally {
      setLoading(false);
    }
  }, []);

  // ───── Fetch plans + subscription ─────
  const fetchPlansAndSubscription = useCallback(async () => {
    const token = getPlatformToken();

    try {
      const plansResp = await frappeAPI.call(
        getApiUrl(API_CONFIG.ENDPOINTS.GET_PLANS),
        { method: "POST", body: JSON.stringify({}) }
      );
      const plansData = await plansResp.json();
      if (plansData.message?.success) {
        setPlans(plansData.message.plans || []);
      }

      if (token) {
        const subResp = await frappeAPI.call(
          getApiUrl(API_CONFIG.ENDPOINTS.GET_SUBSCRIPTION),
          {
            method: "POST",
            body: JSON.stringify({ platform_token: token }),
          }
        );
        const subData = await subResp.json();
        if (subData.message?.success) {
          setSubscription(subData.message);
        }
      }
    } catch {
      // Plans/subscription fetch failure is non-critical
    }
  }, []);

  useEffect(() => {
    fetchBilling();
    fetchPlansAndSubscription();
  }, [fetchBilling, fetchPlansAndSubscription]);

  // ───── Refresh credits ─────
  const handleRefresh = async () => {
    const token = getPlatformToken();
    if (!token) return;

    setRefreshing(true);
    try {
      const resp = await frappeAPI.call(
        getApiUrl(API_CONFIG.ENDPOINTS.REFRESH_CREDIT_STATUS),
        {
          method: "POST",
          body: JSON.stringify({ platform_token: token }),
        }
      );
      const data = await resp.json();
      if (data.message?.success) {
        await fetchBilling();
      }
    } catch {
      // Silently fail
    } finally {
      setRefreshing(false);
    }
  };

  // ───── Subscribe to a plan ─────
  const handleSubscribe = async (planName: string) => {
    const token = getPlatformToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setSubscribing(planName);

    try {
      const resp = await frappeAPI.call(
        getApiUrl(API_CONFIG.ENDPOINTS.CREATE_SUBSCRIPTION),
        {
          method: "POST",
          body: JSON.stringify({ platform_token: token, plan_name: planName, currency }),
        }
      );
      const data = await resp.json();
      const result = data.message;

      if (!result?.success) {
        showError(result?.message || "Failed to create subscription.");
        return;
      }

      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key: result.razorpay_key_id,
        subscription_id: result.subscription_id,
        name: "SenaERP",
        description: `${planName} Plan`,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await frappeAPI.call(
              getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_PAYMENT),
              {
                method: "POST",
                body: JSON.stringify({
                  platform_token: token,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );
          } catch {
            // Verification handled by webhook anyway
          }

          await fetchBilling();
          await fetchPlansAndSubscription();
        },
        theme: {
          color: "#2C1810",
        },
      });

      rzp.open();
    } catch {
      showError("Something went wrong. Please try again.");
    } finally {
      setSubscribing(null);
    }
  };

  // ───── Cancel subscription ─────
  const handleCancel = async () => {
    const token = getPlatformToken();
    if (!token) return;

    setCancelling(true);
    try {
      const resp = await frappeAPI.call(
        getApiUrl(API_CONFIG.ENDPOINTS.CANCEL_SUBSCRIPTION),
        {
          method: "POST",
          body: JSON.stringify({ platform_token: token }),
        }
      );
      const data = await resp.json();
      if (data.message?.success) {
        await fetchPlansAndSubscription();
      } else {
        showError(data.message?.message || "Failed to cancel subscription.");
      }
    } catch {
      showError("Could not cancel subscription. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  // ───── Loading ─────
  if (loading) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen bg-[#faf8f3] pt-28 px-4">
          <div className="mx-auto max-w-4xl">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 bg-gray-200 rounded" />
              <div className="h-48 bg-gray-100 rounded-2xl" />
              <div className="h-64 bg-gray-100 rounded-2xl" />
            </div>
          </div>
        </main>
      </>
    );
  }

  const credit = billing?.credit;
  const history = billing?.history || [];
  const statusStyle = STATUS_COLORS[credit?.status || "active"];
  const sub = subscription?.subscription;
  const hasActiveSub = sub && ["active", "authenticated", "created", "pending"].includes(sub.status);
  const subStatusInfo = SUB_STATUS_LABELS[sub?.status || ""] || { label: sub?.status, color: "text-gray-600 bg-gray-100" };

  return (
    <>
      <NavBar />
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={5000}
      />
      <main className="min-h-screen bg-[#faf8f3] pt-28 pb-16 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1
              className="text-3xl md:text-4xl"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#2C1810",
              }}
            >
              Billing
            </h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold font-futura text-gray-700 bg-white border border-gray-200 rounded-full hover:border-gray-300 shadow-sm disabled:opacity-50"
            >
              <svg
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {refreshing ? "Syncing..." : "Refresh"}
            </button>
          </div>

          {/* ───── Current Subscription ───── */}
          {sub && (
            <div className="rounded-2xl border border-[#dcd2c1] bg-white p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold font-futura text-gray-900">
                  Your Subscription
                </h2>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-futura ${subStatusInfo.color}`}>
                  {subStatusInfo.label}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-[10px] font-futura text-gray-500 mb-0.5">Plan</div>
                  <div className="text-sm font-bold font-futura text-gray-900">{sub.plan_name}</div>
                </div>
                <div>
                  <div className="text-[10px] font-futura text-gray-500 mb-0.5">Price</div>
                  <div className="text-sm font-bold font-futura text-gray-900">
                    ₹{sub.amount_inr}/{sub.interval === "monthly" ? "mo" : "yr"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-futura text-gray-500 mb-0.5">AI Credits / Cycle</div>
                  <div className="text-sm font-bold font-futura text-gray-900">${sub.credit_amount}</div>
                </div>
                <div>
                  <div className="text-[10px] font-futura text-gray-500 mb-0.5">Payments</div>
                  <div className="text-sm font-bold font-futura text-gray-900">{sub.payment_count}</div>
                </div>
              </div>
              {sub.current_end && (
                <p className="text-[9px] font-futura text-gray-400 mb-3">
                  Current period ends: {new Date(sub.current_end).toLocaleDateString()}
                </p>
              )}
              {hasActiveSub && (
                confirmingCancel ? (
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-futura text-gray-600">
                      Cancel subscription? You&apos;ll keep access until the period ends.
                    </p>
                    <button
                      onClick={() => { setConfirmingCancel(false); handleCancel(); }}
                      disabled={cancelling}
                      className="text-[10px] font-bold font-futura text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      {cancelling ? "Cancelling..." : "Yes, cancel"}
                    </button>
                    <button
                      onClick={() => setConfirmingCancel(false)}
                      className="text-[10px] font-bold font-futura text-gray-500 hover:text-gray-700"
                    >
                      Keep plan
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingCancel(true)}
                    className="text-[10px] font-bold font-futura text-red-500 hover:text-red-700"
                  >
                    Cancel Subscription
                  </button>
                )
              )}
            </div>
          )}

          {/* ───── Plans ───── */}
          {plans.length > 0 && !hasActiveSub && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-xl"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontWeight: 400,
                    color: "#2C1810",
                  }}
                >
                  Choose a Plan
                </h2>
                {/* Currency toggle */}
                <div className="flex items-center bg-white border border-gray-200 rounded-full p-0.5 shadow-sm">
                  <button
                    onClick={() => setCurrency("INR")}
                    className={`px-3 py-1 text-[10px] font-bold font-futura rounded-full transition-colors ${
                      currency === "INR"
                        ? "bg-[#2C1810] text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    ₹ INR
                  </button>
                  <button
                    onClick={() => setCurrency("USD")}
                    className={`px-3 py-1 text-[10px] font-bold font-futura rounded-full transition-colors ${
                      currency === "USD"
                        ? "bg-[#2C1810] text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => {
                  const price = getPlanPrice(plan);
                  const isFree = price === 0;

                  return (
                    <div
                      key={plan.plan_name}
                      className="rounded-2xl border border-[#dcd2c1] bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                    >
                      <h3 className="text-sm font-bold font-futura text-gray-900 mb-1">
                        {plan.plan_name}
                      </h3>
                      {plan.description && (
                        <p className="text-[10px] font-futura text-gray-500 mb-3">
                          {plan.description}
                        </p>
                      )}
                      <div className="mb-1">
                        <span className="text-2xl font-bold font-futura text-gray-900">
                          {isFree ? "Free" : formatPrice(price)}
                        </span>
                        {!isFree && (
                          <span className="text-xs font-futura text-gray-500">
                            /{plan.interval === "monthly" ? "mo" : "yr"}
                          </span>
                        )}
                      </div>
                      {!isFree && (
                        <div className="text-[10px] font-futura text-gray-500 mb-3">
                          <span className="font-bold text-emerald-600">${plan.credit_amount}</span> AI credits per cycle
                        </div>
                      )}
                      {isFree && (
                        <div className="text-[10px] font-futura text-gray-500 mb-3">
                          <span className="font-bold text-emerald-600">${plan.credit_amount}</span> AI credits included
                        </div>
                      )}
                      {plan.features && (
                        <ul className="space-y-1 mb-4">
                          {plan.features.split("\n").filter(Boolean).map((f) => (
                            <li key={f.trim()} className="flex items-start gap-1.5 text-[10px] font-futura text-gray-600">
                              <svg className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {f.trim()}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-auto">
                        {isFree ? (
                          <div
                            className="w-full py-2 text-xs font-bold font-futura text-center rounded-full border"
                            style={{ color: "#7AA5B5", borderColor: "#8FB7C5" }}
                          >
                            Current Plan
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSubscribe(plan.plan_name)}
                            disabled={subscribing === plan.plan_name}
                            className="w-full py-2 text-xs font-bold font-futura text-white rounded-full shadow-sm disabled:opacity-50 transition-colors hover:opacity-90"
                            style={{ backgroundColor: "#8FB7C5" }}
                          >
                            {subscribing === plan.plan_name ? "Processing..." : "Subscribe"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!billing?.has_billing ? (
            <div className="rounded-2xl border border-[#dcd2c1] bg-white p-8 text-center">
              <p className="text-gray-500 font-futura">
                {billing?.message || "No billing information available yet. Your credits will appear here once your site is set up."}
              </p>
            </div>
          ) : (
            <>
              {/* Credit Overview Card */}
              <div className="rounded-2xl border border-[#dcd2c1] bg-white p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold font-futura text-gray-900">
                    AI Credits
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-futura ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {credit?.status === "active"
                      ? "Active"
                      : credit?.status === "exhausted"
                      ? "Credits Exhausted"
                      : credit?.status === "disabled"
                      ? "Disabled"
                      : "Not Provisioned"}
                  </span>
                </div>

                {/* Usage bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-futura text-gray-500 mb-1.5">
                    <span>
                      ${credit?.usage?.toFixed(2)} used
                    </span>
                    <span>
                      ${credit?.limit?.toFixed(2)} limit
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(credit?.usage_percent || 0, 100)}%`,
                        backgroundColor:
                          (credit?.usage_percent || 0) >= 90
                            ? "#ef4444"
                            : (credit?.usage_percent || 0) >= 70
                            ? "#f59e0b"
                            : "#3b82f6",
                      }}
                    />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] font-futura text-gray-500 mb-0.5">
                      Remaining
                    </div>
                    <div className="text-lg font-bold font-futura text-gray-900">
                      ${credit?.remaining?.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-futura text-gray-500 mb-0.5">
                      Used
                    </div>
                    <div className="text-lg font-bold font-futura text-gray-900">
                      ${credit?.usage?.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-futura text-gray-500 mb-0.5">
                      Usage
                    </div>
                    <div className="text-lg font-bold font-futura text-gray-900">
                      {credit?.usage_percent?.toFixed(0)}%
                    </div>
                  </div>
                </div>

                {credit?.last_synced && (
                  <p className="mt-3 text-[9px] font-futura text-gray-400">
                    Last updated:{" "}
                    {new Date(credit.last_synced).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Exhausted banner */}
              {credit?.status === "exhausted" && (
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-bold font-futura text-red-800">
                        Credits Exhausted
                      </h3>
                      <p className="text-xs font-futura text-red-600 mt-1">
                        Your AI agents have stopped working because credits are
                        used up.{" "}
                        {!hasActiveSub
                          ? "Subscribe to a plan above to add more credits."
                          : "Your next billing cycle will add more credits automatically."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Credit History */}
              <div className="rounded-2xl border border-[#dcd2c1] bg-white p-6 shadow-sm">
                <h2 className="text-sm font-bold font-futura text-gray-900 mb-4">
                  Credit History
                </h2>

                {history.length === 0 ? (
                  <p className="text-xs font-futura text-gray-400 text-center py-8">
                    No credit events yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {history.map((entry) => (
                      <div
                        key={`${entry.timestamp}-${entry.event_type}`}
                        className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              entry.event_type === "exhausted"
                                ? "bg-red-500"
                                : entry.event_type === "top_up" || entry.event_type === "subscription_payment"
                                ? "bg-emerald-500"
                                : entry.event_type === "provision"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <div>
                            <div className="text-xs font-bold font-futura text-gray-800">
                              {EVENT_LABELS[entry.event_type] ||
                                entry.event_type}
                            </div>
                            <div className="text-[9px] font-futura text-gray-400">
                              {new Date(entry.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold font-futura text-gray-700">
                            ${entry.credit_remaining_after?.toFixed(2)}{" "}
                            <span className="text-gray-400 font-normal">
                              remaining
                            </span>
                          </div>
                          {entry.credit_usage_after !==
                            entry.credit_usage_before && (
                            <div className="text-[9px] font-futura text-gray-400">
                              +$
                              {(
                                entry.credit_usage_after -
                                entry.credit_usage_before
                              ).toFixed(2)}{" "}
                              used
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
