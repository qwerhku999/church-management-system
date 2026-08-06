"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", donations: 4200 },
  { month: "Feb", donations: 5800 },
  { month: "Mar", donations: 7200 },
  { month: "Apr", donations: 6100 },
  { month: "May", donations: 8900 },
  { month: "Jun", donations: 10500 },
];

export default function DonationChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="donations"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#22C55E"
                stopOpacity={0.5}
              />

              <stop
                offset="95%"
                stopColor="#22C55E"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#1e293b"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
            stroke="#94A3B8"
          />

          <YAxis
            stroke="#94A3B8"
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="donations"
            stroke="#22C55E"
            fill="url(#donations)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}