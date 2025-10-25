"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/lib/utils";
import { HiMagnifyingGlass, HiEye, HiTrash, HiPencil } from "react-icons/hi2";
import { LinkButton } from "@/components/common/button";
import { StatusText } from "@/components/common/text";
import { Toggle } from "@/components/common/toggle";
import TextInput from "@/components/common/input/TextInput";
import { Select } from "@/components/common/select";
import { ActionMenu } from "@/components/common/action-menu";
import { ConfirmModal, SuccessModal } from "@/components/common/modal";
import { bandService } from "@/lib/services/band-service";
import { Band, SearchBandParams } from "@/lib/types/band";
import ErrorAlert from "@/components/common/alert/ErrorAlert";
import { TablePagination } from "@/components/common/table";

export default function BandList() {
  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bandToDelete, setBandToDelete] = useState<Band | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Load bands
  const loadBands = useCallback(async () => {
    try {
      setLoading(true);
      const params: SearchBandParams = {
        page: currentPage,
        limit: rowsPerPage,
      };

      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }
      if (statusFilter) {
        params.isActive = statusFilter === "active";
      }

      const response = await bandService.getBands(params);

      if (response.success && response.data) {
        setBands(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
      } else {
        setErrorMessage(response.error || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setShowError(true);
      }
    } catch {
      setErrorMessage("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, debouncedSearchTerm, statusFilter]);

  // Load bands when search parameters or page changes
  useEffect(() => {
    loadBands();
  }, [loadBands]);

  // Reset to first page when search parameters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, rowsPerPage]);

  // Handle delete band
  const handleDeleteBand = async () => {
    if (!bandToDelete) return;

    try {
      setIsDeleting(true);
      const response = await bandService.deleteBand(bandToDelete.id);

      if (response.success) {
        setShowDeleteModal(false);
        setShowSuccessModal(true);
        // Reload the bands list
        await loadBands();
      } else {
        setErrorMessage(response.error || "เกิดข้อผิดพลาดในการลบข้อมูล");
        setShowError(true);
        setShowDeleteModal(false);
      }
    } catch {
      setErrorMessage("เกิดข้อผิดพลาดในการลบข้อมูล");
      setShowError(true);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
      setBandToDelete(null);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (band: Band) => {
    setBandToDelete(band);
    setShowDeleteModal(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH");
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="p-4 rounded-lg">
        <div className="flex gap-4">
          <div className="flex-1">
            <TextInput
              type="text"
              label="ค้นหา"
              placeholder="ค้นหา ชื่อ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<HiMagnifyingGlass className="text-gray-400" />}
              iconPosition="left"
            />
          </div>
          <div className="w-48">
            <Select
              label="สถานะ"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              placeholder="เลือกสถานะ.."
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              className="mb-0"
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {showError && (
        <ErrorAlert
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>รูปภาพ</th>
                <th>Band</th>
                <th className="md:table-cell hidden">วันที่สร้าง</th>
                <th className="md:table-cell hidden">วันที่อัพเดต</th>
                <th>Status</th>
                <th className="md:table-cell hidden">Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    กำลังโหลด...
                  </td>
                </tr>
              ) : bands.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    ไม่พบข้อมูล
                  </td>
                </tr>
              ) : (
                bands.map((band) => (
                  <tr key={band.id}>
                    <td>
                      <div className="flex items-center justify-center">
                        <img
                          src={band.imagePublicUrl}
                          alt={band.bandName}
                          className="size-12 object-cover rounded-lg shrink-0"
                        />
                      </div>
                    </td>
                    <td>
                      <LinkButton
                        href={`/user/band/view/${band.id}`}
                        variant="text"
                      >
                        {band.bandName}
                      </LinkButton>
                    </td>
                    <td className="md:table-cell hidden">
                      {formatDate(band.createdAt)}
                    </td>
                    <td className="md:table-cell hidden">
                      {formatDate(band.updatedAt)}
                    </td>
                    <td>
                      <div className="flex justify-center items-center">
                        <StatusText isActive={band.isActive} />
                      </div>
                    </td>
                    <td className="md:table-cell hidden">
                      <div className="flex justify-center items-center">
                        <Toggle
                          checked={band.isActive}
                          disabled={true}
                          size="md"
                        />
                      </div>
                    </td>
                    <td>
                      <ActionMenu
                        itemId={band.id}
                        items={[
                          {
                            id: "view",
                            label: "ดูรายละเอียด",
                            icon: <HiEye className="h-4 w-4" />,
                            href: `/user/band/view/${band.id}`,
                          },
                          {
                            id: "edit",
                            label: "แก้ไขข้อมูล",
                            icon: <HiPencil className="h-4 w-4" />,
                            href: `/user/band/edit/${band.id}`,
                          },
                          {
                            id: "delete",
                            label: "ลบข้อมูล",
                            icon: <HiTrash className="h-4 w-4" />,
                            onClick: () => openDeleteModal(band),
                            className: "text-red-600 hover:bg-red-50",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBandToDelete(null);
        }}
        onConfirm={handleDeleteBand}
        title="ยืนยันการลบ"
        message={
          <p>
            คุณแน่ใจหรือไม่ที่ต้องการลบ &quot;{bandToDelete?.bandName}&quot;?{" "}
            <br />
            การดำเนินการนี้ไม่สามารถยกเลิกได้
          </p>
        }
        confirmText="ลบ"
        cancelText="ยกเลิก"
        confirmVariant="danger"
        isLoading={isDeleting}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="ลบข้อมูลสำเร็จ"
        message={`ลบข้อมูลเรียบร้อยแล้ว`}
        buttonText="ตกลง"
      />
    </div>
  );
}
