"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { mockProgressData } from "@/lib/mock-data";

const chartConfig = {
  score: { label: "Score", color: "var(--color-primary)" },
  gamesPlayed: { label: "Games Played", color: "var(--color-muted-foreground)" },
} satisfies ChartConfig;

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cognitive Progress</CardTitle>
        <CardDescription>Patient's cognitive performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={mockProgressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} yAxisId="left" />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} yAxisId="right" orientation="right" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line yAxisId="left" type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: "var(--color-primary)" }} />
            <Line yAxisId="right" type="monotone" dataKey="gamesPlayed" stroke="var(--color-muted-foreground)" strokeWidth={2} dot={{ fill: "var(--color-muted-foreground)" }} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
