"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


export const description = "A radial chart with stacked sections"

const chartData = [{ month: "january", desktop: 230, mobile: 570 }]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartRadialStacked() {
  const totalVisitors = chartData[0].desktop + chartData[0].mobile

  return (
    <>
      {/* MAIN CARD */}
      <Card className="w-full md:m-3 mt-4  mb-0 md:mt-0 rounded-xl shadow-sm">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-lg font-semibold">Visitor Overview</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 items-center justify-center pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[320px] md:max-w-[380px]"
          >
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius={160}
              outerRadius={120}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 10}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 18}
                            className="fill-muted-foreground text-sm"
                          >
                            Total Visitors
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>

              {/* CHART COLORS */}
              <RadialBar
                dataKey="desktop"
                stackId="a"
                cornerRadius={4}
                fill="#d6d5dd"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="mobile"
                fill="#4f6bfd"
                stackId="a"
                cornerRadius={6}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="flex-col gap-2 text-sm pt-4">
          <div className="flex items-center gap-2 leading-none font-medium text-green-600">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </p>
        </CardFooter>
      </Card>

      {/* BOTTOM METRICS */}
      <div className="grid grid-cols-3 gap-4 mx-4 px-4 py-4 md:py-1 w-full ml-2 bg-gray-100 rounded-lg shadow-sm">
        {[
          { label: "Revenue Target", value: "$200", status: "-" },
          { label: "New Leads", value: "148", status: "+" },
          { label: "Bounce Rate", value: "24%", status: "-" },
        ].map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-gray-500 text-xs">{item.label}</p>
            <p className="text-lg font-semibold flex justify-center items-center gap-1">
              {item.value}
              <span className={item.status === "+" ? "text-green-500" : "text-red-500"}>
                {item.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
