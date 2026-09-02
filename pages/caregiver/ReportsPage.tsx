import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityTable } from "@/components/caregiver/activity-table";
import { Download } from "lucide-react";
import { mockCaregiverStats } from "@/lib/mock-data";

export default function CaregiverReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <PageHeader title="Reports" subtitle="Weekly and monthly summaries" />
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>This Week Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Games Played</span>
              <span className="font-bold">{mockCaregiverStats.gamesPlayed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Avg Cognitive Score</span>
              <span className="font-bold">{mockCaregiverStats.cognitiveScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Med Adherence</span>
              <span className="font-bold">{mockCaregiverStats.medicationAdherence}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Month Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Games Played</span>
              <span className="font-bold">{Math.round(mockCaregiverStats.gamesPlayed * 4.2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Avg Cognitive Score</span>
              <span className="font-bold">{mockCaregiverStats.cognitiveScore - 2}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Med Adherence</span>
              <span className="font-bold">{Math.min(100, mockCaregiverStats.medicationAdherence + 5)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full">
        <ActivityTable />
      </div>
    </div>
  );
}
