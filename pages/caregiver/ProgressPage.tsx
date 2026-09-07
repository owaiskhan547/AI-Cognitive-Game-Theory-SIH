import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PatientSelector } from "@/components/caregiver/patient-selector";
import { ProgressChart } from "@/components/caregiver/progress-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCaregiverPatients } from "@/features/caregiver/context";
import { CaregiverRepository } from "@/features/caregiver/repository";
import type { ProgressSummary } from "@/features/caregiver/types";

export default function CaregiverProgressPage() {
  const { selectedPatient } = useCaregiverPatients();
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!selectedPatient) {
      setSummary(null);
      setError(null);
      return () => { active = false };
    }

    setLoading(true);
    setError(null);
    void CaregiverRepository.getProgressSummary(selectedPatient.patientId)
      .then((result) => {
        if (active) setSummary(result);
      })
      .catch((loadError) => {
        console.error("Unable to load patient progress", loadError);
        if (active) setError("Unable to load this patient's progress right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false };
  }, [selectedPatient?.patientId]);

  const trend = summary?.trend ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Cognitive Progress"
          subtitle={selectedPatient ? `Tracking ${selectedPatient.fullName}'s performance over time` : "Track cognitive performance over time"}
        />
        <PatientSelector />
      </div>
      <div className="w-full">
        {loading ? (
          <Card><CardContent className="py-16 text-center text-sm text-muted-foreground">Loading patient progress...</CardContent></Card>
        ) : error ? (
          <Card><CardContent className="py-16 text-center text-sm text-destructive">{error}</CardContent></Card>
        ) : selectedPatient ? (
          <ProgressChart data={trend} />
        ) : (
          <Card><CardContent className="py-16 text-center text-sm text-muted-foreground">Select an assigned patient to view progress.</CardContent></Card>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {trend.map((data) => (
          <Card key={data.date}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{data.date}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Score</span>
                  <span className="font-bold">{data.score}%</span>
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
