import React, { useState } from 'react';
import { User } from './types';
import { dataService } from './services/mockData';
import MoodTracker from './components/MoodTracker';
import StarSystem from './components/StarSystem';
import AppointmentScheduler from './components/AppointmentScheduler';
import PsychTest from './components/PsychTest';
import TeacherDashboard from './components/TeacherDashboard';
import { LogOut, GraduationCap, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // A simple login simulation
  const handleLogin = (role: 'student' | 'teacher') => {
    const users = dataService.getUsers();
    // In a real app, this would be authentication. Here we just pick the first user of that role.
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-white">
          <div className="mb-8">
            <div className="bg-blue-500 text-white w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg shadow-blue-300 mb-4">
              🎓
            </div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">School Life</h1>
            <p className="text-gray-500">Mood & Behavior Tracker</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleLogin('student')}
              className="w-full py-4 rounded-2xl bg-white border-2 border-blue-100 hover:border-blue-400 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                   <UserCircle size={24} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-gray-800">I am a Student</span>
                  <span className="text-xs text-gray-400">Track mood, collect stars</span>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => handleLogin('teacher')}
              className="w-full py-4 rounded-2xl bg-white border-2 border-purple-100 hover:border-purple-400 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600 group-hover:scale-110 transition-transform">
                   <GraduationCap size={24} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-gray-800">I am a Teacher</span>
                  <span className="text-xs text-gray-400">Manage rewards & reports</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 px-6 py-4 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${currentUser.role === 'student' ? 'bg-blue-500' : 'bg-purple-500'}`}>
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-tight">{currentUser.name}</h1>
            <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
        >
          <LogOut size={20} />
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {currentUser.role === 'student' ? (
          <>
            <MoodTracker currentUser={currentUser} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StarSystem currentUser={currentUser} onUpdateUser={setCurrentUser} />
                <div className="space-y-6">
                    <AppointmentScheduler currentUser={currentUser} />
                    <PsychTest currentUser={currentUser} />
                </div>
            </div>
          </>
        ) : (
          <>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <MoodTracker currentUser={currentUser} />
                 <AppointmentScheduler currentUser={currentUser} />
             </div>
             <TeacherDashboard currentUser={currentUser} />
          </>
        )}
      </main>
      
      <div className="text-center py-8 text-gray-400 text-xs">
        <p>© 2024 School Wellbeing System</p>
      </div>
    </div>
  );
};

export default App;