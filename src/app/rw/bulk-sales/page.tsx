import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BulkSaleTable from "./BulkSaleTable";
import Button from "@/components/ui/button/Button";

export default function RWBulkSalesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Bulk Sales (To Pengepul)" />
        <Button size="sm">New Sale</Button>
      </div>
      <div className="space-y-6">
        <BulkSaleTable />
      </div>
    </div>
  );
}
