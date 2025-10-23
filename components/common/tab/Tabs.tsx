"use client";

import React from "react";

export interface TabOption<T extends string = string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string = string> {
  activeTab: T;
  onTabChange: (tab: T) => void;
  tabs: TabOption<T>[];
  children?: Record<T, React.ReactNode>;
}

export default function Tabs<T extends string = string>({
  activeTab,
  onTabChange,
  tabs,
  children,
}: TabsProps<T>) {
  return (
    <>
      <div className="flex space-x-1 bg-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`px-6 py-4 text-sm font-medium cursor-pointer transition-colors ${
              activeTab === tab.value
                ? "text-black bg-white shadow-[15px_0_15px_-15px_rgba(0,0,0,0.1),-15px_0_15px_-15px_rgba(0,0,0,0.1)]"
                : "text-gray-500 hover:text-gray-900 "
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children && activeTab in children && children[activeTab]}
    </>
  );
}
