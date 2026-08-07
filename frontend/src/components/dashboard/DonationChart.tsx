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
                stopColor="#34d399"
                stopOpacity={0.35}
              />

              <stop
                offset="95%"
                stopColor="#34d399"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            stroke="#9a9aa6"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            stroke="#9a9aa6"
            fontSize={12}
            axisLine={false}
            tickLine={false}
            width={36}
          />

          <Tooltip
            cursor={{ stroke: "#34d399", strokeOpacity: 0.3 }}
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
            dataKey="donations"
            stroke="#34d399"
            fill="url(#donations)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
