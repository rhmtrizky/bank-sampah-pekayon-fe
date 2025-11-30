"use client";
import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Tidak ada data",
  description = "Belum tersedia data untuk ditampilkan.",
  action,
  icon,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-10 text-center dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>\n      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">\n        {icon || (<span className="text-gray-400 text-2xl">∅</span>)}\n      </div>\n      <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>\n      <p className="mb-5 max-w-xs text-sm text-gray-500 dark:text-gray-400">{description}</p>\n      {action && <div>{action}</div>}\n    </div>
  );
};

export default EmptyState;