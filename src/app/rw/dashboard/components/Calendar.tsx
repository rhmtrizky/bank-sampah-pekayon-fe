"use client";

import React, { useEffect, useState } from "react";
import { ScheduleItem } from "@/types/dashboard";
import { CalenderIcon, TimeIcon } from "@/icons";
import { rwDashboardService } from "@/services/dashboard.service";

interface DisplaySchedule extends ScheduleItem {
  type: 'collection' | 'withdrawal';
  title: string;
}

export default function Calendar() {
  const [schedules, setSchedules] = useState<DisplaySchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await rwDashboardService.getSchedules();
        const collectionSchedules: DisplaySchedule[] = data.next_collection_schedules.map(s => ({
          ...s,
          type: 'collection',
          title: s.description || 'Pengumpulan Sampah'
        }));
        const withdrawSchedules: DisplaySchedule[] = data.next_withdraw_schedules.map(s => ({
          ...s,
          type: 'withdrawal',
          title: 'Penarikan Saldo'
        }));

        const allSchedules = [...collectionSchedules, ...withdrawSchedules].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setSchedules(allSchedules);
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-12 rounded-2xl border border-gray-200 bg-white p-5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-8">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
          Jadwal Kegiatan
        </h4>
        <CalenderIcon className="text-gray-500 size-5" />
      </div>

      <div className="flex flex-col gap-4">
        {schedules.map((schedule, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-lg border border-gray-100 p-3 dark:border-gray-700"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                schedule.type === 'collection' ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/15' : 'bg-success-50 text-success-500 dark:bg-success-500/15'
            }`}>
              <TimeIcon className="size-5" />
            </div>
            <div>
              <h5 className="font-medium text-gray-800 dark:text-white">
                {schedule.title}
              </h5>
              <span className="text-sm text-gray-500">
                {new Date(schedule.date).toLocaleDateString()} • {schedule.start_time} - {schedule.end_time}
              </span>
            </div>
          </div>
        ))}
        {schedules.length === 0 && !loading && (
            <p className="text-gray-500">Tidak ada jadwal.</p>
        )}
      </div>
    </div>
  );
}
