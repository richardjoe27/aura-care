export interface VitalMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: "optimal" | "normal" | "warning" | "alert";
  statusText: string;
  trend: string;
  isPositive: boolean;
  history: number[];
  color: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  period: "Morning" | "Afternoon" | "Evening" | "Night";
  withFood: boolean;
  taken: boolean;
  instructions: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviewsCount: number;
  availableDays: string[];
  avatar: string;
  experience: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  date: string;
  time: string;
  type: "Telehealth Video" | "In-Person Clinic";
  status: "Confirmed" | "Upcoming" | "Completed" | "Cancelled";
  meetingLink?: string;
  location?: string;
  reason: string;
}

export interface LabReport {
  id: string;
  testName: string;
  category: string;
  date: string;
  doctor: string;
  status: "Normal" | "Attention" | "Optimal";
  metrics: {
    name: string;
    result: string;
    reference: string;
    unit: string;
    status: "normal" | "low" | "high";
  }[];
  summary: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "aura-ai";
  text: string;
  timestamp: string;
  suggestions?: string[];
}
