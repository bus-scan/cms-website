import React from "react";
import BandList from "@/components/band/BandList";
import { PageTitle } from "@/components/common/text";
import LinkButton from "@/components/common/button/LinkButton";

export default function BandPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <PageTitle>Band</PageTitle>
        <LinkButton
          href="/user/band/add"
          variant="primary"
          size="md"
        >
          + Band
        </LinkButton>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <BandList />
      </div>
    </div>
  );
}
