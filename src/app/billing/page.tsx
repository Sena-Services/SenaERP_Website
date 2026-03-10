"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { getPlatformToken } from "@/lib/auth";
import { getApiUrl, API_CONFIG, frappeAPI } from "@/lib/config";

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

const EVENT_LABELS: Record<string, string> = {
  provision: "Credits Provisioned",
  sync: "Usage Updated",
  top_up: "Credits Added",
  exhausted: "Credits Exhausted",
  alert_sent: "Low Credit Alert",
  key_disabled: "Key Disabled",
  key_enabled: "Key Re-enabled",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  exhausted: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  disabled: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  not_provisioned: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
};

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billing, setBilling] = useState<BillingData | null>(null);

  const fetchBilling = useCallback(async () => {
    const token = getPlatformToken();
    if (!token) {
      router.push("/login");
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
      } else {
        setError("Failed to load billing information.");
      }
    } catch {
      setError("Could not connect to billing service.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

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
        // Re-fetch the full billing data
        await fetchBilling();
      }
    } catch {
      // Silently fail
    } finally {
      setRefreshing(false);
    }
  };

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

  if (error) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen bg-[#faf8f3] pt-28 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-red-600 font-futura">{error}</p>
          </div>
        </main>
      </>
    );
  }

  const credit = billing?.credit;
  const history = billing?.history || [];
  const statusStyle = STATUS_COLORS[credit?.status || "active"];

  return (
    <>
      <NavBar />
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
                        used up. Contact us to add more credits and resume
                        service.
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
                    {history.map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              entry.event_type === "exhausted"
                                ? "bg-red-500"
                                : entry.event_type === "top_up"
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
