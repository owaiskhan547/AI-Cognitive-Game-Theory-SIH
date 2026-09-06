import { PageHeader } from "@/components/shared/page-header";
import { StatsRow } from "@/components/caregiver/stats-row";
import { PatientOverviewCard } from "@/components/caregiver/patient-overview-card";
import { AdherenceCard } from "@/components/caregiver/adherence-card";
import { ActivityTable } from "@/components/caregiver/activity-table";

export default function CaregiverDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Monitor your patient's daily progress" />
      <StatsRow />
      <div className="grid lg:grid-cols-2 gap-6">
        <PatientOverviewCard />
        <AdherenceCard />
      </div>
      <div className="w-full">
        <ActivityTable />
      </div>
    </div>
  );
}
