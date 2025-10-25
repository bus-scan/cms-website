"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Privilege, PrivilegeStatus as PrivilegeStatusEnum } from "@/lib/types/privilege";
import { privilegeService } from "@/lib/services/privilege-service";
import { SolidButton, LinkButton } from "@/components/common/button";
import { ConfirmModal } from "@/components/common/modal";
import SuccessModal from "@/components/common/modal/SuccessModal";
import PrivilegeStatus from "./PrivilegeStatus";

interface PrivilegeDetailsProps {
  privilegeId: string;
}

export default function PrivilegeDetails({
  privilegeId,
}: PrivilegeDetailsProps) {
  const router = useRouter();
  const [privilege, setPrivilege] = useState<Privilege | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load privilege data
  useEffect(() => {
    const loadPrivilege = async () => {
      try {
        setIsLoading(true);
        const response = await privilegeService.getPrivilege(privilegeId);

        if (response.success && response.data) {
          setPrivilege(response.data);
        }
      } catch (error) {
        console.error("Error loading privilege:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (privilegeId) {
      loadPrivilege();
    }
  }, [privilegeId]);

  // Handle delete
  const handleDelete = async () => {
    try {
      const response = await privilegeService.deletePrivilege(privilegeId);

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        alert(response.error || "เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (error) {
      console.error("Error deleting privilege:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    handleDelete();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/user/privilege");
  };

  if (isLoading) {
    return <div className="text-center text-gray-500 py-8">กำลังโหลด...</div>;
  }

  if (!privilege) {
    return (
      <div className="text-center text-red-500 py-8">ไม่พบข้อมูล Privilege</div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 py-4 px-6">
          รายละเอียด Privilege
        </h2>
      </div>

      <div className="px-6">
        {/* Privilege Information */}
        <div>
          <h3 className="text-blue-600 text-base font-medium mb-2">
            Privilege
          </h3>
          <p className="text-gray-600 text-sm mb-4 border-b border-gray-200 pb-4">
            ข้อมูลรายละเอียด Privilege
          </p>

          <div className="space-y-4">
            {/* Brand */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Brand
              </label>
              <div className="text-gray-900 text-base">BUS</div>
            </div>

            {/* Privilege Name */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                ชื่อ Privilege
              </label>
              <div className="text-gray-900 text-base">{privilege.name}</div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                ประเภท
              </label>
              <div className="text-gray-900 text-base">{privilege.type}</div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Status
              </label>
              <div className="flex items-center">
                <PrivilegeStatus status={privilege.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Description
          </label>
          <div className="text-gray-900 text-base">
            {privilege.description || "-"}
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Condition
          </label>
          {privilege.condition && privilege.condition.length > 0 ? (
            <ol className="list-decimal list-inside space-y-2 text-gray-900 text-base">
              {privilege.condition.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ol>
          ) : (
            <div className="text-gray-900 text-base">-</div>
          )}
        </div>

        {/* Image Display */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            รูปภาพ
          </label>
          <div className="w-full max-w-md aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
            {privilege.imagePublicUrl ? (
              <img
                src={privilege.imagePublicUrl}
                alt={privilege.name}
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

        {/* Action Buttons */}
        <div className="flex justify-end items-center pt-6">
          <div className="flex space-x-3">
            <SolidButton
              onClick={() => setShowDeleteModal(true)}
              variant="danger"
              size="md"
            >
              ลบข้อมูล
            </SolidButton>
            <LinkButton
              href={`/user/privilege/edit/${privilege.id}`}
              variant="primary"
              size="md"
            >
              แก้ไข
            </LinkButton>
          </div>
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
            คุณแน่ใจหรือไม่ที่ต้องการลบ &quot;{privilege.name}&quot;? <br />
            การดำเนินการนี้ไม่สามารถยกเลิกได้
          </p>
        }
        confirmText="ลบ"
        cancelText="ยกเลิก"
        confirmVariant="danger"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="สำเร็จ!"
        message="ลบข้อมูล Privilege สำเร็จแล้ว"
      />
    </div>
  );
}
