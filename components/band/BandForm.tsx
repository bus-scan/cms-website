"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextInput from "@/components/common/input/TextInput";
import { SolidButton } from "@/components/common/button";
import { ImageUpload } from "@/components/common/uploader";
import Toggle from "@/components/common/toggle/Toggle";
import { BandFormData, FileUploadResponse } from "@/lib/types/band";
import { bandService } from "@/lib/services/band-service";
import { fileService } from "@/lib/services/file-service";

// Validation schema
const bandFormSchema = z.object({
  bandName: z
    .string()
    .min(1, "กรุณากรอกชื่อ Band")
    .max(255, "ชื่อ Band ต้องไม่เกิน 255 ตัวอักษร"),
  imageFile: z
    .any()
    .refine((file) => file instanceof File || file === null, {
      message: "กรุณาอัปโหลดรูปภาพ",
    }),
  isActive: z.boolean(),
});

type BandFormProps = {
  initialData?: Partial<BandFormData>;
  onSubmit: (data: BandFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
};

export default function BandForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = "บันทึก",
  cancelButtonText = "ยกเลิก",
}: BandFormProps) {
  const [nameChecking, setNameChecking] = useState(false);
  const [nameExists, setNameExists] = useState<boolean | null>(null);
  const [nameCheckError, setNameCheckError] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(bandFormSchema),
    mode: "onChange",
    defaultValues: {
      bandName: initialData?.bandName || "",
      imageFile: null as File | null,
      isActive: initialData?.isActive ?? true,
    },
  });

  const watchedImageFile = watch("imageFile");
  const watchedIsActive = watch("isActive");
  const watchedBandName = watch("bandName");

  // Debounced name checking function
  const checkNameExists = useCallback(async (name: string) => {
    if (!name || name.trim().length === 0) {
      setNameExists(null);
      setNameCheckError(null);
      clearErrors("bandName");
      return;
    }

    // Skip check if it's the initial data (for edit mode)
    if (initialData?.bandName && name === initialData.bandName) {
      setNameExists(false);
      setNameCheckError(null);
      clearErrors("bandName");
      return;
    }

    setNameChecking(true);
    setNameCheckError(null);

    try {
      const result = await bandService.checkNameExists(name.trim());
      
      if (result.success && result.data) {
        if (result.data.exists) {
          setNameExists(true);
          setError("bandName", {
            type: "manual",
            message: "ชื่อ Band นี้มีอยู่แล้ว กรุณาใช้ชื่ออื่น",
          });
        } else {
          setNameExists(false);
          clearErrors("bandName");
        }
      } else {
        setNameCheckError(result.error || "เกิดข้อผิดพลาดในการตรวจสอบชื่อ");
      }
    } catch (error) {
      console.error("Error checking band name:", error);
      setNameCheckError("เกิดข้อผิดพลาดในการตรวจสอบชื่อ");
    } finally {
      setNameChecking(false);
    }
  }, [initialData?.bandName, setError, clearErrors]);

  // Debounce effect for name checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkNameExists(watchedBandName);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [watchedBandName, checkNameExists]);

  const handleFormSubmit = async (data: any) => {
    let imageId = initialData?.imageId || "";
    let imagePublicUrl = initialData?.imagePublicUrl;

    // Upload file if a new file is selected
    if (data.imageFile && data.imageFile instanceof File) {
      setIsUploadingFile(true);
      try {
        const uploadResult = await fileService.uploadFile(data.imageFile);
        
        if (uploadResult.success && uploadResult.data) {
          imageId = uploadResult.data.id;
          imagePublicUrl = uploadResult.data.filePath;
        } else {
          throw new Error(uploadResult.error || 'File upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
        setIsUploadingFile(false);
        return;
      } finally {
        setIsUploadingFile(false);
      }
    }

    // Convert form data to BandFormData format
    const bandData: BandFormData = {
      bandName: data.bandName,
      imageId,
      imagePublicUrl,
      isActive: data.isActive,
    };
    
    await onSubmit(bandData);
  };

  const handleImageChange = (file: File | null) => {
    setValue("imageFile", file, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Band Name */}
      <div>
        <TextInput
          {...register("bandName")}
          label="ชื่อ Band"
          placeholder="กรอกชื่อ Band"
          error={errors.bandName?.message || nameCheckError || undefined}
          icon={
            nameChecking ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : nameExists === true ? (
              <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : nameExists === false && watchedBandName.trim().length > 0 ? (
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : null
          }
          iconPosition="right"
        />
      </div>

      {/* Image Upload */}
      <ImageUpload
        value={watchedImageFile}
        onChange={handleImageChange}
        error={errors.imageFile?.message as string}
        imagePublicUrl={initialData?.imagePublicUrl}
      />

      {/* Status Toggle */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Status
        </label>
        <div className="flex items-center">
          <Toggle
            checked={watchedIsActive}
            onChange={(checked) => setValue("isActive", checked, { shouldValidate: true })}
            size="md"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6">
        <SolidButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelButtonText}
        </SolidButton>
        <SolidButton
          type="submit"
          variant="dark"
          isLoading={isLoading || isUploadingFile}
          loadingText={isUploadingFile ? "กำลังอัปโหลด..." : "กำลังบันทึก..."}
          disabled={!isValid || isLoading || isUploadingFile || nameExists === true || nameChecking}
        >
          {submitButtonText}
        </SolidButton>
      </div>
    </form>
  );
}
