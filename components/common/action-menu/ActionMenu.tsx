"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  itemId: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export default function ActionMenu({
  items,
  itemId,
  className = "",
  buttonClassName = "text-gray-400 hover:text-gray-600",
  menuClassName = "",
  position = "bottom-right",
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right?: number;
    left?: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        setIsOpen(false);
        setMenuPosition(null);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
        setMenuPosition(null);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isOpen) {
      setIsOpen(false);
      setMenuPosition(null);
    } else {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let top = 0;
        let right: number | undefined;
        let left: number | undefined;

        // Calculate position based on the position prop
        switch (position) {
          case "bottom-right":
            top = rect.bottom + scrollY + 8;
            right = windowWidth - rect.right - scrollX;
            break;
          case "bottom-left":
            top = rect.bottom + scrollY + 8;
            left = rect.left + scrollX;
            break;
          case "top-right":
            top = rect.top + scrollY - 8;
            right = windowWidth - rect.right - scrollX;
            break;
          case "top-left":
            top = rect.top + scrollY - 8;
            left = rect.left + scrollX;
            break;
        }

        // Adjust position if menu would go off screen
        const menuHeight = items.length * 48 + 16; // Approximate menu height
        const menuWidth = 192; // w-48 = 192px

        if (position.includes("bottom") && top + menuHeight > windowHeight + scrollY) {
          // Switch to top if bottom would overflow
          top = rect.top + scrollY - menuHeight - 8;
        } else if (position.includes("top") && top - menuHeight < scrollY) {
          // Switch to bottom if top would overflow
          top = rect.bottom + scrollY + 8;
        }

        if (position.includes("right") && right && right + menuWidth > windowWidth) {
          // Switch to left if right would overflow
          right = undefined;
          left = windowWidth - rect.right - scrollX - menuWidth;
        } else if (position.includes("left") && left && left + menuWidth > windowWidth) {
          // Switch to right if left would overflow
          left = undefined;
          right = windowWidth - rect.right - scrollX;
        }

        setMenuPosition({ top, right, left });
        setIsOpen(true);
      }
    }
  };

  const handleItemClick = (item: ActionMenuItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
      setMenuPosition(null);
    }
  };

  return (
    <div className={`relative flex justify-center items-center ${className}`}>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className={buttonClassName}
        aria-label="Open action menu"
      >
        <HiEllipsisVertical className="h-5 w-5" />
      </button>

      {/* Action Menu Popup */}
      {isOpen && menuPosition && (
        <div
          className={`fixed z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200 ${menuClassName}`}
          style={{
            top: `${menuPosition.top}px`,
            right: menuPosition.right ? `${menuPosition.right}px` : undefined,
            left: menuPosition.left ? `${menuPosition.left}px` : undefined,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-2">
            {items.map((item) => {
              if (item.href && !item.disabled) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center w-full px-4 py-3 text-sm transition-colors ${
                      item.className || "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      setMenuPosition(null);
                    }}
                  >
                    {item.icon && <span className="mr-3 h-4 w-4">{item.icon}</span>}
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={`flex items-center w-full px-4 py-3 text-sm transition-colors ${
                    item.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : item.className || "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon && <span className="mr-3 h-4 w-4">{item.icon}</span>}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
