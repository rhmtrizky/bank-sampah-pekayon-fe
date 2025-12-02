"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ScheduleTable from "./ScheduleTable";
import Button from "@/components/ui/button/Button";
import ScheduleModal from "./ScheduleModal";
import { useSelector } from "react-redux";

type Tab = "pengepulan" | "pencairan";

export default function Page() {
  const [tab, setTab] = useState<Tab>("pengepulan");
  const [isModalOpen, setIsModalOpen] = useState(false);
 

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Jadwal (Pengepulan & Pencairan)" />
      </div>
      <div className="space-y-6">
        

          <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant={tab === "pengepulan" ? "primary" : "outline"} onClick={() => setTab("pengepulan")}>Pengepulan</Button>
            <Button variant={tab === "pencairan" ? "primary" : "outline"} onClick={() => setTab("pencairan")}>Pencairan</Button>
          </div>
            <Button onClick={() => setIsModalOpen(true)}>Tambah Jadwal</Button>
          </div>


          <ScheduleTable  type={tab} />

          <ScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={tab} onSuccess={() => { /* table reload via internal effect */ }} />
        </div>
    </div>
  );
}
