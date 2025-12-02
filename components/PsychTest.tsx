import React, { useState } from 'react';
import { User, PsychTestResult } from '../types';
import { PSYCH_QUESTIONS } from '../constants';
import { dataService } from '../services/mockData';
import { Brain, Check } from 'lucide-react';

interface PsychTestProps {
  currentUser: User;
}

const PsychTest: React.FC<PsychTestProps> = ({ currentUser }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<PsychTestResult | null>(null);

  const handleSelect = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < PSYCH_QUESTIONS.length) {
      alert("Please answer all questions.");
      return;
    }

    const totalScore = (Object.values(answers) as number[]).reduce((a, b) => a + b, 0);
    let interpretation = "";

    if (totalScore <= 4) interpretation = "Minimal depression symptoms. You are doing well!";
    else if (totalScore <= 9) interpretation = "Mild symptoms. Try to engage in activities you enjoy.";
    else if (totalScore <= 14) interpretation = "Moderate symptoms. Consider talking to the school counselor.";
    else interpretation = "Moderately severe symptoms. Please schedule an appointment with a teacher immediately.";

    const newResult: PsychTestResult = {
      id: Date.now().toString(),
      userId: currentUser.id,
      score: totalScore,
      interpretation,
      timestamp: new Date().toISOString()
    };

    dataService.addTestResult(newResult);
    setResult(newResult);
  };

  const resetTest = () => {
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-teal-50 text-center">
        <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="text-teal-600" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Assessment Result</h3>
        <p className="text-lg font-semibold text-teal-600 mb-4">Score: {result.score}</p>
        <p className="text-gray-600 mb-6 bg-teal-50 p-4 rounded-xl">{result.interpretation}</p>
        <button 
          onClick={resetTest}
          className="bg-teal-600 text-white px-6 py-2 rounded-full font-bold hover:bg-teal-700 transition"
        >
          Take Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-teal-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Brain className="text-teal-500" /> Mental Health Check-in
      </h2>
      <p className="text-gray-500 mb-6 text-sm">Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>
      
      <div className="space-y-6">
        {PSYCH_QUESTIONS.map((q) => (
          <div key={q.id} className="pb-4 border-b border-gray-100 last:border-0">
            <p className="font-semibold text-gray-800 mb-3">{q.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(q.id, opt.value)}
                  className={`p-3 rounded-xl text-sm font-medium text-left transition-all ${
                    answers[q.id] === opt.value
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    {opt.label}
                    {answers[q.id] === opt.value && <Check size={16} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-200"
        >
          Submit Answers
        </button>
      </div>
    </div>
  );
};

export default PsychTest;