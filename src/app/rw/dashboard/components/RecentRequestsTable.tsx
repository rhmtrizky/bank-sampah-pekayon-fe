"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { RecentRequest } from "@/types/dashboard";
import { rwDashboardService } from "@/services/dashboard.service";

export default function RecentRequestsTable() {
  const [requests, setRequests] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await rwDashboardService.getRecentRequests();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch recent requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Permintaan Online Terbaru
      </h4>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Tanggal Dibuat</TableCell>
              <TableCell isHeader>User ID</TableCell>
              <TableCell isHeader>Jadwal</TableCell>
              <TableCell isHeader>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.request_id}>
                <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{request.user_id}</TableCell>
                <TableCell>{request.scheduled_date ? new Date(request.scheduled_date).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <Badge
                    color={
                      request.status === "completed"
                        ? "success"
                        : request.status === "scheduled"
                        ? "info"
                        : request.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {request.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
