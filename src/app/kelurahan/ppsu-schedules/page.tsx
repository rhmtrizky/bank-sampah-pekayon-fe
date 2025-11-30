"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ScheduleTable from "./ScheduleTable";
import Button from "@/components/ui/button/Button";
// TODO: Replace with real auth/profile context
const CURRENT_KELURAHAN_ID = 1; // temporary hardcoded kelurahan id

export default function PPSUSchedulesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Kelurahan PPSU Schedules" />
        <Button size="sm">Add Schedule</Button>
      </div>
      <div className="space-y-6">
        <ScheduleTable kelurahanId={CURRENT_KELURAHAN_ID} />
      </div>
    </div>
  );
}
