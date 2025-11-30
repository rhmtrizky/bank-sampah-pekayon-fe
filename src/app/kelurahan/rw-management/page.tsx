"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RWTable from "./RWTable";
import Button from "@/components/ui/button/Button";
// TODO: Replace with real auth/profile context
const CURRENT_KELURAHAN_ID = 1; // temporary hardcoded kelurahan id

export default function RWManagementPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="RW Management" />
        <Button size="sm">Add New RW</Button>
      </div>
      <div className="space-y-6">
        <RWTable kelurahanId={CURRENT_KELURAHAN_ID} />
      </div>
    </div>
  );
}
