"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { getApiUrl, API_CONFIG, frappeAPI } from "@/lib/config";

// Extend window type for cleanup function
declare global {
  interface Window {
    __modalScrollCleanup?: () => void;
  }
}

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

  // Debug: Log when isOpen changes
  useEffect(() => {
    console.log('🔍 EarlyAccessModal - isOpen changed:', isOpen);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      console.log('🔒 Attempting to lock body scroll');

      // Use a small delay to ensure modal is rendered first
      const timer = setTimeout(() => {
        console.log('🔒 Locking body scroll now');
        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        const originalTouchAction = document.body.style.touchAction;

        // Prevent scrollbar layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.touchAction = 'none'; // Prevent touch scrolling on mobile

        // Store cleanup function
        window.__modalScrollCleanup = () => {
          console.log('🔓 Unlocking body scroll');
          document.body.style.overflow = originalOverflow;
          document.body.style.paddingRight = originalPaddingRight;
          document.body.style.touchAction = originalTouchAction;
        };
      }, 50); // Small delay to let modal render

      return () => {
        clearTimeout(timer);
        if (window.__modalScrollCleanup) {
          window.__modalScrollCleanup();
          delete window.__modalScrollCleanup;
        }
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.SUBMIT_WAITLIST), {
        method: 'POST',
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    console.log('🖱️ Backdrop clicked - target:', e.target);
    console.log('🖱️ Backdrop clicked - currentTarget:', e.currentTarget);
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    console.log('🖱️ Modal clicked - stopping propagation');
    e.stopPropagation();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto touch-pan-y overscroll-contain"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md -z-10" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl sm:rounded-[32px] shadow-2xl max-w-4xl w-full overflow-hidden my-auto z-10 max-h-[90vh] sm:max-h-[85vh] flex flex-col"
        onClick={handleModalClick}
      >
        <div className="grid md:grid-cols-2 gap-0 overflow-y-auto touch-pan-y overscroll-contain">
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
          <div className="p-5 sm:p-8 md:p-10 overflow-y-auto">
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
  );

  return createPortal(modalContent, document.body);
}
