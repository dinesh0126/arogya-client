"use client"

// import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple bar chart"

const chartData = [
  { month: "June", total: 240, patients: 110 },
  { month: "January", total: 186, patients: 80 },
  { month: "February", total: 305, patients: 200 },
  { month: "March", total: 237, patients: 120 },
  { month: "April",total: 73, patients: 190 },
  { month: "April",total: 43, patients: 140 },
  { month: "April",total: 13, patients: 170 },
  { month: "May", total: 209, patients: 130 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "patients",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartBarMultiple() {
  return (
    <div className="w-full">
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="total" fill="#5e74fd" radius={4} barSize={10} />
          <Bar dataKey="patients" fill="green" radius={4} barSize={10} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
