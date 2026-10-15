export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  department: string;
  hospital: string;
  npi: string;
  avatar: string;
}

export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  condition: string;
  lastVisit: string;
  status: "Optimal" | "Attention" | "Critical";
  vitals: {
    bp: string;
    hr: string;
    glucose: string;
    spo2: string;
  };
  recentNotes: string;
}

export interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  time: string;
  date?: string;
  type: "Telehealth Video" | "In-Person Clinic";
  reason: string;
  status: "In Lobby" | "Upcoming" | "Checked In" | "In Examination" | "Completed";
  location?: string;
  roomNumber?: string;
  notes?: string;
}

export interface PendingLabReview {
  id: string;
  patientName: string;
  testName: string;
  date: string;
  criticalFlag: boolean;
  summary: string;
  status: "Pending Review" | "Signed";
}
