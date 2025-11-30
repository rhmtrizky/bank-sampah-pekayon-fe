"use client";
import React, { useEffect, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import { BulkSale } from "@/types";
import Badge from "@/components/ui/badge/Badge";

const columns: Column<BulkSale>[] = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Pengepul",
    cell: (row) => (
      <div>
        <p className="font-medium text-gray-800 dark:text-white/90">{row.pengepul.name}</p>
        <p className="text-xs text-gray-500">{row.pengepul.phone}</p>
      </div>
    ),
  },
  {
    header: "Total Weight",
    cell: (row) => `${row.totalWeight} kg`,
  },
  {
    header: "Total Amount",
    cell: (row) => `Rp ${row.totalAmount.toLocaleString()}`,
  },
  {
    header: "Status",
    cell: (row) => {
      const color = row.status === "COMPLETED" ? "success" : row.status === "DRAFT" ? "warning" : "error";
      return <Badge color={color}>{row.status}</Badge>;
    },
  },
  {
    header: "Action",
    cell: (row) => (
      <div className="flex gap-2">
        {row.status === "DRAFT" && (
           <button className="text-brand-500 hover:text-brand-600">Edit</button>
        )}
        <button className="text-gray-500 hover:text-gray-600">Detail</button>
      </div>
    ),
  },
];

export default function BulkSaleTable() {
  const [data, setData] = useState<BulkSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data
        setTimeout(() => {
          setData([
            {
              id: 1,
              rwId: 1,
              pengepulId: 1,
              pengepul: {
                id: 1,
                name: "UD Maju Jaya",
                phone: "081234567890",
                address: "Jl. Raya Bekasi",
                type: "SMALL",
                createdAt: "",
                updatedAt: "",
              },
              date: "2023-10-28",
              totalWeight: 150.5,
              totalAmount: 450000,
              status: "COMPLETED",
              items: [],
              createdAt: "2023-10-28",
              updatedAt: "2023-10-28",
            },
            {
              id: 2,
              rwId: 1,
              pengepulId: 2,
              pengepul: {
                id: 2,
                name: "CV Berkah Sampah",
                phone: "081987654321",
                address: "Jl. Kalimalang",
                type: "SMALL",
                createdAt: "",
                updatedAt: "",
              },
              date: "2023-10-29",
              totalWeight: 0,
              totalAmount: 0,
              status: "DRAFT",
              items: [],
              createdAt: "2023-10-29",
              updatedAt: "2023-10-29",
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return <BasicTableOne columns={columns} data={data} loading={loading} />;
}
