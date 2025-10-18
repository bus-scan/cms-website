"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { monthlySalesData, timePeriods } from "@/lib/data/mock-data";
import DateFilter from "./DateFilter";

export default function ChartSection() {
  const [activePeriod, setActivePeriod] = useState("12months");

  return (
    <div className="flex-1">
      {/* Title and Date Filter */}
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          ยอดสั่งซื้อทั้งหมด
        </h2>
        <DateFilter />
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        {/* Time Period Tabs */}
        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          {timePeriods.map((period) => (
            <button
              key={period.value}
              onClick={() => setActivePeriod(period.value)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activePeriod === period.value
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlySalesData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis
                stroke="#666"
                fontSize={12}
                domain={[0, 120]}
                ticks={[0, 20, 40, 60, 80, 100, 120]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorGradient)"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
