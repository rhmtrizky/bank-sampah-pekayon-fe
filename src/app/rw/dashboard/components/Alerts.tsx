"use client";

import React, { useEffect, useState } from "react";
import { RWAlerts } from "@/types/dashboard";
import { AlertIcon, TimeIcon, InfoIcon } from "@/icons";
import { rwDashboardService } from "@/services/dashboard.service";

interface AlertItem {
  id: string;
  type: 'pending_request' | 'collection_schedule' | 'withdraw_schedule' | 'notification';
  message: string;
  date?: string;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await rwDashboardService.getAlerts();
        const newAlerts: AlertItem[] = [];

        if (data.pending_requests > 0) {
          newAlerts.push({
            id: 'pending',
            type: 'pending_request',
            message: `${data.pending_requests} Request Online Pending`,
          });
        }

        data.today_collection_schedules.forEach((schedule, index) => {
          newAlerts.push({
            id: `collection-${index}`,
            type: 'collection_schedule',
            message: `Jadwal Pengumpulan Hari Ini: ${schedule.description || 'Tanpa Keterangan'}`,
            date: `${schedule.start_time} - ${schedule.end_time}`,
          });
        });

        data.upcoming_withdraw_schedules.forEach((schedule, index) => {
          newAlerts.push({
            id: `withdraw-${index}`,
            type: 'withdraw_schedule',
            message: `Jadwal Penarikan Akan Datang: ${schedule.date}`,
            date: `${schedule.start_time} - ${schedule.end_time}`,
          });
        });

        if (data.unread_notifications > 0) {
          newAlerts.push({
            id: 'notif',
            type: 'notification',
            message: `${data.unread_notifications} Notifikasi Belum Dibaca`,
          });
        }

        setAlerts(newAlerts);
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "pending_request":
        return <InfoIcon className="text-warning-500 size-5" />;
      case "withdraw_schedule":
        return <AlertIcon className="text-error-500 size-5" />;
      case "collection_schedule":
        return <TimeIcon className="text-brand-500 size-5" />;
      default:
        return <InfoIcon className="text-gray-500 size-5" />;
    }
  };

  return (
    <div className="col-span-12 rounded-2xl border border-gray-200 bg-white p-5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-8">
      <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Critical Alerts
      </h4>

      <div className="flex flex-col gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-4 rounded-lg border border-gray-100 p-4 dark:border-gray-700"
          >
            <div className="mt-1">{getIcon(alert.type)}</div>
            <div>
              <h5 className="font-medium text-gray-800 dark:text-white">
                {alert.message}
              </h5>
              {alert.date && <span className="text-sm text-gray-500">{alert.date}</span>}
            </div>
          </div>
        ))}
        {alerts.length === 0 && !loading && (
            <p className="text-gray-500">No alerts.</p>
        )}
      </div>
    </div>
  );
}
