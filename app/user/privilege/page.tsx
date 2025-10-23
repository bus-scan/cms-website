import React from "react";
import PrivilegeList from "@/components/privilege/PrivilegeList";
import { PageTitle } from "@/components/common/text";
import LinkButton from "@/components/common/button/LinkButton";

export default function PrivilegePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <PageTitle>Privilege</PageTitle>
        <LinkButton
          href="/user/privilege/add"
          variant="primary"
          size="md"
        >
          + Privilege
        </LinkButton>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <PrivilegeList />
      </div>
    </div>
  );
}