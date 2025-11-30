"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SummaryCards from "./components/SummaryCards";
import RwPerformanceChart from "./components/RwPerformanceChart";
import RwRankingTable from "./components/RwRankingTable";
import RecentTransactionsTable from "./components/RecentTransactionsTable";
import WasteCompositionChart from "./components/WasteCompositionChart";

export default function KelurahanDashboard() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Kelurahan Dashboard" />
      
      <SummaryCards />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <RwPerformanceChart />
        <WasteCompositionChart />
        <div className="col-span-12">
            <RwRankingTable />
        </div>
        <div className="col-span-12">
            <RecentTransactionsTable />
        </div>
      </div>
    </div>
  );
}


