import { PageHeader } from "@/components/shared/page-header";
import { StatsRow } from "@/components/caregiver/stats-row";
import { PatientOverviewCard } from "@/components/caregiver/patient-overview-card";
import { AdherenceCard } from "@/components/caregiver/adherence-card";
import { ActivityTable } from "@/components/caregiver/activity-table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CaregiverDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Dashboard" subtitle="Monitor your patient's daily progress" />
        <Button asChild className="gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500">
          <Link to="/caregiver/insights">
            <Sparkles className="w-4 h-4" />
            View AI Insights
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
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
