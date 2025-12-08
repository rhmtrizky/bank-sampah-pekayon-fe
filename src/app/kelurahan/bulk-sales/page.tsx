"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KelurahanBulkSaleTable from "./BulkSaleTable";
import Button from "@/components/ui/button/Button";
// TODO: Replace with real auth/profile context
const CURRENT_KELURAHAN_ID = 1; // temporary hardcoded kelurahan id

export default function KelurahanBulkSalesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Penjualan ke Pengepul" />
        <Button size="sm">New Large Sale</Button>
      </div>
      <div className="space-y-6">
        <KelurahanBulkSaleTable kelurahanId={CURRENT_KELURAHAN_ID} />
      </div>
    </div>
  );
}
