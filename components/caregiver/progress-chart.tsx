<<<<<<< HEAD
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { ProgressPoint } from '@/features/caregiver/types'
const config = { score: { label: 'Average score', color: 'hsl(var(--primary))' }, gamesPlayed: { label: 'Games', color: 'hsl(var(--muted-foreground))' } } satisfies ChartConfig
export function ProgressChart({ data }: { data: ProgressPoint[] }) { return <Card><CardHeader><CardTitle>Cognitive Progress</CardTitle><CardDescription>Average score and completed games over the selected period.</CardDescription></CardHeader><CardContent>{data.length ? <ChartContainer config={config} className="h-[300px] w-full"><LineChart data={data}><CartesianGrid vertical={false}/><XAxis dataKey="date" tickLine={false} axisLine={false}/><YAxis yAxisId="score"/><YAxis yAxisId="games" orientation="right"/><ChartTooltip content={<ChartTooltipContent/>}/><Line yAxisId="score" type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2}/><Line yAxisId="games" type="monotone" dataKey="gamesPlayed" stroke="var(--color-gamesPlayed)" strokeWidth={2}/></LineChart></ChartContainer> : <p className="py-16 text-center text-sm text-muted-foreground">No cognitive activity recorded yet.</p>}</CardContent></Card> }
=======
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
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
