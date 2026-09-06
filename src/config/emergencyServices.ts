// src/config/emergencyServices.ts
// Minimal configuration for the EmergencyServiceCard component.

export type EmergencyServiceConfig = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  phone: string;
};

// Central registry of known emergency service IDs
export const EMERGENCY_SERVICES = {
  AMBULANCE: { id: "ambulance" },
  POLICE: { id: "police" },
} as const;

/**
 * Returns a list of emergency services to display.
 * Add or modify entries here as your product requirements evolve.
 */
export function getEmergencyServicesList(): EmergencyServiceConfig[] {
  return [
    {
      id: EMERGENCY_SERVICES.AMBULANCE.id,
      title: "Ambulance",
      subtitle: "Rapid medical transport",
      description:
        "Call for immediate medical assistance and transport to the nearest hospital.",
      phone: "911",
    },
    {
      id: EMERGENCY_SERVICES.POLICE.id,
      title: "Police",
      subtitle: "Safety & security",
      description:
        "Contact law enforcement for emergencies, safety concerns, or crime reporting.",
      phone: "911",
    },
  ];
}
