"use client";

import React, { useEffect, useState } from "react";
import { Announcement } from "@/types/dashboard";
import { InfoIcon } from "@/icons";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/kelurahan/announcements");
        if (!response.ok) {
            // Mock data
            setAnnouncements([
                { id: "1", title: "Perubahan Harga Sampah", content: "Mulai bulan depan harga plastik naik.", date: "2023-10-25", author: "Kelurahan" },
                { id: "2", title: "Lomba Kebersihan RW", content: "Akan diadakan lomba kebersihan antar RW.", date: "2023-10-20", author: "Kelurahan" },
            ]);
        } else {
            const data = await response.json();
            setAnnouncements(data);
        }
      } catch (error) {
        console.error("Failed to fetch announcements", error);
        // Mock data
        setAnnouncements([
            { id: "1", title: "Perubahan Harga Sampah", content: "Mulai bulan depan harga plastik naik.", date: "2023-10-25", author: "Kelurahan" },
            { id: "2", title: "Lomba Kebersihan RW", content: "Akan diadakan lomba kebersihan antar RW.", date: "2023-10-20", author: "Kelurahan" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-12 rounded-2xl border border-gray-200 bg-white p-5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-4">
      <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Pengumuman Kelurahan
      </h4>

      <div className="flex flex-col gap-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-2 flex items-center justify-between">
                <h5 className="font-medium text-gray-800 dark:text-white">
                    {announcement.title}
                </h5>
                <span className="text-xs text-gray-500">{announcement.date}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {announcement.content}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <InfoIcon className="size-3" />
                <span>{announcement.author}</span>
            </div>
          </div>
        ))}
        {announcements.length === 0 && !loading && (
            <p className="text-gray-500">Tidak ada pengumuman.</p>
        )}
      </div>
    </div>
  );
}
