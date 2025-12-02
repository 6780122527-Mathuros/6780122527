import { Reward, PsychTestQuestion } from './types';

export const MOOD_EMOJIS = [
  { value: 1, emoji: '😭', label: 'Sad', color: 'bg-blue-200' },
  { value: 2, emoji: '😟', label: 'Worried', color: 'bg-indigo-200' },
  { value: 3, emoji: '😐', label: 'Neutral', color: 'bg-gray-200' },
  { value: 4, emoji: '🙂', label: 'Good', color: 'bg-green-200' },
  { value: 5, emoji: '🥰', label: 'Happy', color: 'bg-pink-200' },
];

export const REWARDS: Reward[] = [
  { id: '1', name: 'Break Time (5 min)', cost: 10, icon: '⏰', color: 'bg-yellow-100' },
  { id: '2', name: 'Stationery Coupon', cost: 12, icon: '✏️', color: 'bg-purple-100' },
  { id: '3', name: 'Food/Drink Coupon', cost: 15, icon: '🧃', color: 'bg-orange-100' },
];

export const PSYCH_QUESTIONS: PsychTestQuestion[] = [
  {
    id: 1,
    question: "How often have you felt little interest or pleasure in doing things over the last week?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 2,
    question: "How often have you felt down, depressed, or hopeless?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 3,
    question: "How often have you felt nervous, anxious, or on edge?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 4,
    question: "How often have you been unable to stop or control worrying?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
];