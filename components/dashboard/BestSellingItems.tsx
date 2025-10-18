"use client";

import { bestSellingItems } from "@/lib/data/mock-data";

export default function BestSellingItems() {
  return (
    <div className="lg:w-fit border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        รายการสินค้าขายดี
      </h2>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รายการสินค้า</th>
              <th>จำนวน (ชิ้น)</th>
            </tr>
          </thead>
          <tbody>
            {bestSellingItems.map((item) => (
              <tr key={item.rank}>
                <td className="text-center lg:w-fit">{item.rank}</td>
                <td>
                  <div>
                    <div className="lg:max-w-40">{item.name}</div>
                    <div className="lg:max-w-40 text-cyan-700">
                      {item.brand}
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  {item.quantity.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
