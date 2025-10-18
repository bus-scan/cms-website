"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { SolidButton } from "@/components/common/button";
import { PageTitle } from "@/components/common/text";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <PageTitle>Profile</PageTitle>
      
      <div className="bg-white rounded-lg shadow p-6">
        {user && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <p className="mt-1 text-sm text-gray-900">{user.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              {user.firstName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user.firstName} {user.lastName}</p>
                </div>
              )}
              {user.role && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-sm text-gray-900">{user.role}</p>
                </div>
              )}
            </div>
            
            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <SolidButton variant="danger" size="md" onClick={handleLogout}>
                Logout
              </SolidButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
