"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", attendance: 210 },
  { day: "Tue", attendance: 180 },
  { day: "Wed", attendance: 250 },
  { day: "Thu", attendance: 300 },
  { day: "Fri", attendance: 220 },
  { day: "Sat", attendance: 470 },
  { day: "Sun", attendance: 980 },
];

export default function AttendanceChart() {
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
                stopColor="#6366F1"
                stopOpacity={0.55}
              />

              <stop
                offset="100%"
                stopColor="#6366F1"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="day"
            tick={{
              fill: "#94A3B8",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#94A3B8",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{
              stroke: "#6366F1",
              strokeOpacity: 0.25,
            }}
            contentStyle={{
              background: "#101827",
              border: "1px solid rgba(255,255,255,.06)",
              borderRadius: "16px",
              color: "#fff",
            }}
          />

          <Area
            type="monotone"
            dataKey="attendance"
            stroke="#6366F1"
            strokeWidth={4}
            fill="url(#attendanceGradient)"
            dot={{
              r: 4,
              fill: "#6366F1",
              strokeWidth: 2,
              stroke: "#fff",
            }}
            activeDot={{
              r: 7,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}