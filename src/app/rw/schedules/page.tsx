import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ScheduleTable from "./ScheduleTable";
import Button from "@/components/ui/button/Button";
// TODO: Replace with real auth/profile context
const CURRENT_RW_ID = 1; // temporary hardcoded RW id

export default function RWSchedulesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Schedules (Collection & Withdraw)" />
        <Button size="sm">Add Schedule</Button>
      </div>
      <div className="space-y-6">
        <ScheduleTable rwId={CURRENT_RW_ID} />
      </div>
    </div>
  );
}
