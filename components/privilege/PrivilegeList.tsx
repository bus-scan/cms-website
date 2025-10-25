"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/lib/utils";
import { HiMagnifyingGlass, HiEye, HiTrash, HiPencil } from "react-icons/hi2";
import { LinkButton } from "@/components/common/button";
import { StatusText } from "@/components/common/text";
import { Toggle } from "@/components/common/toggle";
import PrivilegeStatus from "./PrivilegeStatus";
import TextInput from "@/components/common/input/TextInput";
import { Select } from "@/components/common/select";
import { ActionMenu } from "@/components/common/action-menu";
import { ConfirmModal, SuccessModal } from "@/components/common/modal";
import { privilegeService } from "@/lib/services/privilege-service";
import { Privilege, SearchPrivilegeParams, PrivilegeType, PrivilegeStatus as PrivilegeStatusEnum } from "@/lib/types/privilege";
import ErrorAlert from "@/components/common/alert/ErrorAlert";
import { TablePagination } from "@/components/common/table";

export default function PrivilegeList() {
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
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
  const [privilegeToDelete, setPrivilegeToDelete] = useState<Privilege | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Load privileges
  const loadPrivileges = useCallback(async () => {
    try {
      setLoading(true);
      const params: SearchPrivilegeParams = {
        page: currentPage,
        limit: rowsPerPage,
      };

      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }
      if (typeFilter) {
        params.type = typeFilter as PrivilegeType;
      }
      if (statusFilter) {
        params.status = statusFilter as PrivilegeStatusEnum;
      }

      const response = await privilegeService.getPrivileges(params);

      if (response.success && response.data) {
        setPrivileges(response.data.data);
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
  }, [currentPage, rowsPerPage, debouncedSearchTerm, typeFilter, statusFilter]);

  // Load privileges when search parameters or page changes
  useEffect(() => {
    loadPrivileges();
  }, [loadPrivileges]);

  // Reset to first page when search parameters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, typeFilter, statusFilter, rowsPerPage]);

  // Handle delete privilege
  const handleDeletePrivilege = async () => {
    if (!privilegeToDelete) return;

    try {
      setIsDeleting(true);
      const response = await privilegeService.deletePrivilege(privilegeToDelete.id);

      if (response.success) {
        setShowDeleteModal(false);
        setShowSuccessModal(true);
        // Reload the privileges list
        await loadPrivileges();
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
      setPrivilegeToDelete(null);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (privilege: Privilege) => {
    setPrivilegeToDelete(privilege);
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
              label="ประเภท"
              value={typeFilter}
              onChange={(value) => setTypeFilter(value)}
              placeholder="เลือกประเภท.."
              options={[
                { value: PrivilegeType.COUNT, label: "Count" },
                { value: PrivilegeType.LIMIT, label: "Limit" },
              ]}
              className="mb-0"
            />
          </div>
          <div className="w-48">
            <Select
              label="สถานะ"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              placeholder="เลือกสถานะ.."
              options={[
                { value: PrivilegeStatusEnum.ACTIVE, label: "Active" },
                { value: PrivilegeStatusEnum.CLOSE, label: "Close" },
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
                <th>Brand</th>
                <th>Privilege</th>
                <th>ประเภท</th>
                <th className="md:table-cell hidden">วันที่สร้าง</th>
                <th className="md:table-cell hidden">วันที่อัพเดต</th>
                <th>Status</th>
                <th>Display</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    กำลังโหลด...
                  </td>
                </tr>
              ) : privileges.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    ไม่พบข้อมูล
                  </td>
                </tr>
              ) : (
                privileges.map((privilege) => {
                  return (
                    <tr key={privilege.id}>
                      <td>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-black rounded flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-bold">BUS</span>
                          </div>
                          <span className="text-sm font-medium">BUS</span>
                        </div>
                      </td>
                      <td>
                        <LinkButton
                          href={`/user/privilege/view/${privilege.id}`}
                          variant="text"
                        >
                          {privilege.name}
                        </LinkButton>
                      </td>
                      <td>
                        <span className="text-sm text-gray-900">{privilege.type}</span>
                      </td>
                      <td className="md:table-cell hidden">{formatDate(privilege.createdAt)}</td>
                      <td className="md:table-cell hidden">{formatDate(privilege.updatedAt)}</td>
                      <td>
                        <div className="flex justify-center items-center">
                          <PrivilegeStatus status={privilege.status} />
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center items-center">
                          <Toggle
                            checked={privilege.status === PrivilegeStatusEnum.ACTIVE}
                            disabled={true}
                            size="md"
                          />
                        </div>
                      </td>
                      <td>
                        <ActionMenu
                          itemId={privilege.id}
                          items={[
                            {
                              id: "view",
                              label: "ดูรายละเอียด",
                              icon: <HiEye className="h-4 w-4" />,
                              href: `/user/privilege/view/${privilege.id}`,
                            },
                            {
                              id: "edit",
                              label: "แก้ไขข้อมูล",
                              icon: <HiPencil className="h-4 w-4" />,
                              href: `/user/privilege/edit/${privilege.id}`,
                            },
                            {
                              id: "delete",
                              label: "ลบข้อมูล",
                              icon: <HiTrash className="h-4 w-4" />,
                              onClick: () => openDeleteModal(privilege),
                              className: "text-red-600 hover:bg-red-50",
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })
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
          setPrivilegeToDelete(null);
        }}
        onConfirm={handleDeletePrivilege}
        title="ยืนยันการลบ"
        message={
          <p>
            คุณแน่ใจหรือไม่ที่ต้องการลบ &quot;{privilegeToDelete?.name}&quot;? <br />
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

