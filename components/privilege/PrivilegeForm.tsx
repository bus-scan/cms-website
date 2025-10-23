"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextInput from "@/components/common/input/TextInput";
import { SolidButton } from "@/components/common/button";
import { ImageUpload } from "@/components/common/uploader";
import { Select } from "@/components/common/select";
import Toggle from "@/components/common/toggle/Toggle";
import { PrivilegeFormData, PrivilegeType, PrivilegeStatus } from "@/lib/types/privilege";
import { privilegeService } from "@/lib/services/privilege-service";
import { bandService } from "@/lib/services/band-service";
import { fileService } from "@/lib/services/file-service";
import { Band } from "@/lib/types/band";

// Validation schema
const privilegeFormSchema = z.object({
  bandId: z
    .string()
    .min(1, "กรุณาเลือก Brand"),
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อ Privilege")
    .max(255, "ชื่อ Privilege ต้องไม่เกิน 255 ตัวอักษร"),
  description: z
    .string()
    .max(1000, "Description ต้องไม่เกิน 1000 ตัวอักษร"),
  condition: z
    .string()
    .max(2000, "Condition ต้องไม่เกิน 2000 ตัวอักษร")
    .optional(),
  type: z.nativeEnum(PrivilegeType, {
    errorMap: () => ({ message: "กรุณาเลือกประเภท" }),
  }),
  imageFile: z
    .any()
    .refine((file) => file instanceof File || file === null, {
      message: "กรุณาอัปโหลดรูปภาพ",
    }),
  status: z.nativeEnum(PrivilegeStatus, {
    errorMap: () => ({ message: "กรุณาเลือกสถานะ" }),
  }),
});

type PrivilegeFormProps = {
  initialData?: Partial<PrivilegeFormData>;
  onSubmit: (data: PrivilegeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
};

export default function PrivilegeForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = "บันทึก",
  cancelButtonText = "ยกเลิก",
}: PrivilegeFormProps) {
  const [nameChecking, setNameChecking] = useState(false);
  const [nameExists, setNameExists] = useState<boolean | null>(null);
  const [nameCheckError, setNameCheckError] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [bands, setBands] = useState<Band[]>([]);
  const [loadingBands, setLoadingBands] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(privilegeFormSchema),
    mode: "onChange",
    defaultValues: {
      bandId: initialData?.bandId || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      condition: initialData?.condition?.join("\n") || "",
      type: initialData?.type || PrivilegeType.COUNT,
      imageFile: null as File | null,
      status: initialData?.status || PrivilegeStatus.ACTIVE,
    },
  });

  const watchedImageFile = watch("imageFile");
  const watchedName = watch("name");

  // Load bands for dropdown
  useEffect(() => {
    const loadBands = async () => {
      try {
        setLoadingBands(true);
        const response = await bandService.getBands({ isActive: true, limit: 100 });
        
        if (response.success && response.data) {
          setBands(response.data.data);
        }
      } catch (error) {
        console.error("Error loading bands:", error);
      } finally {
        setLoadingBands(false);
      }
    };

    loadBands();
  }, []);

  // Debounced name checking function
  const checkNameExists = useCallback(async (name: string) => {
    if (!name || name.trim().length === 0) {
      setNameExists(null);
      setNameCheckError(null);
      clearErrors("name");
      return;
    }

    // Skip check if it's the initial data (for edit mode)
    if (initialData?.name && name === initialData.name) {
      setNameExists(false);
      setNameCheckError(null);
      clearErrors("name");
      return;
    }

    setNameChecking(true);
    setNameCheckError(null);

    try {
      const result = await privilegeService.checkNameExists(name.trim());
      
      if (result.success && result.data) {
        if (result.data.exists) {
          setNameExists(true);
          setError("name", {
            type: "manual",
            message: "ชื่อ Privilege นี้มีอยู่แล้ว กรุณาใช้ชื่ออื่น",
          });
        } else {
          setNameExists(false);
          clearErrors("name");
        }
      } else {
        setNameCheckError(result.error || "เกิดข้อผิดพลาดในการตรวจสอบชื่อ");
      }
    } catch (error) {
      console.error("Error checking privilege name:", error);
      setNameCheckError("เกิดข้อผิดพลาดในการตรวจสอบชื่อ");
    } finally {
      setNameChecking(false);
    }
  }, [initialData?.name, setError, clearErrors]);

  // Debounce effect for name checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkNameExists(watchedName);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [watchedName, checkNameExists]);

  const handleFormSubmit = async (data: { 
    bandId: string; 
    name: string; 
    description: string; 
    condition?: string;
    type: PrivilegeType; 
    imageFile: File | null; 
    status: PrivilegeStatus;
  }) => {
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

    // Convert condition string to array (split by newlines and filter empty strings)
    const conditionArray = data.condition 
      ? data.condition.split('\n').filter(line => line.trim().length > 0)
      : undefined;

    // Convert form data to PrivilegeFormData format
    const privilegeData: PrivilegeFormData = {
      bandId: data.bandId,
      name: data.name,
      description: data.description,
      condition: conditionArray,
      type: data.type,
      imageId,
      imagePublicUrl,
      status: data.status,
    };
    
    await onSubmit(privilegeData);
  };

  const handleImageChange = (file: File | null) => {
    setValue("imageFile", file, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Brand Selection */}
      <div>
        <Select
          label="Brand"
          value={watch("bandId")}
          onChange={(value) => setValue("bandId", value, { shouldValidate: true })}
          placeholder="เลือก Brand"
          options={bands.map(band => ({
            value: band.id,
            label: band.bandName
          }))}
          error={errors.bandId?.message}
          disabled={loadingBands}
        />
      </div>

      {/* Privilege Name */}
      <div>
        <TextInput
          {...register("name")}
          label="ชื่อ Privilege"
          placeholder="กรอกชื่อ Event"
          error={errors.name?.message || nameCheckError || undefined}
          icon={
            nameChecking ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : nameExists === true ? (
              <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : nameExists === false && watchedName.trim().length > 0 ? (
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : null
          }
          iconPosition="right"
        />
      </div>

      {/* Type Selection */}
      <div>
        <Select
          label="ประเภท"
          value={watch("type")}
          onChange={(value) => setValue("type", value as PrivilegeType, { shouldValidate: true })}
          placeholder="เลือกประเภท"
          options={[
            { value: PrivilegeType.COUNT, label: "Count" },
            { value: PrivilegeType.LIMIT, label: "Limit" },
          ]}
          error={errors.type?.message}
        />
      </div>

      {/* Status Toggle */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Status
        </label>
        <div className="flex items-center">
          <Toggle
            checked={watch("status") === PrivilegeStatus.ACTIVE}
            onChange={(checked) => setValue("status", checked ? PrivilegeStatus.ACTIVE : PrivilegeStatus.CLOSE, { shouldValidate: true })}
            size="md"
          />
          <span className="ml-3 text-sm text-gray-700">Display to User</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <TextInput
          {...register("description")}
          label="Description"
          placeholder="กรอก Description"
          multiline
          rows={4}
          error={errors.description?.message}
        />
      </div>

      {/* Condition */}
      <div>
        <TextInput
          {...register("condition")}
          label="Condition"
          placeholder="กรอกเงื่อนไข (แต่ละบรรทัดเป็น 1 เงื่อนไข)"
          multiline
          rows={4}
          error={errors.condition?.message}
        />
      </div>

      {/* Image Upload */}
      <ImageUpload
        value={watchedImageFile}
        onChange={handleImageChange}
        error={errors.imageFile?.message as string}
        imagePublicUrl={initialData?.imagePublicUrl}
      />

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

