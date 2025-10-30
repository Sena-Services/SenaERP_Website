"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, getUserInitials, logout } from "@/lib/auth";
import { ChevronDown, LogOut, User as UserIcon, Database } from "lucide-react";

interface UserAvatarProps {
  user: User;
  onLogout?: () => void;
}

export default function UserAvatar({ user, onLogout }: UserAvatarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOnEnvironmentSelector = pathname === "/environment-selector";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setIsOpen(false);
      if (onLogout) {
        onLogout();
      } else {
        // Reload the page to update auth state
        window.location.href = "/";
      }
    }
  };

  const initials = getUserInitials(user);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button - Circular with Initials Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 bg-white/70 border border-gray-200 hover:bg-white/90 hover:shadow-sm hover:border-gray-300 outline-none focus-visible:outline-none cursor-pointer font-space-grotesk"
        style={{
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Avatar Initials */}
        <span className="text-sm font-bold text-waygent-orange">
          {initials}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg border py-1 z-50 font-space-grotesk" style={{ backgroundColor: '#FAF9F5', borderColor: '#E5E7EB' }}>
          {/* User Info Section */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #EEF2FF' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <span className="text-2xl font-bold text-waygent-orange">
                  {initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#374151' }}>
                  {user.full_name || user.email}
                </p>
                <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Menu Item (Placeholder) */}
          <button
            className="w-full px-4 py-2 text-left text-sm font-medium flex items-center gap-2 transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: '#6B7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EEF2FF';
              e.currentTarget.style.color = '#F59E0B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6B7280';
            }}
            onClick={() => {
              // Placeholder for profile action
              console.log("Profile clicked");
            }}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

          {/* Environment Selector Menu Item - Only show if not already on that page */}
          {!isOnEnvironmentSelector && (
            <button
              className="w-full px-4 py-2 text-left text-sm font-medium flex items-center gap-2 transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: '#6B7280'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EEF2FF';
                e.currentTarget.style.color = '#F59E0B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6B7280';
              }}
              onClick={() => {
                setIsOpen(false);
                router.push("/environment-selector");
              }}
            >
              <Database className="w-4 h-4" />
              <span>ERP Environment</span>
            </button>
          )}

          {/* Logout Menu Item */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm font-medium flex items-center gap-2 transition-colors"
            style={{
              backgroundColor: 'transparent',
              borderTop: '1px solid #EEF2FF',
              color: '#6B7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EEF2FF';
              e.currentTarget.style.color = '#F59E0B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6B7280';
            }}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
