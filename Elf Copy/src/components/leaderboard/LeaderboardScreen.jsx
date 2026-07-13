import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const MEDAL = ['🥇', '🥈', '🥉'];
const MEDAL_BG = [
  'bg-yellow-50 border-yellow-300',
  'bg-gray-50 border-gray-300',
  'bg-orange-50 border-orange-300',
];

export default function LeaderboardScreen() {
  const [tab, setTab] = useState('global');
  const [allStats, setAllStats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [myUser, setMyUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [user, stats, users] = await Promise.all([
          base44.auth.me().catch(() => null),
          // [수정] seeds가 아니라 saved(누적 생명체) 기준으로 정렬!
          base44.entities.UserStats.list('-saved', 200).catch(() => []),
          base44.entities.User.list().catch(() => []),
        ]);
        setMyUser(user);
        setAllStats(stats);
        setAllUsers(users);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const userMap = Object.fromEntries(allUsers.map(u => [u.email, u]));

  // 데이터 가공: total_plants + animals 합계로 랭킹 산정
  const enriched = allStats.map(s => {
    const u = userMap[s.user_email];
    return {
      ...s,
      displayName: u?.full_name || s.user_email?.split('@')[0] || 'Unknown Guardian',
      city: u?.city || 'Earth',
      totalSaved: (s.total_plants ?? 0) + (s.total_small_animals ?? 0) + (s.total_big_animals ?? 0),
    };
  }).sort((a, b) => b.totalSaved - a.totalSaved);

  const myCity = myUser?.city || localStorage.getItem('userCity') || '';

  // 탭 필터링 로직
  const rows = tab === 'local' && myCity
    ? enriched.filter(s => s.city === myCity)
    : enriched;

  return (
    <div className="flex flex-col h-full bg-white" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #ffffff 100%)' }}>
      {/* Header (Map Removed) */}
      <div className="px-5 pt-8 pb-4 text-center">
        <h1 className="text-3xl font-black text-green-900 tracking-tight">🏆 Hall of Fame</h1>
        <p className="text-sm text-green-600 font-medium">Global Ecosystem Guardians</p>
      </div>

      {/* Tabs */}
      <div className="flex mx-5 mb-4 bg-gray-100 rounded-2xl p-1 shadow-inner shrink-0">
        <button
          onClick={() => setTab('global')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'global' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
        >
          🌐 Global
        </button>
        <button
          onClick={() => setTab('local')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'local' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
        >
          📍 {myCity || 'My City'}
        </button>
      </div>

      {/* Ranking List */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-green-600 text-xs font-bold">CALCULATING IMPACT...</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Be the first hero in {tab === 'local' ? myCity : 'the world'}!</p>
          </div>
        ) : (
          rows.map((user, idx) => {
            const isTop3 = idx < 3 && tab === 'global';
            const isMe = user.user_email === myUser?.email;
            return (
              <div key={user.id} className={`flex items-center gap-4 px-5 py-4 rounded-3xl border-2 transition-all ${isTop3 ? MEDAL_BG[idx] : isMe ? 'bg-green-50 border-green-200' : 'bg-white border-gray-50 shadow-sm'}`}>
                <div className="w-8 text-center font-black text-lg text-gray-300">
                  {isTop3 ? MEDAL[idx] : `#${idx + 1}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800 truncate">{user.displayName}</p>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{user.city}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    🌿 {user.total_plants ?? 0} | 🐿️ {user.total_small_animals ?? 0} | 🦌 {user.total_big_animals ?? 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-green-600 leading-none">{user.totalSaved}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Saved</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}