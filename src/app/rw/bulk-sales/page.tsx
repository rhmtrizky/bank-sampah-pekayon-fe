import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BulkSaleTable from "./BulkSaleTable";
import Button from "@/components/ui/button/Button";

export default function RWBulkSalesPage() {
  return (
    <div>
   
        <PageBreadcrumb pageTitle="Bulk Sales (To Pengepul)" />
 
      <div className="space-y-6">
        <BulkSaleTable />
      </div>
    </div>
  );
}
