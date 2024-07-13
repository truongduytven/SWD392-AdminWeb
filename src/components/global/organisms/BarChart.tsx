/** @format */
"use client";
import { formatPrice } from "@/lib/utils";
import { RevenueAllMonthInYears } from "@/types";
import {
    Bar,
    BarChart as BarGraph,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";


const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000
  }
];

interface BarChartProps {
  data: RevenueAllMonthInYears[] | undefined
}

export default function BarChart({ data }: BarChartProps) {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarGraph data={data}>
        <XAxis
          dataKey={"Month"}
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => formatPrice(value)}
        />
        <Tooltip
          formatter={(value: number) => formatPrice(value)}
          labelFormatter={(label: string) => `Month: ${label}`}
        />
        <Bar dataKey={"TotalRevenueMonthInYear"} radius={[4, 4, 0, 0]} />
      </BarGraph>
    </ResponsiveContainer>
  );
}