import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SummaryCards from "./components/SummaryCards";
import WeightChart from "./components/WeightChart";
import TransactionsChart from "./components/TransactionsChart";
import WasteCompositionChart from "./components/WasteCompositionChart";
import Alerts from "./components/Alerts";
import RecentTransactionsTable from "./components/RecentTransactionsTable";
import RecentRequestsTable from "./components/RecentRequestsTable";
import RtStatistics from "./components/RtStatistics";
import SalesSummary from "./components/SalesSummary";
import Calendar from "./components/Calendar";
import Announcements from "./components/Announcements";

export default function RWDashboard() {
  return (
    <div>
      <PageBreadcrumb pageTitle="RW Dashboard" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Row 1: Summary Cards (Full Width) */}
        <div className="col-span-12">
          <SummaryCards />
        </div>

        {/* Row 2: Main Charts (Weight & Transactions) */}
        <div className="col-span-12 xl:col-span-8">
          <WeightChart />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <TransactionsChart />
        </div>

        {/* Row 3: Waste Composition & Alerts */}
        <div className="col-span-12 xl:col-span-4">
          <WasteCompositionChart />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <Alerts />
        </div>

        {/* Row 4: Recent Transactions & Requests */}
        <div className="col-span-12 xl:col-span-7">
          <RecentTransactionsTable />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <RecentRequestsTable />
        </div>

        {/* Row 5: RT Stats & Sales Summary */}
        <div className="col-span-12 xl:col-span-6">
          <RtStatistics />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <SalesSummary />
        </div>

        {/* Row 6: Calendar & Announcements */}
        <div className="col-span-12 xl:col-span-8">
          <Calendar />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <Announcements />
        </div>
      </div>
    </div>
  );
}
