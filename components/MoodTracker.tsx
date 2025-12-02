import React, { useState, useEffect } from 'react';
import { User, MoodLog } from '../types';
import { MOOD_EMOJIS } from '../constants';
import { dataService } from '../services/mockData';
import { Book, Send } from 'lucide-react';

interface MoodTrackerProps {
  currentUser: User;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ currentUser }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<MoodLog[]>([]);
  const [viewHistory, setViewHistory] = useState(false);

  useEffect(() => {
    const allMoods = dataService.getMoods();
    // Filter strictly for the current user
    setHistory(allMoods.filter(m => m.userId === currentUser.id));
  }, [currentUser.id]);

  const handleSubmit = () => {
    if (selectedEmoji === null) return;

    const emojiObj = MOOD_EMOJIS.find(m => m.value === selectedEmoji);
    if (!emojiObj) return;

    const newMood: MoodLog = {
      id: Date.now().toString(),
      userId: currentUser.id,
      moodValue: selectedEmoji,
      emoji: emojiObj.emoji,
      note: note,
      timestamp: new Date().toISOString(),
    };

    dataService.addMood(newMood);
    setHistory([newMood, ...history]);
    setSelectedEmoji(null);
    setNote('');
    alert('Mood saved! 🌟');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-blue-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {currentUser.role === 'student' ? 'How are you today?' : 'Teacher\'s Daily Mood'}
        </h2>
        <button 
          onClick={() => setViewHistory(!viewHistory)}
          className="text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-sm"
        >
          <Book size={16} /> {viewHistory ? 'Log' : 'My Diary'}
        </button>
      </div>

      {!viewHistory ? (
        <div className="space-y-6">
          <div className="flex justify-between gap-2 overflow-x-auto pb-2 no-scrollbar">
            {MOOD_EMOJIS.map((item) => (
              <button
                key={item.value}
                onClick={() => setSelectedEmoji(item.value)}
                className={`flex flex-col items-center p-3 rounded-2xl transition-all transform hover:scale-110 ${
                  selectedEmoji === item.value 
                    ? `${item.color} ring-4 ring-offset-2 ring-blue-200 scale-110 shadow-lg` 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-4xl mb-1 filter drop-shadow-sm">{item.emoji}</span>
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              className="w-full p-4 rounded-2xl bg-gray-50 border-0 focus:ring-2 focus:ring-blue-300 resize-none text-gray-700 placeholder-gray-400"
              placeholder="Tell me more about your day..."
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              disabled={selectedEmoji === null}
              onClick={handleSubmit}
              className={`absolute bottom-3 right-3 p-2 rounded-full text-white shadow-md transition-all ${
                selectedEmoji !== null ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 h-64 overflow-y-auto pr-2 custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No diary entries yet.</div>
          ) : (
            history.map((log) => (
              <div key={log.id} className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-2xl flex items-start gap-4 border border-blue-50/50">
                <div className="bg-white p-2 rounded-full shadow-sm text-2xl h-12 w-12 flex items-center justify-center">
                    {log.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-800 text-sm font-medium">{log.note || "No details."}</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1 flex gap-1">
                    {[...Array(log.moodValue)].map((_, i) => (
                      <div key={i} className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MoodTracker;