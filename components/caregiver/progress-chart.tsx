"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { mockProgressData } from "@/lib/mock-data";
import type { ProgressPoint } from "@/features/caregiver/types";

const chartConfig = {
  score: { label: "Score", color: "var(--color-primary)" },
  gamesPlayed: { label: "Games Played", color: "var(--color-muted-foreground)" },
} satisfies ChartConfig;

export function ProgressChart({ data }: { data?: ProgressPoint[] } = {}) {
  const chartData = data !== undefined ? data : mockProgressData;
  const isDateKey = data !== undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cognitive Progress</CardTitle>
        <CardDescription>
          {isDateKey
            ? "Average score and completed games over the selected period"
            : "Patient's cognitive performance over time"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey={isDateKey ? "date" : "week"}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} yAxisId="left" />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                yAxisId="right"
                orientation="right"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="score"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: "var(--color-primary)" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="gamesPlayed"
                stroke="var(--color-muted-foreground)"
                strokeWidth={2}
                dot={{ fill: "var(--color-muted-foreground)" }}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No cognitive activity recorded yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
