"use client";
import React from "react";
import { useSelector } from "react-redux";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PriceListTable from "./PriceListTable";

export default function RWPriceListPage() {
  const user = useSelector((state: any) => state.auth.user);
  const rwId = user?.rw;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Daftar Harga Sampah (RW)" />
      </div>
      <div className="space-y-6">
        <PriceListTable rwId={rwId} />
      </div>
    </div>
  );
}
