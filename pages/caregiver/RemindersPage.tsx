import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockReminders } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export default function CaregiverRemindersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <PageHeader title="Reminders" subtitle="Manage medication and activity reminders" />
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockReminders.map((reminder) => (
          <Card key={reminder.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-bold">{reminder.title}</CardTitle>
                <Badge variant={reminder.status === "active" ? "default" : "secondary"}>
                  {reminder.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Time: <span className="font-medium text-foreground">{reminder.time}</span></p>
                <p>Days: <span className="font-medium text-foreground">{Array.isArray(reminder.days) ? reminder.days.join(", ") : reminder.days}</span></p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
