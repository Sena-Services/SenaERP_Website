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
        className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 outline-none focus-visible:outline-none cursor-pointer font-space-grotesk"
        style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.25)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.25)';
        }}
      >
        {/* Avatar Initials */}
        <span className="text-sm font-bold text-gray-800">
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
                <span className="text-2xl font-bold text-gray-800">
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
          <div className="px-2 py-1">
            <button
              className="w-full text-left transition-all duration-300"
              style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '12px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.25)';
              }}
              onClick={() => {
                // Placeholder for profile action
              }}
            >
              <div className="flex items-center gap-3">
                <UserIcon className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span className="text-sm font-medium" style={{ color: '#374151' }}>Profile Settings</span>
              </div>
            </button>
          </div>

          {/* Environment Selector Menu Item - Only show if not already on that page */}
          {!isOnEnvironmentSelector && (
            <div className="px-2 py-1">
              <button
                className="w-full text-left transition-all duration-300"
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.25)';
                }}
                onClick={() => {
                  setIsOpen(false);
                  router.push("/environment-selector");
                }}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span className="text-sm font-medium" style={{ color: '#374151' }}>ERP Environment</span>
                </div>
              </button>
            </div>
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
              e.currentTarget.style.backgroundColor = '#F3F4F6';
              e.currentTarget.style.color = '#1F2937';
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
