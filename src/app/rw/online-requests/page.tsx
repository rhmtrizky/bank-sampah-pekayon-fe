"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RequestTable from './RequestTable';
import BulkScheduleModal from "./BulkScheduleModal";
import Button from "@/components/ui/button/Button";

export default function OnlineRequestsPage() {
  const [isBulkScheduleModalOpen, setIsBulkScheduleModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBulkScheduleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Setoran Sampah" />
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => setIsBulkScheduleModalOpen(true)}
          >
            Jadwalkan Semua
          </Button>
        </div>
        <RequestTable key={refreshKey} />
      </div>
      
      <BulkScheduleModal
        isOpen={isBulkScheduleModalOpen}
        onClose={() => setIsBulkScheduleModalOpen(false)}
        onSuccess={handleBulkScheduleSuccess}
      />
    </div>
  );
}
