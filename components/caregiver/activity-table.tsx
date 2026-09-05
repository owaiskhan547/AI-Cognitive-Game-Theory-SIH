<<<<<<< HEAD
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; import type { CaregiverActivity } from '@/features/caregiver/types'
export function ActivityTable({ activities }: { activities: CaregiverActivity[] }) { return <Card><CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Activity</TableHead><TableHead>Type</TableHead><TableHead>Score</TableHead><TableHead>Time</TableHead></TableRow></TableHeader><TableBody>{activities.length ? activities.map((item) => <TableRow key={`${item.type}-${item.id}`}><TableCell className="font-medium capitalize">{item.activity}</TableCell><TableCell><Badge variant={item.type === 'game' ? 'default' : 'secondary'}>{item.type}</Badge></TableCell><TableCell>{item.score ?? '—'}</TableCell><TableCell className="text-muted-foreground">{format(new Date(item.occurredAt), 'PP p')}</TableCell></TableRow>) : <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No recent activity.</TableCell></TableRow>}</TableBody></Table></CardContent></Card> }
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockRecentActivity } from "@/lib/mock-data";

export function ActivityTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.activity}</TableCell>
                  <TableCell>
                    <Badge variant={activity.type === "game" ? "default" : "secondary"}>
                      {activity.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.score || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
