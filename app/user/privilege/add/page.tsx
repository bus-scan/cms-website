"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PrivilegeForm from "@/components/privilege/PrivilegeForm";
import { privilegeService } from "@/lib/services/privilege-service";
import { PrivilegeFormData } from "@/lib/types/privilege";
import SuccessModal from "@/components/common/modal/SuccessModal";
import { PageTitle } from "@/components/common/text";

export default function AddPrivilegePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (data: PrivilegeFormData) => {
    setIsLoading(true);

    try {
      const response = await privilegeService.createPrivilege({
        bandId: data.bandId,
        name: data.name,
        description: data.description,
        condition: data.condition,
        type: data.type,
        imageId: data.imageId,
        status: data.status,
      });

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        alert(response.error || "เกิดข้อผิดพลาดในการสร้าง Privilege");
      }
    } catch (error) {
      console.error("Error creating privilege:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง Privilege");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/user/privilege");
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/user/privilege");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <PageTitle>Add Privilege</PageTitle>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <PrivilegeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitButtonText="Confirm"
          cancelButtonText="Cancel"
        />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="สำเร็จ!"
        message="สร้าง Privilege ใหม่สำเร็จแล้ว"
      />
    </div>
  );
}

