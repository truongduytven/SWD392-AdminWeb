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

interface BarChartProps {
  data: RevenueAllMonthInYears[] | undefined
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white border p-3">
        <p className="label">{`Tháng: ${label}`}</p>
        <p className="intro">{`Doanh thu: ${formatPrice(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
};

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
        <Tooltip content={<CustomTooltip />}/>
        <Bar dataKey={"TotalRevenueMonthInYear"} radius={[4, 4, 0, 0]} />
      </BarGraph>
    </ResponsiveContainer>
  );
}