import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Pill, Gamepad2, AlertTriangle } from "lucide-react";
import { mockCaregiverStats } from "@/lib/mock-data";

export function StatsRow() {
  const { cognitiveScore, cognitiveScoreTrend, medicationAdherence, adherenceTrend, gamesPlayed, gamesTrend, activeAlerts, alertsTrend } = mockCaregiverStats;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Cognitive Score</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">{cognitiveScore}</div>
          <Badge variant={cognitiveScoreTrend.startsWith("+") ? "default" : "destructive"} className="mt-1">
            {cognitiveScoreTrend}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Med Adherence</CardTitle>
          <Pill className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">{medicationAdherence}%</div>
          <Badge variant={adherenceTrend.startsWith("+") ? "default" : "destructive"} className="mt-1">
            {adherenceTrend}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Games Played</CardTitle>
          <Gamepad2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">{gamesPlayed}</div>
          <Badge variant="secondary" className="mt-1">
            {gamesTrend} this week
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">{activeAlerts}</div>
          <Badge variant={alertsTrend === "0" ? "secondary" : "destructive"} className="mt-1">
            {alertsTrend === "0" ? "No change" : alertsTrend}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
