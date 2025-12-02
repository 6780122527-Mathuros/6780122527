import React, { useState, useEffect } from 'react';
import { User, RedemptionLog } from '../types';
import { REWARDS } from '../constants';
import { dataService } from '../services/mockData';
import { Star, Gift, History } from 'lucide-react';

interface StarSystemProps {
  currentUser: User;
  onUpdateUser: (u: User) => void;
}

const StarSystem: React.FC<StarSystemProps> = ({ currentUser, onUpdateUser }) => {
  const [redemptions, setRedemptions] = useState<RedemptionLog[]>([]);
  const [activeTab, setActiveTab] = useState<'shop' | 'history'>('shop');

  useEffect(() => {
    // Filter redemptions for this user
    setRedemptions(dataService.getRedemptions().filter(r => r.userId === currentUser.id));
  }, [currentUser.id, currentUser.stars]); // Refresh when stars change

  const handleRedeem = (rewardId: string) => {
    const reward = REWARDS.find(r => r.id === rewardId);
    if (!reward) return;

    if (currentUser.stars < reward.cost) {
      alert("Not enough stars yet! Keep up the good work! ⭐");
      return;
    }

    if (window.confirm(`Redeem "${reward.name}" for ${reward.cost} stars?`)) {
      const newUserState = { ...currentUser, stars: currentUser.stars - reward.cost };
      
      // Update User
      dataService.updateUser(newUserState);
      onUpdateUser(newUserState);

      // Add Log
      const newLog: RedemptionLog = {
        id: Date.now().toString(),
        userId: currentUser.id,
        rewardName: reward.name,
        cost: reward.cost,
        timestamp: new Date().toISOString()
      };
      dataService.addRedemption(newLog);
      setRedemptions([newLog, ...redemptions]);
      
      alert("Redemption Successful! Please show this screen to your teacher.");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-yellow-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-10 translate-x-10 animate-blob"></div>

      <div className="flex justify-between items-end mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Good Kid Stars</h2>
          <p className="text-sm text-gray-500">Collect stars for rewards!</p>
        </div>
        <div className="bg-yellow-400 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-yellow-200">
          <Star fill="white" size={24} />
          <span className="text-2xl font-extrabold">{currentUser.stars}</span>
        </div>
      </div>

      <div className="flex gap-4 mb-4 border-b border-gray-100 pb-2 relative z-10">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors ${activeTab === 'shop' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400'}`}
        >
          <Gift size={16} /> Reward Shop
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors ${activeTab === 'history' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400'}`}
        >
          <History size={16} /> History
        </button>
      </div>

      {activeTab === 'shop' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {REWARDS.map(reward => {
            const canAfford = currentUser.stars >= reward.cost;
            return (
              <div key={reward.id} className={`${reward.color} p-4 rounded-2xl transition-transform hover:-translate-y-1 duration-200 border border-transparent hover:border-black/5`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-3xl">{reward.icon}</span>
                  <span className="bg-white/60 px-2 py-1 rounded-lg text-xs font-bold text-gray-700">
                    {reward.cost} ⭐
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-3">{reward.name}</h3>
                <button
                  onClick={() => handleRedeem(reward.id)}
                  disabled={!canAfford}
                  className={`w-full py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                    canAfford 
                      ? 'bg-white text-gray-800 hover:bg-gray-50 hover:shadow-md' 
                      : 'bg-white/40 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Redeem' : 'Need more stars'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2 relative z-10">
          {redemptions.length === 0 ? (
            <p className="text-center text-gray-400 py-4 text-sm">No rewards redeemed yet.</p>
          ) : (
            redemptions.map(log => (
              <div key={log.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{log.rewardName}</p>
                  <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                </div>
                <span className="text-red-400 font-bold text-sm">-{log.cost} ⭐</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StarSystem;