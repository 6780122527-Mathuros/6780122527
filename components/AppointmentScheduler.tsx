import React, { useState, useEffect } from 'react';
import { User, Appointment } from '../types';
import { dataService } from '../services/mockData';
import { Calendar, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface AppointmentSchedulerProps {
  currentUser: User;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ currentUser }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Student Form State
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');

  // Teacher Action State
  const [teacherNote, setTeacherNote] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [currentUser]);

  const loadAppointments = () => {
    const all = dataService.getAppointments();
    if (currentUser.role === 'student') {
      setAppointments(all.filter(a => a.studentId === currentUser.id));
    } else {
      // Teachers see all pending, or all generally
      setAppointments(all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  const handleRequest = () => {
    if (!reason || !date) return alert("Please fill in all fields");

    const newAppt: Appointment = {
      id: Date.now().toString(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      teacherId: '', // General request
      reason,
      date,
      status: 'pending'
    };

    dataService.saveAppointment(newAppt);
    setReason('');
    setDate('');
    loadAppointments();
    alert('Request sent!');
  };

  const handleTeacherAction = (id: string, status: 'approved' | 'rejected') => {
    const appt = appointments.find(a => a.id === id);
    if (!appt) return;

    const updatedAppt: Appointment = {
      ...appt,
      status,
      teacherId: currentUser.id,
      teacherNote: teacherNote || (status === 'approved' ? 'See you then!' : 'Please reschedule.')
    };

    dataService.saveAppointment(updatedAppt);
    setTeacherNote('');
    setActionId(null);
    loadAppointments();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-purple-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Calendar className="text-purple-500" />
        {currentUser.role === 'student' ? 'Teacher Consultation' : 'Student Requests'}
      </h2>

      {currentUser.role === 'student' && (
        <div className="bg-purple-50 p-4 rounded-2xl mb-6">
          <h3 className="font-semibold text-purple-800 mb-2">Request an Appointment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <input 
              type="datetime-local" 
              className="p-3 rounded-xl border-none focus:ring-2 focus:ring-purple-300 w-full"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Topic (e.g., Study advice, Personal issue)"
              className="p-3 rounded-xl border-none focus:ring-2 focus:ring-purple-300 w-full"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
          <button 
            onClick={handleRequest}
            className="bg-purple-600 text-white w-full py-2 rounded-xl font-bold hover:bg-purple-700 transition"
          >
            Send Request
          </button>
        </div>
      )}

      <div className="space-y-3">
        {appointments.length === 0 ? (
          <p className="text-gray-400 text-center">No appointments found.</p>
        ) : (
          appointments.map(appt => (
            <div key={appt.id} className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                      appt.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      appt.status === 'approved' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {appt.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> {new Date(appt.date).toLocaleString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800">
                    {currentUser.role === 'teacher' ? appt.studentName : `To: Counselor`}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">"{appt.reason}"</p>
                  {appt.teacherNote && (
                    <div className="mt-2 text-xs bg-gray-50 p-2 rounded-lg text-gray-500 italic flex items-start gap-1">
                      <MessageSquare size={12} className="mt-0.5" />
                      Teacher: {appt.teacherNote}
                    </div>
                  )}
                </div>

                {/* Teacher Actions */}
                {currentUser.role === 'teacher' && appt.status === 'pending' && (
                  <div className="flex flex-col gap-2 items-end">
                    {actionId === appt.id ? (
                      <div className="flex flex-col gap-2 items-end w-48 animate-in fade-in slide-in-from-right-4 duration-300">
                        <input
                          type="text"
                          placeholder="Note (optional)"
                          className="text-xs p-2 border rounded-lg w-full"
                          value={teacherNote}
                          onChange={e => setTeacherNote(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleTeacherAction(appt.id, 'approved')}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-600"
                          >
                            Confirm
                          </button>
                          <button 
                             onClick={() => setActionId(null)}
                             className="text-gray-400 text-xs hover:text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActionId(appt.id)}
                          className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100"
                          title="Approve"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleTeacherAction(appt.id, 'rejected')}
                          className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduler;