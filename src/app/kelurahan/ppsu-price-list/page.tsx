"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KelurahanPriceListTable from "./PriceListTable";
import Button from "@/components/ui/button/Button";
// TODO: replace with real auth context providing kelurahanId
const CURRENT_KELURAHAN_ID = 1;

export default function KelurahanPriceListPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Price List (Kelurahan/PPSU)" />
        <Button size="sm">Update Master Prices</Button>
      </div>
      <div className="space-y-6">
        <KelurahanPriceListTable kelurahanId={CURRENT_KELURAHAN_ID} />
      </div>
    </div>
  );
}
