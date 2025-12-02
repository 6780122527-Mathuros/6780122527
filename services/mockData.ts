import { User, MoodLog, RedemptionLog, Appointment, BehaviorReport, PsychTestResult } from '../types';

const STORAGE_KEYS = {
  USERS: 'app_users',
  MOODS: 'app_moods',
  REDEMPTIONS: 'app_redemptions',
  APPOINTMENTS: 'app_appointments',
  REPORTS: 'app_reports',
  TEST_RESULTS: 'app_test_results',
};

// Initial Seed Data
const INITIAL_USERS: User[] = [
  { id: 's1', name: 'Student Tonkla', role: 'student', stars: 25 },
  { id: 's2', name: 'Student Malee', role: 'student', stars: 8 },
  { id: 't1', name: 'Teacher Somchai', role: 'teacher', stars: 0 },
];

const INITIAL_MOODS: MoodLog[] = [
    { id: 'm1', userId: 's1', moodValue: 5, emoji: '🥰', note: 'Got full score in Math!', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'm2', userId: 's1', moodValue: 2, emoji: '😟', note: 'Forgot my homework.', timestamp: new Date().toISOString() },
    { id: 'm3', userId: 's2', moodValue: 3, emoji: '😐', note: 'Normal day.', timestamp: new Date().toISOString() },
];

// Helper to get data
const getFromStorage = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : initial;
};

// Helper to set data
const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const dataService = {
  getUsers: (): User[] => getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS),
  
  updateUser: (updatedUser: User) => {
    const users = dataService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      saveToStorage(STORAGE_KEYS.USERS, users);
    }
  },

  getMoods: (): MoodLog[] => getFromStorage(STORAGE_KEYS.MOODS, INITIAL_MOODS),
  
  addMood: (mood: MoodLog) => {
    const moods = dataService.getMoods();
    saveToStorage(STORAGE_KEYS.MOODS, [mood, ...moods]);
  },

  getRedemptions: (): RedemptionLog[] => getFromStorage(STORAGE_KEYS.REDEMPTIONS, []),
  
  addRedemption: (log: RedemptionLog) => {
    const logs = dataService.getRedemptions();
    saveToStorage(STORAGE_KEYS.REDEMPTIONS, [log, ...logs]);
  },

  getAppointments: (): Appointment[] => getFromStorage(STORAGE_KEYS.APPOINTMENTS, []),
  
  saveAppointment: (appt: Appointment) => {
    const appts = dataService.getAppointments();
    const existingIndex = appts.findIndex(a => a.id === appt.id);
    if (existingIndex >= 0) {
        appts[existingIndex] = appt;
        saveToStorage(STORAGE_KEYS.APPOINTMENTS, appts);
    } else {
        saveToStorage(STORAGE_KEYS.APPOINTMENTS, [appt, ...appts]);
    }
  },

  getReports: (): BehaviorReport[] => getFromStorage(STORAGE_KEYS.REPORTS, []),
  
  addReport: (report: BehaviorReport) => {
    const reports = dataService.getReports();
    saveToStorage(STORAGE_KEYS.REPORTS, [report, ...reports]);
  },

  getTestResults: (): PsychTestResult[] => getFromStorage(STORAGE_KEYS.TEST_RESULTS, []),

  addTestResult: (result: PsychTestResult) => {
      const results = dataService.getTestResults();
      saveToStorage(STORAGE_KEYS.TEST_RESULTS, [result, ...results]);
  }
};