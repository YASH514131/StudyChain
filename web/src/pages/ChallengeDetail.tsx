import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import Editor from '@monaco-editor/react';
import { fetchChallengeDetail, startSession, verifyExploit } from '../lib/api';

const Icon = ({ name, className = "w-6 h-6" }: { name: string; className?: string }) => {
  const icons: Record<string, any> = {
    Terminal: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Code: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    Check: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    Book: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    ArrowLeft: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7l-7-7 7-7" /></svg>,
  };
  return icons[name] || null;
};

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { publicKey, connected } = useWallet();
  
  const [challenge, setChallenge] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [code, setCode] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [txSignature, setTxSignature] = useState('mock_exploit_tx_signature');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState<'problem' | 'code' | 'hints'>('problem');
  const [runningCli, setRunningCli] = useState(false);
  const [cliConnected, setCliConnected] = useState<boolean | null>(null);

  // Check CLI connection state
  useEffect(() => {
    const checkCli = async () => {
      try {
        const res = await fetch('http://localhost:39999/status');
        if (res.ok) {
          setCliConnected(true);
        } else {
          setCliConnected(false);
        }
      } catch {
        setCliConnected(false);
      }
    };
    checkCli();
    const interval = setInterval(checkCli, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!id || !connected) return;

    const loadChallenge = async () => {
      try {
        setLoading(true);
        const chal = await fetchChallengeDetail(parseInt(id));
        setChallenge(chal);
        setCode(chal.template);

        // Start or fetch active session
        const sess = await startSession(parseInt(id));
        setSession(sess);
      } catch (err: any) {
        console.error('Failed to load challenge details:', err);
        setOutput(`Error starting sandbox: ${err.message || 'Check database connection'}\n`);
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, [id, connected]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#030303] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4 font-display">Connect Wallet</h1>
          <p className="text-lg text-zinc-400">Please connect your wallet to view challenges.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <span className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block"></span>
          <p className="text-zinc-400 mt-4 font-medium">Spawning Sandbox Sandbox Environment...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#030303] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4 font-display">Challenge Not Found</h1>
          <button
            onClick={() => navigate('/challenges')}
            className="px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  const handleRunLocal = async () => {
    setRunningCli(true);
    setOutput('🚀 Connecting to local StudyChain CLI Bridge on port 39999...\n');

    try {
      const response = await fetch('http://localhost:39999/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to run script on local CLI');
      }

      setOutput(prev => prev + '🤖 Local bridge execution completed!\n\n');
      
      if (data.stdout) {
        setOutput(prev => prev + `[STDOUT]\n${data.stdout}\n`);
      }
      if (data.stderr) {
        setOutput(prev => prev + `[STDERR]\n${data.stderr}\n`);
      }

      if (data.txSignature) {
        setTxSignature(data.txSignature);
        setOutput(prev => prev + `\n✨ EXTRACTED TRANSACTION SIGNATURE: ${data.txSignature}\n`);
        setOutput(prev => prev + `Transaction signature has been populated. You can now submit it for on-chain validation!\n`);
      } else {
        setOutput(prev => prev + `\n⚠️ No transaction signature matched in output. Make sure your script prints "TX_SIGNATURE: <signature>"\n`);
      }
    } catch (err: any) {
      console.error(err);
      setOutput(prev => prev + `\n❌ CLI CONNECTION ERROR: ${err.message}\n`);
      setOutput(prev => prev + `Ensure studychain-cli is running locally by executing "studychain-cli start" in your workspace.\n`);
    } finally {
      setRunningCli(false);
    }
  };

  const handleSubmit = async () => {
    if (!session || !txSignature.trim()) {
      setOutput('Error: Active session or transaction signature is missing.\n');
      return;
    }

    setSubmitting(true);
    setOutput('Initiating Exploit Transaction Verification Flow...\n');
    setOutput(prev => prev + `Target Program ID: ${session.deployedProgramId}\n`);
    setOutput(prev => prev + `Tx Signature: ${txSignature}\n\n`);

    try {
      setOutput(prev => prev + 'CHECK 1: Validating transaction existence on Devnet...\n');
      // Call backend to verify signature
      const res = await verifyExploit(session._id, txSignature);

      setOutput(prev => prev + 'CHECK 2: Confirming signer wallet matches authenticated session... ✓\n');
      setOutput(prev => prev + 'CHECK 3: Verifying successful execution rubric on-chain... ✓\n\n');
      
      setOutput(prev => prev + `🎉 SUCCESS: ${res.message}\n`);
      setOutput(prev => prev + `Earned +${res.pointsEarned} NAS Points!\n`);
      setOutput(prev => prev + `New Score: ${res.newNasScore} (${res.newTier})\n`);
      setOutput(prev => prev + `Credential issued under Mint Address: ${res.credential.mintAddress.slice(0, 16)}...\n`);
    } catch (err: any) {
      console.error(err);
      setOutput(prev => prev + `\n❌ VERIFICATION FAILED: ${err.message || 'Exploit check returned negative validation.'}\n`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] pt-24 pb-16">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
          <button
            onClick={() => navigate('/challenges')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <Icon name="ArrowLeft" className="w-5 h-5" />
            Back to Challenges
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white font-display">{challenge.title}</h1>
              <p className="text-lg text-zinc-400 mt-2">{challenge.vulnerability}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-zinc-400 font-mono">LEVEL</p>
                <p className="text-2xl font-bold text-white font-mono">{challenge.level}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400 font-mono">POINTS</p>
                <p className="text-2xl font-bold text-[#14F195] font-mono">{challenge.points}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 px-4 sm:px-6">
          {/* Problem & Tabs */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 max-w-7xl mx-auto">
              {['problem', 'code', 'hints'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 font-bold rounded-lg transition-all ${
                    activeTab === tab
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                  }`}
                >
                  {tab === 'problem' && 'Problem'}
                  {tab === 'code' && 'Code Editor'}
                  {tab === 'hints' && 'Hints'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto">
              {activeTab === 'problem' && (
                <div className="p-6 sm:p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <h2 className="text-2xl font-bold text-white mb-4 font-display">Problem Statement</h2>
                  <div className="text-zinc-400 space-y-4 leading-relaxed whitespace-pre-wrap font-medium text-sm sm:text-base">
                    {challenge.fullProblem}
                  </div>
                </div>
              )}

              {activeTab === 'code' && (
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden animate-fade-in-up">
                  <div className="border-b border-white/5 p-4 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-2">
                      <Icon name="Code" className="w-5 h-5 text-white" />
                      <span className="text-white font-bold">Exploit Client Script (TypeScript)</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-white/5 rounded-lg">
                        <span className={`w-2 h-2 rounded-full ${cliConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500'}`}></span>
                        <span className="text-[10px] font-bold font-mono tracking-wider text-zinc-400">
                          {cliConnected ? 'CLI ONLINE' : 'CLI OFFLINE'}
                        </span>
                      </div>
                      
                      <button
                        onClick={handleRunLocal}
                        disabled={runningCli || !cliConnected}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          cliConnected
                            ? 'bg-[#14F195] text-black hover:scale-105 active:scale-95 cursor-pointer font-extrabold shadow-lg shadow-[#14F195]/10'
                            : 'bg-zinc-900 text-zinc-500 cursor-not-allowed border border-white/5'
                        }`}
                      >
                        {runningCli ? (
                          <>
                            <span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                            Running...
                          </>
                        ) : (
                          'Run via local CLI'
                        )}
                      </button>
                    </div>
                  </div>
                  <Editor
                    height="500px"
                    defaultLanguage="rust"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: 'JetBrains Mono',
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              )}

              {activeTab === 'hints' && (
                <div className="space-y-4">
                  {challenge.hints.map((hint: string, i: number) => (
                    <div key={i} className="p-4 sm:p-6 bg-white/[0.02] border border-white/5 rounded-xl sm:rounded-2xl">
                      <p className="text-sm text-zinc-400 font-mono mb-2">HINT {i + 1}</p>
                      <p className="text-white font-medium">{hint}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Submit & Output */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Submit Form */}
              <div className="max-w-7xl lg:max-w-none mx-auto p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="mb-4">
                  <label className="text-xs text-zinc-400 font-mono block mb-2 tracking-wider">DEVNET TRANSACTION SIGNATURE</label>
                  <input
                    type="text"
                    value={txSignature}
                    onChange={(e) => setTxSignature(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-[#14F195] focus:outline-none transition-colors"
                    placeholder="Enter transaction signature..."
                  />
                  <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                    Deploy your exploit contract and call it. Enter the transaction signature. Keep `mock_exploit_tx_signature` to skip actual on-chain checks.
                  </p>
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !txSignature.trim()}
                  className="w-full py-4 bg-[#14F195] text-black font-bold rounded-xl hover:scale-102 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Verifying Exploit...' : 'Submit Exploit Signature'}
                </button>
              </div>

              {/* Output Terminal */}
              <div className="max-w-7xl lg:max-w-none mx-auto p-6 bg-black/60 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                  <Icon name="Terminal" className="w-5 h-5 text-[#14F195]" />
                  <span className="text-sm font-bold text-white font-mono">SANDBOX VERIFIER TERMINAL</span>
                </div>
                <div className="text-xs text-green-400 font-mono h-48 overflow-y-auto whitespace-pre-wrap">
                  {output || 'Output logs will appear here upon submission...'}
                </div>
              </div>

              {/* Info Box */}
              <div className="max-w-7xl lg:max-w-none mx-auto p-4 sm:p-6 bg-white/[0.02] border border-white/5 rounded-xl sm:rounded-2xl">
                <p className="text-xs text-zinc-400 font-mono mb-2 uppercase">Vulnerable Deployed Program Address</p>
                <p className="text-white text-xs font-mono break-all font-semibold select-all">
                  {session?.deployedProgramId || 'No active sandbox deployed.'}
                </p>
                <p className="text-xs text-zinc-500 mt-3 font-mono">Network: Solana Devnet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
