import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockPatient, mockCaregiverStats } from "@/lib/mock-data";

export function PatientOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" alt={mockPatient.name} />
            <AvatarFallback>{mockPatient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{mockPatient.name}</h3>
            <div className="text-sm text-muted-foreground">Age: {mockPatient.age}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{mockPatient.condition}</Badge>
              <span className="text-xs text-muted-foreground">Active 2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Medication Adherence</span>
              <span>{mockCaregiverStats.medicationAdherence}%</span>
            </div>
            <Progress value={mockCaregiverStats.medicationAdherence} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Cognitive Score</span>
              <span>{mockCaregiverStats.cognitiveScore}/100</span>
            </div>
            <Progress value={mockCaregiverStats.cognitiveScore} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
