"use client";

import React, { useRef, useState } from "react";
import { HiCloudArrowUp } from "react-icons/hi2";

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  label?: string;
  imagePublicUrl?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export default function ImageUpload({
  value,
  onChange,
  error,
  label = "รูปภาพ",
  imagePublicUrl,
  maxSize = 5,
  acceptedTypes = ["image/*"],
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      onChange(null);
      return;
    }

    // Validate file type
    const isValidType = acceptedTypes.some(type => {
      if (type === "image/*") {
        return file.type.startsWith('image/');
      }
      return file.type === type;
    });

    if (!isValidType) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`ขนาดไฟล์ต้องไม่เกิน ${maxSize}MB`);
      return;
    }

    // Just store the file, don't upload yet
    onChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasImage = value || imagePublicUrl;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-2">
          {label}
        </label>
      )}
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }
        `}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          {hasImage ? (
            <div className="relative">
              <img
                src={value ? URL.createObjectURL(value) : imagePublicUrl}
                alt="Preview"
                className="max-w-full max-h-48 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <HiCloudArrowUp className="text-4xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                เพิ่มรูปภาพ
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG (max. {maxSize} MB)
              </p>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
