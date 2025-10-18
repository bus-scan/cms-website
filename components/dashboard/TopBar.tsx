"use client";

import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import Image from "next/image";
import { FiSettings, FiPlus, FiUser, FiMenu } from "react-icons/fi";

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { user } = useAuthStore();

  return (
    <header className="bg-white text-white">
      <div className="flex items-center justify-between px-4 md:px-6 py-2">
        {/* Mobile Menu Button and Logo */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button - Only visible on mobile/tablet */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <FiMenu className="size-6 text-gray-600" />
          </button>
          
          <Link href="/user/dashboard" className="flex items-center space-x-3">
            <Image
              src="/dashboard_logo.png"
              alt="Dashboard Logo"
              width={100}
              height={53}
              className="rounded"
            />
          </Link>
        </div>

        {/* User Profile and Actions */}
        <div className="flex items-center space-x-2 bg-blue-500/20 rounded-3xl px-2 py-1">
          {/* User Avatar */}
          <Link
            href="/user/profile"
            className="w-8 h-8 rounded-full overflow-hidden"
          >
            <Image
              src="/avatar_default.png"
              alt="User Avatar"
              width={28}
              height={28}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Settings Icon */}
          <Link
            href="/user/setting"
            className="text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
          >
            <FiSettings className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
