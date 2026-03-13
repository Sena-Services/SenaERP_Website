"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import type { PlatformUser } from "@/lib/auth";

type NavProfileDropdownProps = {
  platformUser: PlatformUser;
  showProfileMenu: boolean;
  goingToSite: boolean;
  onToggleMenu: (open: boolean, pos: { top: number; left: number }) => void;
  onGoToSite: () => void;
  onLogout: () => void;
  dropdownPos: { top: number; left: number };
};

export default function NavProfileDropdown({
  platformUser,
  showProfileMenu,
  goingToSite,
  onToggleMenu,
  onGoToSite,
  onLogout,
  dropdownPos,
}: NavProfileDropdownProps) {
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showProfileMenu && profileBtnRef.current) {
      const rect = profileBtnRef.current.getBoundingClientRect();
      onToggleMenu(true, { top: rect.bottom + 8, left: rect.left });
    } else {
      onToggleMenu(!showProfileMenu, dropdownPos);
    }
  };

  return (
    <>
      <button
        ref={profileBtnRef}
        onClick={handleButtonClick}
        className="inline-flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#8FB7C5]"
        style={{
          background: showProfileMenu ? '#E8E2D6' : 'transparent',
          border: '1px solid #D1D5DB',
        }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: '#8FB7C5' }}
        >
          {(platformUser.full_name || platformUser.email || '').substring(0, 2).toUpperCase()}
        </div>
        <span className="hidden sm:block text-sm font-semibold text-gray-700 font-space-grotesk max-w-[120px] truncate">
          {platformUser.full_name || platformUser.email}
        </span>
        <svg className="w-3.5 h-3.5 text-gray-500 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showProfileMenu && typeof document !== "undefined" && createPortal(
        <div
          className="fixed w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
          style={{ top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 font-space-grotesk truncate">
              {platformUser.full_name}
            </p>
            <p className="text-xs text-gray-500 font-space-grotesk truncate">
              {platformUser.email}
            </p>
          </div>
          {platformUser.site_url ? (
            <button
              onClick={onGoToSite}
              disabled={goingToSite}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-space-grotesk cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              {goingToSite ? "Redirecting..." : "Go to Workspace"}
            </button>
          ) : (
            <div className="px-4 py-2.5 text-xs text-gray-400 font-space-grotesk">
              Workspace is being set up...
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-space-grotesk cursor-pointer flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
