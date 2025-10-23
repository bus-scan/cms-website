"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { PrivilegeDetails, HistoryLogTable } from "@/components/privilege";
import { PageTitle } from "@/components/common/text";
import { Tabs } from "@/components/common/tab";
import { TabOption } from "@/components/common/tab";

type TabType = "privilege" | "history-log";

const tabs: TabOption<TabType>[] = [
  { value: "privilege", label: "Privilege" },
  { value: "history-log", label: "History log" },
];

export default function ViewPrivilegePage() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>("privilege");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <PageTitle>Privilege</PageTitle>
      </div>

      {/* Tabs and Content */}
      <div className="bg-white rounded-lg shadow">
        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
          children={{
            privilege: <PrivilegeDetails privilegeId={id} />,
            "history-log": <HistoryLogTable privilegeId={id} />,
          }}
        />
      </div>
    </div>
  );
}
