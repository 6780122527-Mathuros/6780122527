import React, { useState, useEffect } from 'react';
import { User, BehaviorReport, MoodLog } from '../types';
import { dataService } from '../services/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Star, FileText, BarChart2, User as UserIcon, MinusCircle, PlusCircle, Check } from 'lucide-react';
import { MOOD_EMOJIS } from '../constants';

interface TeacherDashboardProps {
  currentUser: User;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [moods, setMoods] = useState<MoodLog[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  // Star Management
  const [starAmount, setStarAmount] = useState<number>(1);
  
  // Report Management
  const [reportText, setReportText] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setStudents(dataService.getUsers().filter(u => u.role === 'student'));
    setMoods(dataService.getMoods());
  };

  const handleStarChange = (type: 'add' | 'remove') => {
    if (!selectedStudentId) return;
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const change = type === 'add' ? starAmount : -starAmount;
    const newTotal = Math.max(0, student.stars + change); // Prevent negative stars

    const updatedStudent = { ...student, stars: newTotal };
    dataService.updateUser(updatedStudent);
    
    // UI Feedback
    alert(`${type === 'add' ? 'Added' : 'Removed'} ${starAmount} stars for ${student.name}.`);
    refreshData();
  };

  const handleSendReport = () => {
    if (!selectedStudentId || !reportText) return;
    const student = students.find(s => s.id === selectedStudentId);
    
    const report: BehaviorReport = {
        id: Date.now().toString(),
        studentId: selectedStudentId,
        studentName: student?.name || 'Unknown',
        detail: reportText,
        teacherName: currentUser.name,
        timestamp: new Date().toISOString()
    };
    
    dataService.addReport(report);
    setReportText('');
    alert("Report submitted to Advisor.");
  };

  // --- Statistics Logic ---
  const moodData = MOOD_EMOJIS.map(emojiDef => {
    const count = moods.filter(m => m.moodValue === emojiDef.value).length;
    return { name: emojiDef.label, value: count, color: emojiDef.color.replace('bg-', 'text-').replace('200', '400') }; // Simple color hack for demo
  });

  const COLORS = ['#93C5FD', '#818CF8', '#E5E7EB', '#86EFAC', '#F9A8D4'];

  return (
    <div className="space-y-6">
      
      {/* 1. Student Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-indigo-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" /> Manage Stars
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Select Student</label>
            <select 
              className="w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-indigo-200 outline-none"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="">-- Choose Student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} (Current: {s.stars} ⭐)</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <button 
                onClick={() => setStarAmount(Math.max(1, starAmount - 1))}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
                <MinusCircle size={20} />
            </button>
            <span className="text-2xl font-bold w-12 text-center">{starAmount}</span>
            <button 
                onClick={() => setStarAmount(starAmount + 1)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
                <PlusCircle size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={() => handleStarChange('add')}
                disabled={!selectedStudentId}
                className={`py-3 rounded-xl font-bold text-white shadow-md transition ${selectedStudentId ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300'}`}
             >
                Add Stars
             </button>
             <button 
                onClick={() => handleStarChange('remove')}
                disabled={!selectedStudentId}
                className={`py-3 rounded-xl font-bold text-white shadow-md transition ${selectedStudentId ? 'bg-red-400 hover:bg-red-500' : 'bg-gray-300'}`}
             >
                Deduct Stars
             </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 border border-indigo-50">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="text-indigo-500" /> Behavior Report
            </h2>
            <p className="text-xs text-gray-500 mb-4">Send a private note to the advisor regarding student behavior.</p>
            
            <textarea 
                className="w-full p-3 rounded-xl bg-gray-50 mb-3 text-sm h-32 focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                placeholder={selectedStudentId ? "Describe behavior..." : "Select a student first..."}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                disabled={!selectedStudentId}
            ></textarea>

            <button 
                onClick={handleSendReport}
                disabled={!selectedStudentId || !reportText}
                className={`w-full py-2 rounded-xl font-bold flex items-center justify-center gap-2 ${selectedStudentId && reportText ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400'}`}
            >
                Submit Report <Check size={16} />
            </button>
        </div>
      </div>

      {/* 2. Statistics Section */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BarChart2 className="text-blue-500" /> Student Mood Overview
        </h2>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                    <Bar dataKey="value" fill="#8884d8" radius={[10, 10, 0, 0]}>
                        {moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">Distribution of reported moods across all students.</p>
      </div>
    </div>
  );
};

export default TeacherDashboard;