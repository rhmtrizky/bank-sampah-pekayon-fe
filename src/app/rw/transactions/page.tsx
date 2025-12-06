"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TransactionTable from "./TransactionTable";

export default function TransactionsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Transaksi Sampah" />
      <div className="space-y-6">
        <TransactionTable />
      </div>
    </div>
  );
}
