import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import Navbar from './components/Navbar';
import PremiumApp from './home';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import { getNonce, loginWithWallet } from './lib/api';

function ProtectedRoute({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
  const { connected } = useWallet();
  return connected && isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

export default function App() {
  const { connected, publicKey, signMessage, disconnect } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!connected) {
      localStorage.removeItem('studychain_token');
      localStorage.removeItem('studychain_wallet');
      setIsAuthenticated(false);
      setAuthError(null);
      return;
    }

    const savedWallet = localStorage.getItem('studychain_wallet');
    const token = localStorage.getItem('studychain_token');

    if (publicKey && savedWallet === publicKey.toString() && token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [connected, publicKey]);

  const handleAuthenticate = async () => {
    if (!publicKey) {
      setAuthError('Wallet public key is not available. Please reconnect your wallet.');
      return;
    }
    if (!signMessage) {
      setAuthError('Your connected wallet does not support message signing. Please use Phantom or a compatible wallet.');
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const walletStr = publicKey.toString();
      
      // Step 1: Get the one-time nonce from the backend
      const nonce = await getNonce(walletStr);
      
      // Step 2: Sign the authentication message
      const message = `Welcome to StudyChain! Sign this message to log in. Nonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      const signature = await signMessage(encodedMessage);
      
      // Step 3: Login on backend
      const response = await loginWithWallet(walletStr, signature, message);
      
      // Save authenticated wallet status
      localStorage.setItem('studychain_wallet', walletStr);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Authentication failed:', err);
      setAuthError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <BrowserRouter>
      {connected && isAuthenticated && <Navbar />}
      
      {/* Wallet Signature Auth Overlay */}
      {connected && !isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl px-4">
          <div className="w-full max-w-md p-8 bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Ambient Light Accent */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#14F195]/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="text-center relative z-10">
              {/* Icon Container */}
              <div className="w-20 h-20 mx-auto mb-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3 font-display">Sign In Required</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
                To access StudyChain challenges and save your progress on-chain, please sign a message in your wallet to verify ownership.
              </p>

              {authError && (
                <div className="p-4 mb-6 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 text-xs font-medium font-mono text-left">
                  ⚠️ {authError}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAuthenticate}
                  disabled={isAuthenticating}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAuthenticating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                      Authenticating...
                    </>
                  ) : (
                    'Sign Login Message'
                  )}
                </button>
                <button
                  onClick={() => disconnect()}
                  className="w-full py-3 bg-zinc-900 text-zinc-400 hover:text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={connected && isAuthenticated ? <Navigate to="/dashboard" replace /> : <PremiumApp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenges"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Challenges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenge/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ChallengeDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
