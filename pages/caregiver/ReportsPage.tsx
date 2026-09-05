<<<<<<< HEAD
import { useEffect, useState } from 'react'; import { Download } from 'lucide-react'; import { PageHeader } from '@/components/shared/page-header'; import { Button } from '@/components/ui/button'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import { Skeleton } from '@/components/ui/skeleton'; import { PatientSelector } from '@/components/caregiver/patient-selector'; import { ActivityTable } from '@/components/caregiver/activity-table'; import { useCaregiverPatients } from '@/features/caregiver/context'; import { CaregiverRepository } from '@/features/caregiver/repository'; import type { ProgressReport } from '@/features/caregiver/types'
const summary = (report: ProgressReport) => [['Games played', report.stats.gamesPlayed], ['Average cognitive score', report.stats.averageScore ?? 'Not enough data'], ['Best score', report.stats.bestScore ?? 'Not enough data'], ['Average game duration', report.stats.averageDurationSeconds ? `${report.stats.averageDurationSeconds}s` : 'Not enough data'], ['Reminders / schedules', report.reminderCount], ['Medication adherence', 'Completion history unavailable']]
export default function CaregiverReportsPage() { const { selectedPatient } = useCaregiverPatients(); const [weekly, setWeekly] = useState<ProgressReport | null>(null); const [monthly, setMonthly] = useState<ProgressReport | null>(null); const [error, setError] = useState<string | null>(null); useEffect(() => { if (!selectedPatient) return; setWeekly(null); setMonthly(null); Promise.all([CaregiverRepository.getWeeklyReport(selectedPatient.patientId), CaregiverRepository.getMonthlyReport(selectedPatient.patientId)]).then(([w,m]) => { setWeekly(w); setMonthly(m) }).catch((e) => { console.error(e); setError('Unable to load reports. Please try again.') }) }, [selectedPatient?.patientId]); const exportCsv = async () => { if (!selectedPatient) return; try { const scores = await CaregiverRepository.getPatientGameScores(selectedPatient.patientId, 90); const rows = [['Patient', selectedPatient.fullName], [], ['Date','Activity/Game','Game type','Score','Difficulty','Duration (seconds)'], ...scores.map((s) => [s.completed_at, s.game_type.replaceAll('_',' '), s.game_type, String(s.score), s.difficulty, String(s.duration_seconds)])]; const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"','""')}"`).join(',')).join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8;' })); link.download = `patient-progress-${new Date().toISOString().slice(0,10)}.csv`; link.click(); URL.revokeObjectURL(link.href) } catch (e) { console.error(e); setError('Unable to export report. Please try again.') } }; if (!selectedPatient) return <p className="text-muted-foreground">No patients assigned yet.</p>; if (error) return <p className="text-destructive">{error}</p>; if (!weekly || !monthly) return <Skeleton className="h-96 w-full"/>; return <div className="space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:justify-between"><PageHeader title="Reports" subtitle="Weekly and monthly patient summaries"/><div className="flex gap-2"><PatientSelector/><Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4"/>Export CSV</Button></div></div><div className="grid gap-6 lg:grid-cols-2">{[weekly,monthly].map((report) => <Card key={report.period}><CardHeader><CardTitle className="capitalize">{report.period} summary</CardTitle></CardHeader><CardContent className="space-y-3">{summary(report).map(([label,value]) => <div key={String(label)} className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">{label}</span><strong className="text-right">{value}</strong></div>)}</CardContent></Card>)}</div><ActivityTable activities={monthly.activities.slice(0,10)}/></div> }
=======
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
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
