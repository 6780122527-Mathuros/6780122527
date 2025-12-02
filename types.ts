export type Role = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  role: Role;
  stars: number; // For students
}

export interface MoodLog {
  id: string;
  userId: string;
  moodValue: number; // 1-5 (Sad to Happy)
  emoji: string;
  note: string;
  timestamp: string;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  icon: string;
  color: string;
}

export interface RedemptionLog {
  id: string;
  userId: string;
  rewardName: string;
  cost: number;
  timestamp: string;
}

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string; // Optional assignment
  reason: string;
  date: string; // ISO date string
  status: 'pending' | 'approved' | 'rejected';
  teacherNote?: string;
}

export interface PsychTestQuestion {
  id: number;
  question: string;
  options: { value: number; label: string }[];
}

export interface PsychTestResult {
  id: string;
  userId: string;
  score: number;
  interpretation: string;
  timestamp: string;
}

export interface BehaviorReport {
    id: string;
    studentId: string;
    studentName: string;
    detail: string;
    teacherName: string;
    timestamp: string;
}