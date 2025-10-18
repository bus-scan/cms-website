"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FiBarChart,
  FiStar,
  FiHeart,
  FiCalendar,
  FiList,
  FiShoppingBag,
  FiUsers,
  FiClock,
  FiX,
} from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    name: "Dashboard",
    href: "/user/dashboard",
    icon: FiBarChart,
    isHeader: true,
  },
  {
    name: "Brand",
    href: "/user/brand",
    icon: FiStar,
  },
  {
    name: "Privilege",
    href: "/user/privilege",
    icon: FiHeart,
  },
  {
    name: "Event",
    href: "/user/event",
    icon: FiCalendar,
  },
  {
    name: "Member List",
    href: "/user/member-list",
    icon: FiList,
  },
  {
    name: "รับของ (Ketchup)",
    href: "/user/receive-items",
    icon: FiShoppingBag,
    hasSeparator: true,
  },
  {
    name: "Staff Management",
    href: "/user/staff-management",
    icon: FiUsers,
  },
  {
    name: "History Log",
    href: "/user/history-log",
    icon: FiClock,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 min-h-screen bg-white">
        <div className="p-6">
          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-sky-950 text-white"
                        : "bg-white text-sky-950 hover:bg-blue-100"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                  {item.hasSeparator && (
                    <div className="my-2 border-t border-gray-300"></div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <FiX className="size-6 text-gray-600" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-900 text-white"
                        : "bg-white text-blue-900 hover:bg-blue-100"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                  {item.hasSeparator && (
                    <div className="my-2 border-t border-gray-300"></div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
