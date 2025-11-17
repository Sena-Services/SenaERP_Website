"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { getApiUrl, API_CONFIG } from "@/lib/config";

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function EarlyAccessModal({ isOpen, onClose, onSuccess }: EarlyAccessModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SUBMIT_WAITLIST), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          company_name: formData.companyName,
          phone: formData.phone,
        })
      });

      const result = await response.json();

      if (result.message?.success) {
        // Call parent success handler to show toast
        onSuccess(result.message.message || "Successfully added to waitlist!");

        // Reset form and close modal
        setFormData({ name: "", companyName: "", email: "", phone: "" });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Centering container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal */}
        <div className="relative bg-white rounded-2xl sm:rounded-[32px] shadow-2xl max-w-4xl w-full overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left side - Image */}
          <div className="relative hidden md:block bg-gradient-to-br from-[#EBE5D9] to-[#f5f2e9] min-h-[500px]">
            <Image
              src="/earlyaccess.png"
              alt="Early Access"
              fill
              sizes="(max-width: 768px) 0vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Right side - Form */}
          <div className="p-5 sm:p-8 md:p-10">
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
            <div className="mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-futura mb-2">
                Get Early Access
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-space-grotesk">
                Join the waitlist and be among the first to experience Sena
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 font-space-grotesk">{error}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 font-space-grotesk"
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
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-waygent-orange focus:border-transparent transition-all outline-none font-space-grotesk"
                  placeholder="John Doe"
                />
              </div>

              {/* Company Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 font-space-grotesk"
                >
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-waygent-orange focus:border-transparent transition-all outline-none font-space-grotesk"
                  placeholder="Acme Inc."
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 font-space-grotesk"
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
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-waygent-orange focus:border-transparent transition-all outline-none font-space-grotesk"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 font-space-grotesk"
                >
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-waygent-orange focus:border-transparent transition-all outline-none font-space-grotesk"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="hidden sm:flex flex-1 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all font-space-grotesk items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-waygent-orange border-2 border-waygent-orange text-black font-semibold rounded-lg hover:bg-waygent-orange/90 transition-all font-space-grotesk cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
