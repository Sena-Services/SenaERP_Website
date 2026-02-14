"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { getApiUrl, API_CONFIG, frappeAPI } from "@/lib/config";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  title?: string;
  subtitle?: string;
  accessType?: "product" | "pitchdeck";
}

export default function EarlyAccessModal({ isOpen, onClose, onSuccess, title = "Get Early Access", subtitle = "Join the waitlist and be among the first to experience Sena", accessType = "product" }: EarlyAccessModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [alsoRequest, setAlsoRequest] = useState(accessType === "pitchdeck");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock background scroll while modal is open (Early Access + Pitch Deck)
  // This prevents the outer page from scrolling even if the modal content scrolls.
  useLockBodyScroll(isOpen);

  if (!isOpen || !mounted) return null;

  // Map prop values to backend-expected values
  const accessTypeMap = { product: "Product", pitchdeck: "Pitch Deck" } as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const backendAccessType = accessTypeMap[accessType];
    const otherBackendType = accessType === "product" ? accessTypeMap.pitchdeck : accessTypeMap.product;

    try {
      const response = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.SUBMIT_WAITLIST), {
        method: 'POST',
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          company_name: formData.companyName,
          phone: formData.phone,
          message: formData.message,
          access_type: backendAccessType,
        })
      });

      const result = await response.json();

      if (result.message?.success) {
        // If checkbox is checked, also submit for the other access type
        if (alsoRequest) {
          try {
            await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.SUBMIT_WAITLIST), {
              method: 'POST',
              body: JSON.stringify({
                full_name: formData.name,
                email: formData.email,
                company_name: formData.companyName,
                phone: formData.phone,
                message: formData.message,
                access_type: otherBackendType,
              })
            });
          } catch {
            // Silently ignore — primary submission succeeded
          }
        }

        // Call parent success handler to show toast
        onSuccess(result.message.message || "Successfully added to waitlist!");

        // Reset form and close modal
        setFormData({ name: "", companyName: "", email: "", phone: "", message: "" });
        setAlsoRequest(accessType === "pitchdeck");
        onClose();
      } else {
        setError(result.message?.message || result.message?.error || "Failed to submit. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting waitlist:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md -z-10" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl sm:rounded-[32px] shadow-2xl max-w-4xl w-full z-10 max-h-[92dvh] flex flex-col overflow-y-auto overscroll-contain touch-pan-y"
        onClick={handleModalClick}
      >
        <div className="grid lg:grid-cols-2 gap-0 flex-1 min-h-0">
          {/* Left side - Image */}
          <div className="relative hidden lg:block bg-gradient-to-br from-[#EBE5D9] to-[#f5f2e9] h-full min-h-0">
            <Image
              src="/screenshots/early-access.png"
              alt="Early Access"
              fill
              sizes="(max-width: 1024px) 0vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Right side - Form */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-3 sm:mb-5 pr-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 font-futura mb-1.5">
                {title}
              </h2>
              <p className="text-[11px] sm:text-sm text-gray-600 font-space-grotesk leading-snug">
                {subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 font-space-grotesk">{error}</p>
                </div>
              )}

              {/* First row: Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1 font-space-grotesk"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-waygent-orange focus:border-transparent transition-all outline-none font-space-grotesk"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1 font-space-grotesk"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-waygent-orange focus:border-transparent transition-all outline-none font-space-grotesk"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Second row: Company + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {/* Company Name */}
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1 font-space-grotesk"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-waygent-orange focus:border-transparent transition-all outline-none font-space-grotesk"
                    placeholder="Acme Inc."
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1 font-space-grotesk"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-waygent-orange focus:border-transparent transition-all outline-none font-space-grotesk"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1 font-space-grotesk"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-waygent-orange focus:border-transparent transition-all outline-none font-space-grotesk resize-none"
                  placeholder="Tell us a bit about yourself"
                />
              </div>

              {/* Cross-request checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={alsoRequest}
                  onChange={(e) => setAlsoRequest(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-waygent-orange focus:ring-waygent-orange cursor-pointer accent-[#b8860b]"
                />
                <span className="text-[11px] sm:text-sm text-gray-600 font-space-grotesk">
                  {accessType === "product"
                    ? "I'm also interested in the pitch deck"
                    : "Also join the product early access waitlist"}
                </span>
              </label>

              {/* Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all font-space-grotesk items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base bg-waygent-orange border-2 border-waygent-orange text-black font-semibold rounded-lg hover:bg-waygent-orange/90 transition-all font-space-grotesk cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
