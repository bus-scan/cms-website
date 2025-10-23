"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PrivilegeForm from "@/components/privilege/PrivilegeForm";
import { privilegeService } from "@/lib/services/privilege-service";
import { Privilege, PrivilegeFormData } from "@/lib/types/privilege";
import SuccessModal from "@/components/common/modal/SuccessModal";
import ErrorAlert from "@/components/common/alert/ErrorAlert";
import { PageTitle } from "@/components/common/text";

export default function EditPrivilegePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [privilege, setPrivilege] = useState<Privilege | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrivilege, setIsLoadingPrivilege] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load privilege data
  useEffect(() => {
    const loadPrivilege = async () => {
      try {
        setIsLoadingPrivilege(true);
        const response = await privilegeService.getPrivilege(id);

        if (response.success && response.data) {
          setPrivilege(response.data);
        } else {
          setErrorMessage(response.error || "ไม่พบข้อมูล Privilege");
          setShowError(true);
        }
      } catch (error) {
        console.error("Error loading privilege:", error);
        setErrorMessage("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setShowError(true);
      } finally {
        setIsLoadingPrivilege(false);
      }
    };

    if (id) {
      loadPrivilege();
    }
  }, [id]);

  const handleSubmit = async (data: PrivilegeFormData) => {
    setIsLoading(true);

    try {
      const response = await privilegeService.updatePrivilege(id, {
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
        alert(response.error || "เกิดข้อผิดพลาดในการอัปเดต Privilege");
      }
    } catch (error) {
      console.error("Error updating privilege:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดต Privilege");
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

  if (isLoadingPrivilege) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-gray-500">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  if (!privilege) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-500">ไม่พบข้อมูล Privilege</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <PageTitle>Edit Privilege</PageTitle>
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
        <PrivilegeForm
          initialData={{
            bandId: privilege.bandId,
            name: privilege.name,
            description: privilege.description,
            condition: privilege.condition,
            type: privilege.type,
            imageId: privilege.imageId,
            imagePublicUrl: privilege.imagePublicUrl,
            status: privilege.status,
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
        message="อัปเดตข้อมูล Privilege สำเร็จแล้ว"
      />
    </div>
  );
}

