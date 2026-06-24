import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Navbar() {
  const { connected, publicKey } = useWallet();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#030303]/80 backdrop-blur-2xl border-b border-white/10 py-3 lg:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to={connected ? "/dashboard" : "/"} className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-black flex items-center justify-center font-bold text-lg sm:text-xl rounded-lg sm:rounded-[1rem] font-display tracking-tighter">
            SC
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white">StudyChain</span>
        </Link>

        {/* Navigation Links */}
        {connected && (
          <div className="hidden lg:flex items-center gap-10 text-sm font-semibold text-zinc-400">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/challenges" className="hover:text-white transition-colors">Challenges</Link>
            <a href="#" className="hover:text-white transition-colors">Profile</a>
            <a href="#" className="hover:text-white transition-colors">Leaderboard</a>
          </div>
        )}

        {/* Wallet Button */}
        <div className="flex items-center gap-3">
          {connected && publicKey && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-xs text-zinc-400 font-mono">
                {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
              </span>
            </div>
          )}
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
}
