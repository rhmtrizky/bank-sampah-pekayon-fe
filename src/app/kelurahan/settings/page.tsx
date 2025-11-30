"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProfileSettingsForm from "@/components/settings/ProfileSettingsForm";
import PasswordSettingsForm from "@/components/settings/PasswordSettingsForm";

export default function KelurahanSettingsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Settings (Kelurahan)" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ProfileSettingsForm 
          initialData={{
            name: "Admin Kelurahan",
            email: "admin@kelurahan.go.id",
            phone: "021-5555555",
            address: "Kantor Kelurahan, Jl. Raya No. 1",
          }}
        />
        <PasswordSettingsForm />
      </div>
    </div>
  );
}
