import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { fetchProfile } from '../lib/api';

const Icon = ({ name, className = "w-6 h-6" }: { name: string; className?: string }) => {
  const icons: Record<string, any> = {
    Wallet: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    Trophy: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    Code: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    Check: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    ArrowRight: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
    Shield: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  };
  return icons[name] || null;
};

export default function Dashboard() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicKey) return;

    const getDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch SOL balance
        if (connection) {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        }
        
        // Fetch profile data (developer stats + earned credentials)
        const data = await fetchProfile(publicKey.toString());
        setProfileData(data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, [publicKey, connection]);

  const developer = profileData?.developer;
  const credentials = profileData?.credentials || [];

  const stats = [
    { label: 'NAS Score', value: developer?.nasScore !== undefined ? developer.nasScore.toString() : '0', icon: 'Trophy', color: 'text-[#14F195]' },
    { label: 'Tier', value: developer?.tier || 'Initiate', icon: 'Shield', color: 'text-white' },
    { label: 'Credentials', value: credentials.length.toString(), icon: 'Check', color: 'text-white' },
    { label: 'SOL Balance', value: balance.toFixed(2), icon: 'Wallet', color: 'text-white' },
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Welcome Section */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 font-display">Welcome back!</h1>
          <p className="text-lg text-zinc-400 font-medium font-mono">
            {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 sm:p-8 bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-3xl hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-zinc-400 font-medium">{stat.label}</span>
                <Icon name={stat.icon} className="w-5 h-5 text-zinc-500" />
              </div>
              <div className={`text-2xl sm:text-3xl font-bold ${stat.color} font-display truncate`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 font-display">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Link to="/challenges" className="p-8 bg-white/[0.04] border border-white/10 rounded-2xl hover:bg-white/[0.06] transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 font-display">Start Challenge</h3>
                  <p className="text-sm text-zinc-400">Browse and solve security exploit challenges</p>
                </div>
                <Icon name="ArrowRight" className="w-6 h-6 text-white" />
              </div>
            </Link>
            <a href={`https://explorer.solana.com/address/${publicKey?.toString()}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="p-8 bg-white/[0.04] border border-white/10 rounded-2xl hover:bg-white/[0.06] transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 font-display">Solana Explorer</h3>
                  <p className="text-sm text-zinc-400">View your wallet transactions on Devnet</p>
                </div>
                <Icon name="ArrowRight" className="w-6 h-6 text-white" />
              </div>
            </a>
          </div>
        </div>

        {/* Earned Credentials Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 font-display">Earned Credentials</h2>
          {loading ? (
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
              <span className="w-6 h-6 inline-block border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            </div>
          ) : credentials.length === 0 ? (
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
              <p className="text-zinc-400 font-medium">No credentials earned yet. Head to the challenges to solve one!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {credentials.map((cred: any, index: number) => (
                <div key={index} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#14F195]/15 border border-[#14F195]/30 rounded-xl flex items-center justify-center">
                      <Icon name="Shield" className="w-6 h-6 text-[#14F195]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">{cred.title}</h3>
                      <p className="text-xs text-zinc-500 font-mono mt-1">
                        LEVEL: {cred.level} | ISSUED BY: {cred.issuingOrganization}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={`https://explorer.solana.com/tx/${cred.transactionSignature}?cluster=devnet`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg transition-colors shrink-0"
                  >
                    Verify On-Chain
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
