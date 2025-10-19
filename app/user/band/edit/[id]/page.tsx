"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BandForm from "@/components/band/BandForm";
import { bandService } from "@/lib/services/band-service";
import { Band, BandFormData } from "@/lib/types/band";
import SuccessModal from "@/components/common/modal/SuccessModal";
import ErrorAlert from "@/components/common/alert/ErrorAlert";
import { PageTitle } from "@/components/common/text";

export default function EditBandPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [band, setBand] = useState<Band | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBand, setIsLoadingBand] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load band data
  useEffect(() => {
    const loadBand = async () => {
      try {
        setIsLoadingBand(true);
        const response = await bandService.getBand(id);

        if (response.success && response.data) {
          setBand(response.data);
        } else {
          setErrorMessage(response.error || "ไม่พบข้อมูล Band");
          setShowError(true);
        }
      } catch (error) {
        console.error("Error loading band:", error);
        setErrorMessage("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setShowError(true);
      } finally {
        setIsLoadingBand(false);
      }
    };

    if (id) {
      loadBand();
    }
  }, [id]);

  const handleSubmit = async (data: BandFormData) => {
    setIsLoading(true);

    try {
      const response = await bandService.updateBand(id, {
        bandName: data.bandName,
        imageId: data.imageId,
        isActive: data.isActive,
      });

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        alert(response.error || "เกิดข้อผิดพลาดในการอัปเดต Band");
      }
    } catch (error) {
      console.error("Error updating band:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดต Band");
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

  if (isLoadingBand) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-gray-500">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  if (!band) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-500">ไม่พบข้อมูล Band</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <PageTitle>Edit Band</PageTitle>
      </div>

      {/* Error Alert */}
      {showError && (
        <ErrorAlert
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <BandForm
          initialData={{
            bandName: band.bandName,
            imageId: band.imageId,
            imagePublicUrl: band.imagePublicUrl,
            isActive: band.isActive,
          }}
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
        message="อัปเดตข้อมูล Band สำเร็จแล้ว"
      />
    </div>
  );
}
