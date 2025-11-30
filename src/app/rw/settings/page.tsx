"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProfileSettingsForm from "@/components/settings/ProfileSettingsForm";
import PasswordSettingsForm from "@/components/settings/PasswordSettingsForm";

export default function RWSettingsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Settings (RW)" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ProfileSettingsForm 
          initialData={{
            name: "Budi Santoso (RW 05)",
            email: "rw05@banksampah.id",
            phone: "081234567890",
            address: "Jl. Mawar No. 10, RW 05",
          }}
        />
        <PasswordSettingsForm />
      </div>
    </div>
  );
}
