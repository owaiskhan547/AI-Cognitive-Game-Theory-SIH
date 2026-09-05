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
import { useAuth } from "@/contexts/AuthContext";
import { mockPatient } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function CaregiverSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { profile, user, signOut } = useAuth();

  const caregiverName = profile?.full_name || user?.user_metadata?.full_name || "Caregiver";
  const patientName = profile?.role === 'patient' ? profile.full_name : mockPatient.name;

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
                    <span>{patientName}</span>
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
              <AvatarImage src={profile?.avatar_url || ""} alt={caregiverName} />
              <AvatarFallback>{caregiverName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{caregiverName}</span>
              <span className="text-xs text-muted-foreground">Caregiver</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            title="Log Out"
            onClick={async () => {
              await signOut();
              window.location.href = "/login";
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
