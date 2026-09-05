import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Brain, LayoutDashboard, TrendingUp, Bell, FileText, User, LogOut } from "lucide-react";
<<<<<<< HEAD
import { useAuth } from "@/contexts/AuthContext";
import { useCaregiverPatients } from "@/features/caregiver/context";
=======
import { mockPatient } from "@/lib/mock-data";
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function CaregiverSidebar() {
<<<<<<< HEAD
  const { profile, signOut } = useAuth();
  const { selectedPatient } = useCaregiverPatients();
=======
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
  const location = useLocation();
  const pathname = location.pathname;

  const overviewItems = [
    { title: "Dashboard", url: "/caregiver/dashboard", icon: LayoutDashboard },
    { title: "Progress", url: "/caregiver/progress", icon: TrendingUp },
    { title: "Reminders", url: "/caregiver/reminders", icon: Bell },
    { title: "Reports", url: "/caregiver/reports", icon: FileText },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-[family-name:var(--font-pt-mono)] text-primary">
            SmritiCare
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Patient</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/caregiver/dashboard"}>
                  <Link to="/caregiver/dashboard">
                    <User />
<<<<<<< HEAD
                    <span>{selectedPatient?.fullName ?? 'No patient selected'}</span>
=======
                    <span>{mockPatient.name}</span>
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
<<<<<<< HEAD
              <AvatarImage src={profile?.avatar_url ?? undefined} alt="Caregiver" />
              <AvatarFallback>{profile?.full_name?.[0] ?? 'C'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{profile?.full_name ?? 'Caregiver'}</span>
              <span className="text-xs text-muted-foreground">Caregiver</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => void signOut()} asChild>
=======
              <AvatarImage src="" alt="Caregiver" />
              <AvatarFallback>PK</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Dr. Priya Kumar</span>
              <span className="text-xs text-muted-foreground">Caregiver</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild>
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
            <Link to="/" title="Log Out">
              <LogOut className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
