// Patient profile mock
export const mockPatient = {
  id: "patient-001",
  name: "Rajesh Kumar",
  age: 72,
  avatar: "/placeholder-user.jpg",
  condition: "Mild Cognitive Impairment",
  diagnosedDate: "2024-03-15",
  emergencyContact: { name: "Priya Kumar", phone: "+91-98765-43210", relation: "Daughter" },
}

// Today's schedule
export const mockSchedule = [
  { id: "s1", time: "8:00 AM", title: "Morning Medication", type: "medication" as const, completed: true },
  { id: "s2", time: "9:30 AM", title: "Memory Game Session", type: "game" as const, completed: true },
  { id: "s3", time: "11:00 AM", title: "Video Call with Dr. Sharma", type: "appointment" as const, completed: false },
  { id: "s4", time: "1:00 PM", title: "Afternoon Medication", type: "medication" as const, completed: false },
  { id: "s5", time: "3:00 PM", title: "Photo Album Review", type: "memory" as const, completed: false },
  { id: "s6", time: "8:00 PM", title: "Evening Medication", type: "medication" as const, completed: false },
]

// Medications
export const mockMedications = [
  { id: "m1", name: "Donepezil", dosage: "10mg", frequency: "Once daily", time: "8:00 AM", taken: true },
  { id: "m2", name: "Memantine", dosage: "5mg", frequency: "Twice daily", time: "8:00 AM / 8:00 PM", taken: false },
  { id: "m3", name: "Vitamin E", dosage: "400 IU", frequency: "Once daily", time: "1:00 PM", taken: false },
]

// Games
export const mockGames = [
  { id: "g1", name: "Memory Match", description: "Match pairs of cards to train your memory", icon: "brain", difficulty: "Easy", lastPlayed: "Today", bestScore: 850 },
  { id: "g2", name: "Word Recall", description: "Remember and type words from a list", icon: "type", difficulty: "Medium", lastPlayed: "Yesterday", bestScore: 620 },
  { id: "g3", name: "Pattern Recognition", description: "Find the pattern in sequences", icon: "puzzle", difficulty: "Easy", lastPlayed: "2 days ago", bestScore: 430 },
  { id: "g4", name: "Daily Quiz", description: "Answer questions about today and recent events", icon: "help-circle", difficulty: "Easy", lastPlayed: "Today", bestScore: 900 },
]

// Memories
export const mockMemories = [
  { id: "mem1", title: "Family Picnic at Lodhi Garden", date: "March 2024", description: "A lovely afternoon with the whole family", imageUrl: "/placeholder.jpg" },
  { id: "mem2", title: "Grandson's Birthday", date: "January 2024", description: "Rohan turned 5 years old!", imageUrl: "/placeholder.jpg" },
  { id: "mem3", title: "Morning Walk at India Gate", date: "February 2024", description: "Beautiful sunrise with Priya", imageUrl: "/placeholder.jpg" },
  { id: "mem4", title: "Diwali Celebration", date: "November 2023", description: "The house was full of light and joy", imageUrl: "/placeholder.jpg" },
]

// Caregiver stats
export const mockCaregiverStats = {
  cognitiveScore: 72,
  cognitiveScoreTrend: "+5%" as const,
  medicationAdherence: 85,
  adherenceTrend: "-2%" as const,
  gamesPlayed: 14,
  gamesTrend: "+3" as const,
  activeAlerts: 2,
  alertsTrend: "0" as const,
}

// Cognitive progress data (for charts)
export const mockProgressData = [
  { week: "Week 1", score: 58, gamesPlayed: 8 },
  { week: "Week 2", score: 62, gamesPlayed: 10 },
  { week: "Week 3", score: 60, gamesPlayed: 7 },
  { week: "Week 4", score: 65, gamesPlayed: 12 },
  { week: "Week 5", score: 68, gamesPlayed: 11 },
  { week: "Week 6", score: 72, gamesPlayed: 14 },
]

// Recent activity
export const mockRecentActivity = [
  { id: "a1", activity: "Completed Memory Match game", score: "850/1000", time: "2 hours ago", type: "game" as const },
  { id: "a2", activity: "Took morning medication", score: "—", time: "4 hours ago", type: "medication" as const },
  { id: "a3", activity: "Viewed family photos", score: "—", time: "5 hours ago", type: "memory" as const },
  { id: "a4", activity: "Completed Word Recall", score: "620/1000", time: "Yesterday", type: "game" as const },
  { id: "a5", activity: "Spoke with AI assistant", score: "—", time: "Yesterday", type: "assistant" as const },
]

// Reminders (caregiver)
export const mockReminders = [
  { id: "r1", title: "Morning Medication", time: "8:00 AM", days: "Every day", status: "active" as const, patient: "Rajesh Kumar" },
  { id: "r2", title: "Afternoon Medication", time: "1:00 PM", days: "Every day", status: "active" as const, patient: "Rajesh Kumar" },
  { id: "r3", title: "Evening Medication", time: "8:00 PM", days: "Every day", status: "active" as const, patient: "Rajesh Kumar" },
  { id: "r4", title: "Weekly Checkup Call", time: "10:00 AM", days: "Every Monday", status: "active" as const, patient: "Rajesh Kumar" },
  { id: "r5", title: "Game Session Reminder", time: "9:30 AM", days: "Mon, Wed, Fri", status: "paused" as const, patient: "Rajesh Kumar" },
]

// Stub functions — to be replaced with real implementations later
export async function loginUser(_email: string, _password: string, _role: string): Promise<{ success: boolean; role: string }> {
  return { success: true, role: _role }
}

export async function signupUser(_data: { name: string; email: string; password: string; role: string }): Promise<{ success: boolean }> {
  return { success: true }
}

export async function getPatientData() {
  return { patient: mockPatient, schedule: mockSchedule, medications: mockMedications, games: mockGames, memories: mockMemories }
}

export async function getCaregiverData() {
  return { patient: mockPatient, stats: mockCaregiverStats, progress: mockProgressData, activity: mockRecentActivity, reminders: mockReminders }
}

export async function markMedicationTaken(_id: string): Promise<{ success: boolean }> {
  return { success: true }
}

export async function triggerEmergency(): Promise<{ success: boolean; message: string }> {
  return { success: true, message: "Emergency services have been notified. Help is on the way." }
}
