import { PageHeader } from "@/components/shared/page-header";
import { ProgressChart } from "@/components/caregiver/progress-chart";
import { mockProgressData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CaregiverProgressPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Cognitive Progress" subtitle="Track cognitive performance over time" />
      <div className="w-full">
        <ProgressChart />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProgressData.map((data) => (
          <Card key={data.week}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{data.week}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Score</span>
                  <span className="font-bold">{data.score}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Games Played</span>
                  <span className="font-medium">{data.gamesPlayed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
