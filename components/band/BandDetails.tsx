"use client";

import React, { useState } from "react";
import { Band } from "@/lib/types/band";
import { SolidButton, LinkButton } from "@/components/common/button";
import { ConfirmModal } from "@/components/common/modal";
import { HiArrowLeft } from "react-icons/hi2";

interface BandDetailsProps {
  band: Band;
  onDelete: () => void;
}

export default function BandDetails({ band, onDelete }: BandDetailsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH");
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  return (
    <div className="space-y-6">
      {/* Band Name */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          ชื่อ Band
        </label>
        <div className="text-gray-900 text-base">{band.bandName}</div>
      </div>

      {/* Image Display */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          รูปภาพ
        </label>
        <div className="w-full max-w-md aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
          {band.imagePublicUrl ? (
            <img
              src={band.imagePublicUrl}
              alt={band.bandName}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📷</div>
              <div className="text-sm opacity-75">ไม่มีรูปภาพ</div>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Status
        </label>
        <div className="flex items-center">
          <span
            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              band.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {band.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Created Date
          </label>
          <div className="text-gray-900 text-sm">
            {formatDate(band.createdAt)}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Updated Date
          </label>
          <div className="text-gray-900 text-sm">
            {formatDate(band.updatedAt)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <LinkButton href="/user/band" variant="ghost" size="md">
          <HiArrowLeft className="h-4 w-4 mr-2" />
          กลับ
        </LinkButton>
        <div className="flex space-x-3">
          <SolidButton
            onClick={() => setShowDeleteModal(true)}
            variant="danger"
            size="md"
          >
            ลบข้อมูล
          </SolidButton>
          <LinkButton
            href={`/user/band/edit/${band.id}`}
            variant="primary"
            size="md"
          >
            แก้ไขข้อมูล
          </LinkButton>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="ยืนยันการลบ"
        message={
          <p>
            คุณแน่ใจหรือไม่ที่ต้องการลบ "{band.bandName}"? <br />
            การดำเนินการนี้ไม่สามารถยกเลิกได้
          </p>
        }
        confirmText="ลบ"
        cancelText="ยกเลิก"
        confirmVariant="danger"
      />
    </div>
  );
}
