import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { fetchChallenges, fetchProfile } from '../lib/api';

const Icon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => {
  const icons: Record<string, any> = {
    Lock: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    Key: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
    Cpu: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
    Check: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    ArrowRight: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
    Search: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Code: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    Trophy: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 4h4M5 13a7 7 0 0014 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v4z" /></svg>
  };
  return icons[name] || null;
};

export default function Challenges() {
  const { connected, publicKey } = useWallet();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ solved: 0, total: 0, points: 0, l1Solved: 0, l2Solved: 0, l3Solved: 0, l1Total: 0, l2Total: 0, l3Total: 0 });
  const [animateTrigger, setAnimateTrigger] = useState(0);

  useEffect(() => {
    if (!connected || !publicKey) return;

    const loadChallengesData = async () => {
      try {
        setLoading(true);
        const challengesData = await fetchChallenges();
        const profileData = await fetchProfile(publicKey.toString());
        const earnedIds = new Set(profileData.credentials.map((c: any) => c.challengeId));

        let solvedCount = 0;
        let pointsEarned = 0;
        let l1S = 0, l2S = 0, l3S = 0;
        let l1T = 0, l2T = 0, l3T = 0;

        const updatedChallenges = challengesData.map((ch: any) => {
          const solved = earnedIds.has(ch.id);
          if (solved) {
            solvedCount++;
            pointsEarned += ch.points;
            if (ch.level === 'L1') l1S++;
            else if (ch.level === 'L2') l2S++;
            else if (ch.level === 'L3') l3S++;
          }

          if (ch.level === 'L1') l1T++;
          else if (ch.level === 'L2') l2T++;
          else if (ch.level === 'L3') l3T++;

          return {
            ...ch,
            solved,
            icon: ch.level === 'L1' ? 'Lock' : ch.level === 'L2' ? 'Key' : 'Cpu'
          };
        });

        setChallenges(updatedChallenges);
        setStats({
          solved: solvedCount,
          total: updatedChallenges.length,
          points: pointsEarned,
          l1Solved: l1S,
          l2Solved: l2S,
          l3Solved: l3S,
          l1Total: l1T,
          l2Total: l2T,
          l3Total: l3T
        });
      } catch (err) {
        console.error('Failed to load challenges:', err);
      } finally {
        setLoading(false);
        setAnimateTrigger(prev => prev + 1);
      }
    };

    loadChallengesData();
  }, [connected, publicKey]);

  // When filter changes, trigger re-animation of list items
  const handleFilterChange = (newLevel: string) => {
    setFilter(newLevel);
    setAnimateTrigger(prev => prev + 1);
  };

  const filteredChallenges = challenges.filter(c => {
    const matchesLevel = filter === 'all' || c.level === filter;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vulnerability.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#030303] pt-24 pb-16 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,241,149,0.03),transparent_70%)] pointer-events-none"></div>
        <div className="text-center max-w-md p-8 bg-zinc-950/80 border border-white/5 rounded-3xl backdrop-blur-md relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-400">
            <Icon name="Lock" className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 font-display">Connect Wallet</h1>
          <p className="text-zinc-400 leading-relaxed">Please connect your Solana wallet and log in to view challenges and track your security exploits progress.</p>
        </div>
      </div>
    );
  }

  const solvedPercentage = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-28 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14F195]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* LeetCode-style Hero Stats Panel */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12 animate-fade-in-up">
          {/* Main Solved Stats */}
          <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-[#14F195]/5 transition-colors duration-500"></div>
            <div>
              <span className="text-zinc-500 text-xs font-mono tracking-wider uppercase">Your Progress</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold font-display">{stats.solved}</span>
                <span className="text-zinc-500 font-semibold">/ {stats.total} Solved</span>
              </div>
              <p className="text-xs text-[#14F195] font-mono mt-3 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#14F195]"></span>
                {solvedPercentage}% Completion Rate
              </p>
            </div>
            
            {/* Circular Progress Indicator */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="38" className="stroke-zinc-900" strokeWidth="8" fill="transparent" />
                <circle cx="48" cy="48" r="38" className="stroke-[#14F195] transition-all duration-1000 ease-out" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - stats.solved / (stats.total || 1))}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-bold font-mono">{solvedPercentage}%</span>
            </div>
          </div>

          {/* Difficulty Breakdown Panel */}
          <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-lg">
            <span className="text-zinc-500 text-xs font-mono tracking-wider uppercase block mb-4">Difficulty Breakdown</span>
            <div className="space-y-3.5">
              {/* L1 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>L1 Beginner
                  </span>
                  <span className="text-zinc-400">{stats.l1Solved}/{stats.l1Total}</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${stats.l1Total > 0 ? (stats.l1Solved / stats.l1Total) * 100 : 0}%` }}></div>
                </div>
              </div>

              {/* L2 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-amber-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>L2 Intermediate
                  </span>
                  <span className="text-zinc-400">{stats.l2Solved}/{stats.l2Total}</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${stats.l2Total > 0 ? (stats.l2Solved / stats.l2Total) * 100 : 0}%` }}></div>
                </div>
              </div>

              {/* L3 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-rose-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>L3 Advanced
                  </span>
                  <span className="text-zinc-400">{stats.l3Solved}/{stats.l3Total}</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-700" style={{ width: `${stats.l3Total > 0 ? (stats.l3Solved / stats.l3Total) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Points & Score Card */}
          <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-lg flex items-center justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#9945FF]/5 rounded-full blur-2xl"></div>
            <div>
              <span className="text-zinc-500 text-xs font-mono tracking-wider uppercase">StudyChain Reputation</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-[#9945FF] font-display">{stats.points}</span>
                <span className="text-zinc-400 font-semibold font-mono">NAS Score</span>
              </div>
              <p className="text-xs text-zinc-400 mt-3 font-medium">Accumulate points by solving challenges to climb the Leaderboard.</p>
            </div>
            <div className="w-14 h-14 bg-[#9945FF]/10 border border-[#9945FF]/20 rounded-2xl flex items-center justify-center text-[#9945FF] group-hover:rotate-12 transition-transform duration-300">
              <Icon name="Trophy" className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Filter controls + Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-fade-in-up delay-75">
          <div className="flex flex-wrap gap-2.5">
            {['all', 'L1', 'L2', 'L3'].map(level => (
              <button
                key={level}
                onClick={() => handleFilterChange(level)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-tight transition-all duration-200 ${
                  filter === level
                    ? 'bg-white text-black shadow-md scale-105'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-white/5 hover:border-white/15'
                }`}
              >
                {level === 'all' ? 'All Challenges' : level === 'L1' ? 'L1 Beginner' : level === 'L2' ? 'L2 Intermediate' : 'L3 Advanced'}
              </button>
            ))}
          </div>

          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Icon name="Search" className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search challenges or vulnerabilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-white/5 hover:border-white/10 focus:border-white/20 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-24 bg-zinc-950/20 border border-white/5 rounded-3xl backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <span className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin"></span>
              <p className="text-zinc-500 font-mono text-sm">Compiling challenges...</p>
            </div>
          </div>
        ) : (
          /* LeetCode-style Challenge List Table */
          <div 
            key={animateTrigger}
            className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 text-xs font-mono uppercase tracking-wider bg-black/20">
                    <th className="py-4 px-6 font-semibold w-16 text-center">Status</th>
                    <th className="py-4 px-6 font-semibold">Title</th>
                    <th className="py-4 px-6 font-semibold hidden md:table-cell">Vulnerability Type</th>
                    <th className="py-4 px-6 font-semibold text-center w-24">Level</th>
                    <th className="py-4 px-6 font-semibold text-right w-24">Points</th>
                    <th className="py-4 px-6 font-semibold text-center w-36">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredChallenges.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-zinc-500">
                        <Icon name="Lock" className="w-8 h-8 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No challenges found matching filters</p>
                      </td>
                    </tr>
                  ) : (
                    filteredChallenges.map((challenge, idx) => {
                      const levelStyle = challenge.level === 'L1' 
                        ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' 
                        : challenge.level === 'L2'
                        ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                        : 'text-rose-500 bg-rose-500/10 border-rose-500/20';

                      return (
                        <tr 
                          key={challenge.id} 
                          className="group hover:bg-white/[0.02] transition-colors duration-200"
                          style={{ 
                            animationDelay: `${idx * 40}ms`,
                            opacity: 0,
                            animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                          }}
                        >
                          {/* Status */}
                          <td className="py-5 px-6 text-center">
                            {challenge.solved ? (
                              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                <Icon name="Check" className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <span className="text-zinc-700 font-mono">-</span>
                            )}
                          </td>

                          {/* Title & Description */}
                          <td className="py-5 px-6">
                            <div className="flex flex-col">
                              <Link 
                                to={`/challenge/${challenge.id}`} 
                                className="font-bold text-zinc-100 hover:text-white font-display text-base transition-colors flex items-center gap-2"
                              >
                                {challenge.title}
                                {challenge.solved && (
                                  <span className="text-[10px] font-bold font-mono tracking-wider text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase">
                                    Solved
                                  </span>
                                )}
                              </Link>
                              <span className="text-xs text-zinc-400 mt-1 line-clamp-1 group-hover:text-zinc-300 transition-colors">
                                {challenge.description}
                              </span>
                            </div>
                          </td>

                          {/* Vulnerability type */}
                          <td className="py-5 px-6 hidden md:table-cell">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-white/5 text-xs text-zinc-300 font-medium font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                              {challenge.vulnerability}
                            </span>
                          </td>

                          {/* Level */}
                          <td className="py-5 px-6 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold border ${levelStyle}`}>
                              {challenge.level}
                            </span>
                          </td>

                          {/* Points */}
                          <td className="py-5 px-6 text-right font-bold font-mono text-zinc-100">
                            +{challenge.points}
                          </td>

                          {/* Action Button */}
                          <td className="py-5 px-6 text-center">
                            <Link
                              to={`/challenge/${challenge.id}`}
                              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all w-full ${
                                challenge.solved
                                  ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/5'
                                  : 'bg-white hover:bg-zinc-200 text-black shadow-sm font-extrabold'
                              }`}
                            >
                              {challenge.solved ? 'Review Code' : 'Solve Exploit'}
                              <Icon name="ArrowRight" className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
