"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BandForm from "@/components/band/BandForm";
import { bandService } from "@/lib/services/band-service";
import { BandFormData } from "@/lib/types/band";
import SuccessModal from "@/components/common/modal/SuccessModal";
import { PageTitle } from "@/components/common/text";

export default function AddBandPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (data: BandFormData) => {
    setIsLoading(true);

    try {
      const response = await bandService.createBand({
        bandName: data.bandName,
        imageId: data.imageId,
        isActive: data.isActive,
      });

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        alert(response.error || "เกิดข้อผิดพลาดในการสร้าง Band");
      }
    } catch (error) {
      console.error("Error creating band:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง Band");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/user/band");
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/user/band");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <PageTitle>Add Band</PageTitle>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <BandForm
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
        message="สร้าง Band ใหม่สำเร็จแล้ว"
      />
    </div>
  );
}
