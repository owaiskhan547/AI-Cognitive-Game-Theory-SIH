// Emergency services configuration

import { Ambulance, ShieldAlert } from "lucide-react";

export interface EmergencyServiceConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  phone: string;
}

export const EMERGENCY_SERVICES = {
  AMBULANCE: {
    id: "ambulance",
    title: "Ambulance",
    subtitle: "Medical emergency response",
    description: "Call for immediate medical assistance.",
    icon: Ambulance,
    phone: "112",
  },
  POLICE: {
    id: "police",
    title: "Police",
    subtitle: "Law enforcement",
    description: "Report a crime or request police assistance.",
    icon: ShieldAlert,
    phone: "100",
  },
} as const;

export function getEmergencyServicesList(): EmergencyServiceConfig[] {
  return Object.values(EMERGENCY_SERVICES);
}
