"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PriceListTable from "./PriceListTable";
import Button from "@/components/ui/button/Button";
// TODO: Replace with real auth context / profile fetch
const CURRENT_RW_ID = 2; // temporary hardcoded RW id

export default function RWPriceListPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Price List (RW)" />
        <Button size="sm">Update Prices</Button>
      </div>
      <div className="space-y-6">
        <PriceListTable rwId={CURRENT_RW_ID} />
      </div>
    </div>
  );
}
