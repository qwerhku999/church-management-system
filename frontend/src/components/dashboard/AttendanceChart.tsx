"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import api from "@/lib/axios";

type AttendanceData = {
  day: string;
  attendance: number;
};

export default function AttendanceChart() {
  const [data, setData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const response = await api.get("/attendance/stats");

      const weeklyAttendance =
        response.data?.data?.weeklyAttendance ?? [];

      setData(weeklyAttendance);
    } catch (error) {
      console.error(
        "Failed to fetch attendance statistics:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();

    // Refresh every 30 seconds
    const interval = setInterval(
      fetchAttendance,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[340px] items-center justify-center text-sm text-[var(--muted)]">
        Loading attendance...
      </div>
    );
  }

  return (
    <div className="h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="attendanceGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#7c74ff"
                stopOpacity={0.35}
              />

              <stop
                offset="100%"
                stopColor="#7c74ff"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="day"
            tick={{
              fill: "#9a9aa6",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#9a9aa6",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{
              stroke: "#7c74ff",
              strokeOpacity: 0.3,
            }}
            contentStyle={{
              background: "#1b1b21",
              border: "1px solid rgba(255,255,255,.09)",
              borderRadius: "12px",
              color: "#f4f4f5",
              boxShadow: "0 8px 24px rgba(0,0,0,.24)",
            }}
          />

          <Area
            type="monotone"
            dataKey="attendance"
            stroke="#7c74ff"
            strokeWidth={2.5}
            fill="url(#attendanceGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "#7c74ff",
              strokeWidth: 2,
              stroke: "#0b0b0e",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}