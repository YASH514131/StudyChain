import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import swigglyVideo from './assets/swiggly.mp4';

// --- Bulletproof SVG Icons (No external library crashes) ---
const Icon = ({ name, className = "w-6 h-6" }: { name: string; className?: string }) => {
  const icons: Record<string, any> = {
    ArrowRight: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
    Building: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    Terminal: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Lock: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    Key: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
    Cpu: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
    Code: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    Wallet: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    Check: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    Shield: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Trophy: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    Book: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    Activity: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Fingerprint: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
  };

  return icons[name] || null;
};

// --- Live Terminal Component (Zero Layout Shift) ---
const ActiveTerminal = () => {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState("");

  const fullCommand = "studychain submit --tx 5xTq...8mP";

  useEffect(() => {
    if (step === 0) {
      if (typedText.length < fullCommand.length) {
        const timeout = setTimeout(() => {
          setTypedText(fullCommand.slice(0, typedText.length + 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setStep(1), 500);
        return () => clearTimeout(timeout);
      }
    }

    const sequenceDelays = [0, 800, 600, 600, 500, 1000, 1200, 4000];

    if (step > 0 && step < sequenceDelays.length) {
      const timeout = setTimeout(() => {
        if (step === sequenceDelays.length - 1) {
          setStep(0);
          setTypedText("");
        } else {
          setStep(s => s + 1);
        }
      }, sequenceDelays[step]);
      return () => clearTimeout(timeout);
    }
  }, [step, typedText, fullCommand]);

  return (
    <div className="bg-[#0A0A0A] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden h-full flex flex-col transform translate-z-0">
      <div className="bg-white/[0.02] px-4 md:px-6 py-4 md:py-5 border-b border-white/5 flex gap-2 items-center">
        <div className="w-3 h-3 rounded-full bg-white/20"></div>
        <div className="w-3 h-3 rounded-full bg-white/20"></div>
        <div className="w-3 h-3 rounded-full bg-white/20"></div>
        <div className="ml-auto text-[10px] md:text-xs font-mono text-zinc-600 tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#14F195]/80 animate-pulse"></span>
          DEVNET
        </div>
      </div>

      <div className="p-5 sm:p-8 font-mono text-xs sm:text-[15px] leading-loose overflow-x-auto text-zinc-400 flex-grow relative min-h-[300px] sm:min-h-[380px]">
        <div className="flex gap-2 sm:gap-3 items-center min-h-[24px] sm:min-h-[28px] whitespace-nowrap">
          <span className="text-white">➜</span>
          <span className="text-white font-bold">
            {typedText}
            {step === 0 && <span className="animate-[pulse_1s_ease-in-out_infinite] ml-1 text-zinc-400">|</span>}
          </span>
        </div>

        <div className={`mt-4 sm:mt-5 text-zinc-500 transition-all duration-300 transform whitespace-nowrap ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>Fetching on-chain state...</div>
        <div className={`text-zinc-300 transition-all duration-300 transform whitespace-nowrap ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>✓ Validating PDA signatures</div>
        <div className={`text-zinc-300 transition-all duration-300 transform whitespace-nowrap ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>✓ State transitions match rubric</div>
        <div className={`text-zinc-300 transition-all duration-300 transform whitespace-nowrap ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>✓ Build hash uniqueness confirmed</div>

        <div className={`text-white font-bold mt-5 sm:mt-6 text-sm sm:text-lg border-l-2 border-[#14F195] pl-3 py-1 bg-[#14F195]/5 transition-all duration-300 transform whitespace-nowrap ${step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          Verification Passed.
        </div>

        <div className={`mt-4 text-zinc-500 flex items-center gap-2 transition-all duration-300 transform whitespace-nowrap ${step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <span className={`inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white/80 rounded-full ${step >= 6 ? 'animate-spin' : ''}`}></span>
          Minting Soulbound Credential...
        </div>
      </div>
    </div>
  );
};

export default function PremiumApp() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [pricingTab, setPricingTab] = useState('developers');

  // Hero Continuous Typing State
  const heroText = "LEARN.\nBUILD.\nPROVE.";
  const [heroTypedIndex, setHeroTypedIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const wallet = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    // 1. Navigation scroll state
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // 3. Hero Typing Looping Effect
  useEffect(() => {
    let timeoutId: any;

    const loop = () => {
      if (!isDeleting) {
        // Typing forward
        if (heroTypedIndex < heroText.length) {
          let delay = 100;
          if (heroTypedIndex > 0 && heroText[heroTypedIndex - 1] === '.') delay = 600;
          else if (heroText[heroTypedIndex] === '\n') delay = 400;

          timeoutId = setTimeout(() => setHeroTypedIndex(heroTypedIndex + 1), delay);
        } else {
          // Done typing, wait 4 seconds before deleting
          timeoutId = setTimeout(() => setIsDeleting(true), 4000);
        }
      } else {
        // Deleting backwards
        if (heroTypedIndex > 0) {
          // Fast backspace
          timeoutId = setTimeout(() => setHeroTypedIndex(heroTypedIndex - 1), 30);
        } else {
          // Done deleting, wait a half second before typing again
          setIsDeleting(false);
          timeoutId = setTimeout(() => { }, 500);
        }
      }
    };

    loop();

    return () => clearTimeout(timeoutId);
  }, [heroTypedIndex, isDeleting, heroText]);

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

    html { scroll-behavior: smooth; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #030303;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    
    .font-display { font-family: 'Outfit', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    
    .text-gradient-hero {
      background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.9) 40%, rgba(100, 100, 100, 0.2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .text-gradient-heading {
      background: linear-gradient(135deg, #FFFFFF 0%, #777777 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: border-color 0.4s ease, background 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }
    
    .glass-card:hover {
      border-color: rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.03);
    }

    .reveal {
      opacity: 0;
      transform: translate3d(0, 40px, 0);
      transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: opacity, transform;
    }
    .reveal.active {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    .delay-100 { transition-delay: 100ms; }
    .delay-200 { transition-delay: 200ms; }
    .delay-300 { transition-delay: 300ms; }
    .delay-400 { transition-delay: 400ms; }
    .delay-500 { transition-delay: 500ms; }

    .perf-glow-top { background: radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, transparent 60%); }
    .perf-glow-bottom { background: radial-gradient(circle at center, rgba(20,241,149,0.04) 0%, transparent 60%); }
  `;

  return (
    <div className="min-h-screen bg-[#030303] relative selection:bg-white/20 selection:text-white overflow-hidden">
      <style>{customStyles}</style>

      {/* GPU Optimized Ambient Backgrounds */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[200vw] h-[100vh] lg:w-[1200px] lg:h-[1000px] perf-glow-top pointer-events-none z-0 transform translate-z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[150vw] h-[100vh] lg:w-[1000px] lg:h-[1000px] perf-glow-bottom pointer-events-none z-0 transform translate-z-0"></div>

      {/* Background Video */}
      <div className="absolute top-0 left-0 w-full h-[90vh] lg:h-screen overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70 filter brightness-100 mix-blend-screen scale-[1.4] origin-center"
        >
          <source src={swigglyVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/20 to-[#030303]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-[#030303]/80 backdrop-blur-2xl border-white/10 py-3 lg:py-4' : 'bg-transparent border-transparent py-5 lg:py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-black flex items-center justify-center font-bold text-lg sm:text-xl rounded-lg sm:rounded-[1rem] font-display tracking-tighter">SC</div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white">StudyChain</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-sm font-semibold text-zinc-400">
            <a href="#protocol" className="hover:text-white transition-colors">Protocol</a>
            <a href="#tracks" className="hover:text-white transition-colors">Challenges</a>
            <a href="#nas" className="hover:text-white transition-colors">NAS</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="hidden sm:flex items-center gap-3 sm:gap-5">
            <button onClick={() => setVisible(true)} className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Log In</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-[90vh] lg:min-h-screen flex flex-col items-center justify-center pt-32 pb-16 lg:pb-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">

          <div className="reveal inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/10 bg-white/5 text-[10px] sm:text-xs font-mono font-medium text-zinc-300 mb-8 sm:mb-12 tracking-widest uppercase backdrop-blur-md">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse"></span>
            Protocol v1.0 Live
          </div>

          {/* Animated Typing Text - Zero Layout Shift Technique */}
          <div className="relative w-full flex justify-center reveal delay-100 mb-6 sm:mb-8">
            {/* Invisible Placeholder to permanently reserve exact height and width */}
            <h1 className="text-[3.5rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[10rem] leading-[0.85] font-extrabold tracking-[-0.04em] font-display opacity-0 pointer-events-none whitespace-pre-line text-left sm:text-center">
              {heroText}
            </h1>

            {/* Visible Absolute Typing Layer */}
            <h1 className="absolute top-0 text-[3.5rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[10rem] leading-[0.85] font-extrabold tracking-[-0.04em] font-display whitespace-pre-line text-left sm:text-center flex justify-center w-full">
              <span>
                <span className="text-gradient-hero">{heroText.slice(0, heroTypedIndex)}</span>
                <span className="animate-[pulse_1s_ease-in-out_infinite] text-zinc-600 font-light -ml-1 sm:-ml-2">|</span>
              </span>
            </h1>
          </div>

          <p className="reveal delay-200 text-lg sm:text-xl md:text-2xl text-zinc-400 font-medium max-w-[90%] sm:max-w-3xl leading-relaxed mb-10 sm:mb-14 px-2">
            Your wallet is your resume. Prove technical capability through real coding challenges and carry the proof permanently on-chain.
          </p>

          <div className="reveal delay-300 flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto px-4 sm:px-0">
            <button onClick={() => setVisible(true)} className="w-full sm:w-auto bg-white text-black px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Start Building <Icon name="ArrowRight" className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 backdrop-blur-md">
              <Icon name="Building" className="w-5 h-5" /> Issue Credentials
            </button>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-20 lg:py-32 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16 lg:mb-24 max-w-3xl reveal">
            <div className="font-mono text-[10px] sm:text-xs text-zinc-500 tracking-widest uppercase mb-4 sm:mb-5">The Broken Signal</div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-gradient-heading mb-6 sm:mb-8 font-display">Knowledge is free.<br />Proof is impossible.</h2>
            <p className="text-lg sm:text-xl text-zinc-400 font-medium leading-relaxed">AI solves text assessments in seconds. Resumes are padded. Traditional certificates are centralized PDFs that 404 when the company shuts down.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="reveal delay-100 p-8 sm:p-10 lg:p-14 rounded-[2rem] lg:rounded-[2.5rem] glass-card group">
              <Icon name="Code" className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-300 mb-8 sm:mb-10 group-hover:text-white transition-colors" />
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 lg:mb-8 font-display tracking-tight">For Developers</h3>
              <ul className="space-y-6 lg:space-y-8">
                <li className="reveal delay-200">
                  <strong className="text-white text-lg sm:text-xl block mb-2 font-display">GitHub is gameable</strong>
                  <p className="text-zinc-400 leading-relaxed font-medium text-sm sm:text-base">Anyone can copy-paste repos. Commits don't prove you understand protocol execution under pressure.</p>
                </li>
                <li className="reveal delay-300">
                  <strong className="text-white text-lg sm:text-xl block mb-2 font-display">AI beats text quizzes</strong>
                  <p className="text-zinc-400 leading-relaxed font-medium text-sm sm:text-base">Certificates earned by passing multiple-choice quizzes are now completely worthless as a signal of competence.</p>
                </li>
              </ul>
            </div>

            <div className="reveal delay-200 p-8 sm:p-10 lg:p-14 rounded-[2rem] lg:rounded-[2.5rem] glass-card group">
              <Icon name="Building" className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-300 mb-8 sm:mb-10 group-hover:text-white transition-colors" />
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 lg:mb-8 font-display tracking-tight">For Organizations</h3>
              <ul className="space-y-6 lg:space-y-8">
                <li className="reveal delay-300">
                  <strong className="text-white text-lg sm:text-xl block mb-2 font-display">Centralized Dependency</strong>
                  <p className="text-zinc-400 leading-relaxed font-medium text-sm sm:text-base">If the issuing platform dies, URLs 404. No trustless verification exists without pinging their centralized server.</p>
                </li>
                <li className="reveal delay-400">
                  <strong className="text-white text-lg sm:text-xl block mb-2 font-display">Unverified Talent</strong>
                  <p className="text-zinc-400 leading-relaxed font-medium text-sm sm:text-base">Web3 protocols distribute millions in grants without scalable technical filters to block resume-padders.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROTOCOL ARCHITECTURE */}
      <section id="protocol" className="py-20 lg:py-32 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16 lg:mb-24 max-w-4xl reveal">
            <div className="font-mono text-[10px] sm:text-xs text-zinc-500 tracking-widest uppercase mb-4 sm:mb-5">The Solution</div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-gradient-heading mb-6 sm:mb-8 font-display">Prove it or it didn't happen.</h2>
            <p className="text-lg sm:text-xl text-zinc-400 font-medium leading-relaxed">StudyChain replaces 'Watch video → Pass quiz' with 'Write code → Deploy on-chain → Mint Soulbound Credential'.</p>
          </div>

          <div className="space-y-24 lg:space-y-32">
            {/* Developer Flow Block */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
              <div className="lg:w-1/2 w-full">
                <div className="reveal inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-card text-white font-mono text-[10px] tracking-widest mb-6 sm:mb-8 border-white/10 uppercase">Side 1: Developers</div>
                <h3 className="reveal delay-100 text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 lg:mb-10 tracking-tight font-display">Build real things.</h3>

                <div className="space-y-8 sm:space-y-10 relative before:absolute before:inset-0 before:ml-[19px] sm:before:ml-[23px] before:w-px before:bg-white/10">
                  {[
                    { title: "Receive Challenge", desc: "Real tasks. Example: 'Deploy an SPL token with custom vesting.'" },
                    { title: "Deploy & Submit", desc: "Write locally, deploy to Devnet, submit Program ID." },
                    { title: "Automated Verification", desc: "Engine inspects on-chain state to confirm execution." },
                    { title: "Soulbound Mint", desc: "Credential minted permanently to your wallet." }
                  ].map((step, i) => (
                    <div className={`reveal delay-${(i + 2) * 100} relative flex items-start gap-4 sm:gap-8`} key={i}>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-xs sm:text-sm font-bold font-mono text-white z-10 shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]">{i + 1}</div>
                      <div>
                        <h4 className="font-bold text-white text-lg sm:text-xl mb-1 sm:mb-2 font-display">{step.title}</h4>
                        <p className="text-zinc-400 font-medium text-sm sm:text-base">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Terminal */}
              <div className="lg:w-1/2 w-full reveal delay-300">
                <div className="glass-card rounded-[2rem] md:rounded-[3rem] overflow-hidden p-2 sm:p-4 shadow-2xl w-full max-w-full">
                  <ActiveTerminal />
                </div>
              </div>
            </div>

            {/* Organization Flow Block */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
              <div className="lg:w-1/2 order-2 lg:order-1 w-full reveal delay-200">
                <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-8 sm:p-12 relative overflow-hidden">
                  <h4 className="font-mono text-[10px] sm:text-xs text-zinc-500 tracking-widest uppercase mb-8 sm:mb-12">Own-Mint Architecture</h4>

                  <div className="space-y-8 sm:space-y-10 relative before:absolute before:inset-0 before:ml-[23px] sm:before:ml-[31px] before:w-px before:bg-white/10">
                    <div className="relative flex items-center gap-4 sm:gap-8 reveal delay-300">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black border border-white/20 flex items-center justify-center z-10 shadow-lg"><Icon name="Building" className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                      <div><div className="font-bold text-white text-lg sm:text-xl font-display">1. Org Wallet</div></div>
                    </div>
                    <div className="relative flex items-center gap-4 sm:gap-8 reveal delay-400">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] bg-white border border-white flex items-center justify-center z-10 shadow-[0_0_40px_rgba(255,255,255,0.15)]"><Icon name="Code" className="w-5 h-5 sm:w-6 sm:h-6 text-black" /></div>
                      <div>
                        <div className="font-bold text-white text-lg sm:text-xl font-display">2. Anchor Program</div>
                        <div className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium">Deployed under Org Identity</div>
                      </div>
                    </div>
                    <div className="relative flex items-center gap-4 sm:gap-8 reveal delay-500">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black border border-white/20 flex items-center justify-center z-10 shadow-lg"><Icon name="Wallet" className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                      <div>
                        <div className="font-bold text-white text-lg sm:text-xl font-display">3. Developer Wallet</div>
                        <div className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium">Receives credential from Org's mint</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 order-1 lg:order-2 w-full">
                <div className="reveal inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-card text-white font-mono text-[10px] tracking-widest mb-6 sm:mb-8 border-white/10 uppercase">Side 2: Organizations</div>
                <h3 className="reveal delay-100 text-4xl sm:text-5xl font-bold text-white mb-6 sm:mb-8 tracking-tight font-display text-gradient-heading">Your brand.<br />Your contract.</h3>
                <p className="reveal delay-200 text-lg sm:text-xl text-zinc-400 mb-8 sm:mb-10 font-medium leading-relaxed">
                  Organizations own their own on-chain credential program. You are an independent issuer utilizing our verification engine underneath.
                </p>
                <ul className="space-y-4 sm:space-y-5 text-zinc-300 font-medium">
                  <li className="reveal delay-300 flex items-center gap-3 sm:gap-4 text-sm sm:text-base"><Icon name="Check" className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0" /> Independent Mint Authority</li>
                  <li className="reveal delay-400 flex items-center gap-3 sm:gap-4 text-sm sm:text-base"><Icon name="Check" className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0" /> No-Code Challenge Builder</li>
                  <li className="reveal delay-500 flex items-center gap-3 sm:gap-4 text-sm sm:text-base"><Icon name="Check" className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0" /> Level 3 White-Label API Access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILL TRACKS */}
      <section id="tracks" className="py-20 lg:py-32 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16 lg:mb-24 max-w-4xl reveal">
            <div className="font-mono text-[10px] sm:text-xs text-zinc-500 tracking-widest uppercase mb-4 sm:mb-5">Launch Strategy</div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-gradient-heading mb-6 sm:mb-8 font-display">The only unfakeable proof.</h2>
            <p className="text-lg sm:text-xl text-zinc-400 font-medium leading-relaxed">We launch with security exploit challenges. No tutorials cover them. The only proof is a successful transaction on devnet.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { level: "L1 — Beginner", title: "Missing Signer Check", desc: "A vulnerable escrow contract where authority checks exist in code but are never enforced.", vuln: "Access Control", icon: "Lock" },
              { level: "L2 — Intermediate", title: "Authority Validation", desc: "Owner field is stored but never cross-checked against the signer. Spoof the authority to drain.", vuln: "Validation Flaw", icon: "Key" },
              { level: "L3 — Advanced", title: "CPI Reentrancy Attack", desc: "Exploit a lending protocol via malicious callback before internal balances update.", vuln: "Reentrancy", icon: "Cpu" }
            ].map((track, i) => (
              <div key={i} className={`reveal delay-${(i + 1) * 100} p-8 sm:p-10 rounded-[2rem] lg:rounded-[2.5rem] glass-card flex flex-col group hover:-translate-y-2 transition-transform`}>
                <div className="flex justify-between items-start mb-8 sm:mb-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name={track.icon} className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-widest border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#050505]">
                    {track.level}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-5 tracking-tight font-display">{track.title}</h3>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-8 sm:mb-10 font-medium flex-grow">{track.desc}</p>

                <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8 border-t border-white/10">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-mono">
                    <span className="text-zinc-500">Target</span><span className="text-white text-right">{track.vuln}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm font-mono">
                    <span className="text-zinc-500">Proof</span><span className="text-white font-bold">Devnet TX</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NAS SCORE & PROFILE */}
      <section id="nas" className="py-20 lg:py-32 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <div>
            <div className="reveal font-mono text-[10px] sm:text-xs text-zinc-500 tracking-widest uppercase mb-4 sm:mb-5">Continuous Measurement</div>
            <h2 className="reveal delay-100 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-gradient-heading mb-6 sm:mb-8 font-display">Network Ability Score</h2>
            <p className="reveal delay-200 text-lg sm:text-xl text-zinc-400 leading-relaxed mb-10 sm:mb-12 font-medium">Credentials are binary. NAS is continuous — an Elo-style rating that reflects challenge difficulty, completion speed, and attempt efficiency, computed from verified on-chain data.</p>
          </div>

          {/* Clean Glass Profile Mockup */}
          <div className="w-full max-w-lg mx-auto glass-card border border-white/10 rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl relative p-2 sm:p-4 reveal delay-400 hover:-translate-y-2 transition-transform duration-500">

            <div className="h-10 sm:h-14 bg-black/40 border border-white/5 rounded-[1.5rem] sm:rounded-[3rem] rounded-b-none flex items-center px-4 sm:px-6 gap-3 sm:gap-4">
              <div className="flex gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/20"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/20"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/20"></div>
              </div>
              <div className="mx-auto flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 text-[9px] sm:text-xs text-zinc-500 font-mono tracking-widest uppercase">
                <Icon name="Lock" className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> studychain.xyz/profile
              </div>
            </div>

            <div className="p-6 sm:p-10 bg-black/40 border border-t-0 border-white/5 rounded-b-[1.5rem] sm:rounded-b-[3rem]">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                  <Icon name="Code" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div>
                  <h4 className="text-xl sm:text-3xl font-bold text-white tracking-tight font-display mb-1 sm:mb-2">0xDevBuilder</h4>
                  <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#14F195]/10 text-[#14F195] text-[9px] sm:text-[10px] font-mono tracking-widest uppercase">
                    Expert Tier
                  </div>
                </div>
              </div>

              <div className="border-t border-b border-white/5 py-6 sm:py-10 mb-6 sm:mb-10 flex items-center justify-between">
                <div>
                  <div className="text-zinc-500 text-[10px] sm:text-xs font-mono tracking-widest mb-1 sm:mb-2">NAS SCORE</div>
                  <div className="text-4xl sm:text-6xl font-bold text-white tracking-tighter font-display">3,840</div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-500 text-[10px] sm:text-xs font-mono tracking-widest mb-1 sm:mb-2">RANK</div>
                  <div className="text-xl sm:text-3xl font-bold text-white font-display">Top 4%</div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-3 sm:mb-4">Verified Credentials</div>
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <Icon name="Shield" className="w-5 h-5 sm:w-6 sm:h-6 text-[#14F195]" />
                    <div>
                      <div className="font-bold text-white text-sm sm:text-base font-display">Anchor Security</div>
                      <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono mt-1 sm:mt-1.5 uppercase tracking-widest">Ackee Blockchain</div>
                    </div>
                  </div>
                  <Icon name="Check" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INTEGRITY GRID */}
      <section className="py-20 lg:py-32 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16 lg:mb-24 max-w-4xl reveal">
            <div className="font-mono text-[10px] sm:text-xs text-zinc-500 tracking-widest uppercase mb-4 sm:mb-5">Security Architecture</div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-gradient-heading mb-6 sm:mb-8 font-display">Built to be trustless.</h2>
            <p className="text-lg sm:text-xl text-zinc-400 font-medium leading-relaxed">We thought about cheating so you don't have to. Every verification primitive is designed for cryptographic certainty.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: "Fingerprint", title: "Wallet-Bound", desc: "Submissions must be signed by the claiming wallet. Cannot deploy from A and claim to B." },
              { icon: "Activity", title: "Rate Limiting", desc: "Max 3 attempts per 24 hours prevents brute-force solution farming." },
              { icon: "Lock", title: "Timestamp Auth", desc: "Transactions must fall within the active window to stop historical deployment reuse." },
              { icon: "Shield", title: "Spot-Checks", desc: "Advanced L3+ credentials involve human spot-checks on passing submissions before minting." }
            ].map((item, i) => (
              <div key={i} className={`reveal delay-${(i + 1) * 100} glass-card p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] hover:-translate-y-2`}>
                <div className="text-white mb-6 sm:mb-8">
                  <Icon name={item.icon} className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h4 className="font-bold text-white mb-3 sm:mb-4 text-lg sm:text-xl tracking-tight font-display">{item.title}</h4>
                <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 lg:py-32 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20 reveal">
            <div className="font-mono text-[10px] sm:text-xs text-zinc-500 tracking-widest uppercase mb-4 sm:mb-5">Revenue Model</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient-heading font-display">Transparent Scaling.</h2>
          </div>

          <div className="flex justify-center mb-16 sm:mb-20 reveal delay-100 px-2">
            <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-0 glass-card p-1.5 sm:p-2 rounded-2xl sm:rounded-full w-full sm:w-auto">
              <button
                onClick={() => setPricingTab('developers')}
                className={`flex-1 sm:flex-none px-6 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm font-bold rounded-xl sm:rounded-full transition-all ${pricingTab === 'developers' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
              >
                Developers
              </button>
              <button
                onClick={() => setPricingTab('organizations')}
                className={`flex-1 sm:flex-none px-6 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm font-bold rounded-xl sm:rounded-full transition-all ${pricingTab === 'organizations' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
              >
                Organizations
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {pricingTab === 'developers' ? (
              <>
                <div className="glass-card p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] reveal delay-100">
                  <div className="font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-500 mb-4 sm:mb-6 uppercase">Developer</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 font-display">Explorer</h3>
                  <div className="text-5xl sm:text-6xl font-bold text-white mb-8 sm:mb-10 tracking-tighter font-display">$0<span className="text-lg sm:text-xl text-zinc-500 font-normal">/mo</span></div>
                  <ul className="space-y-4 sm:space-y-5 text-sm text-zinc-400 mb-10 sm:mb-12 font-medium">
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> Access to all L1 challenges</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> Limited Tries</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> Public profile</li>

                  </ul>
                  <button className="w-full py-4 sm:py-5 border border-white/20 text-white rounded-full font-bold text-base sm:text-lg hover:bg-white/10 transition-colors">Create Profile</button>
                </div>

                <div className="bg-white/[0.04] border border-white/10 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] relative shadow-[0_0_40px_rgba(255,255,255,0.05)] transform lg:-translate-y-4 reveal delay-200 backdrop-blur-xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 sm:px-5 py-1.5 sm:py-2 bg-white text-black text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded-b-xl">Pro Tier</div>
                  <div className="font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-500 mb-4 sm:mb-6 uppercase mt-2 sm:mt-4">Developer</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 font-display">Builder</h3>
                  <div className="text-5xl sm:text-6xl font-bold text-white mb-8 sm:mb-10 tracking-tighter font-display">$9<span className="text-lg sm:text-xl text-zinc-500 font-normal">/mo</span></div>
                  <ul className="space-y-4 sm:space-y-5 text-sm text-zinc-400 mb-10 sm:mb-12 font-medium">
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-[#14F195] shrink-0" /> All L1, L2, L3 challenges</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-[#14F195] shrink-0" /> Verified on-chain profile badge (mainnet)</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-[#14F195] shrink-0" /> NAS leaderboard ranking</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-[#14F195] shrink-0" /> Unlimited Tries</li>
                  </ul>
                  <button className="w-full py-4 sm:py-5 bg-white text-black rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform">Upgrade</button>
                </div>

                <div className="glass-card p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] reveal delay-300">
                  <div className="font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-500 mb-4 sm:mb-6 uppercase">Developer</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 font-display">Auditor</h3>
                  <div className="text-5xl sm:text-6xl font-bold text-white mb-8 sm:mb-10 tracking-tighter font-display">$49<span className="text-lg sm:text-xl text-zinc-500 font-normal">/mo</span></div>
                  <ul className="space-y-4 sm:space-y-5 text-sm text-zinc-400 mb-10 sm:mb-12 font-medium">
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> Everything in Builder</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> Direct org intro (1/mo)</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> Custom challenge beta</li>
                  </ul>
                  <button className="w-full py-4 sm:py-5 border border-white/20 text-white rounded-full font-bold text-base sm:text-lg hover:bg-white/10 transition-colors">Go Pro</button>
                </div>
              </>
            ) : (
              <>
                <div className="glass-card p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] reveal delay-100">
                  <div className="font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-500 mb-4 sm:mb-6 uppercase">Organization</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 font-display">Hosted</h3>
                  <div className="text-5xl sm:text-6xl font-bold text-white mb-8 sm:mb-10 tracking-tighter font-display">$200<span className="text-lg sm:text-xl text-zinc-500 font-normal">/mo</span></div>
                  <ul className="space-y-4 sm:space-y-5 text-sm text-zinc-400 mb-10 sm:mb-12 font-medium">
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> Own mint program</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> No-code builder</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> Partner dashboard</li>
                  </ul>
                  <button className="w-full py-4 sm:py-5 border border-white/20 text-white rounded-full font-bold text-base sm:text-lg hover:bg-white/10 transition-colors">Contact Sales</button>
                </div>

                <div className="bg-white/[0.04] border border-white/10 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] relative shadow-[0_0_40px_rgba(255,255,255,0.05)] transform lg:-translate-y-4 reveal delay-200 backdrop-blur-xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 sm:px-5 py-1.5 sm:py-2 bg-white text-black text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded-b-xl">Popular</div>
                  <div className="font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-500 mb-4 sm:mb-6 uppercase mt-2 sm:mt-4">Organization</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 font-display">Embedded</h3>
                  <div className="text-5xl sm:text-6xl font-bold text-white mb-8 sm:mb-10 tracking-tighter font-display">$800<span className="text-lg sm:text-xl text-zinc-500 font-normal">/mo</span></div>
                  <ul className="space-y-4 sm:space-y-5 text-sm text-zinc-400 mb-10 sm:mb-12 font-medium">
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-[#14F195] shrink-0" /> Everything in Hosted</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-[#14F195] shrink-0" /> Embed widget</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-[#14F195] shrink-0" /> Talent pool access</li>
                  </ul>
                  <button className="w-full py-4 sm:py-5 bg-white text-black rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform">Start Verifying</button>
                </div>

                <div className="glass-card p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] reveal delay-300">
                  <div className="font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-500 mb-4 sm:mb-6 uppercase">Organization</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 font-display">White Label</h3>
                  <div className="text-5xl sm:text-6xl font-bold text-white mb-8 sm:mb-10 tracking-tighter font-display">Custom</div>
                  <ul className="space-y-4 sm:space-y-5 text-sm text-zinc-400 mb-10 sm:mb-12 font-medium">
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> Full API access</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> Complete white label</li>
                    <li className="flex items-center gap-3 sm:gap-4"><Icon name="Check" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> Dedicated support</li>
                  </ul>
                  <button className="w-full py-4 sm:py-5 border border-white/20 text-white rounded-full font-bold text-base sm:text-lg hover:bg-white/10 transition-colors">Talk to Us</button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>



      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 pt-24 lg:pt-40 pb-10 lg:pb-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-24 lg:mb-40 reveal">
            <h2 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-bold tracking-tighter text-white mb-6 lg:mb-8 font-display leading-none text-gradient-hero">PROVE IT.</h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-zinc-400 max-w-[90%] sm:max-w-2xl mx-auto mb-10 lg:mb-14 font-medium leading-relaxed">Every certificate you've ever earned lives on someone else's server. Put it in your wallet.</p>
            <button className="w-full sm:w-auto bg-white text-black px-10 sm:px-12 py-5 sm:py-6 rounded-full font-bold text-lg sm:text-xl hover:scale-105 transition-transform duration-300">
              Launch Platform
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 pt-12 lg:pt-16 border-t border-white/10 reveal delay-100">
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-black flex items-center justify-center font-bold text-lg sm:text-xl rounded-lg sm:rounded-xl tracking-tighter font-display">SC</div>
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">StudyChain</span>
              </div>
              <p className="text-zinc-500 text-sm sm:text-base max-w-sm leading-relaxed mb-6 lg:mb-8 font-medium">
                Learn. Build. Prove. Your wallet is your resume. Re-engineering technical credentialing on Solana.
              </p>
              <div className="text-[10px] sm:text-xs text-zinc-600 font-mono tracking-widest uppercase">
                Founder: <a href="https://x.com/yash514131" className="text-white hover:underline transition-colors">@yash514131</a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 lg:mb-8 text-[10px] sm:text-xs tracking-widest uppercase font-mono">Protocol</h4>
              <ul className="space-y-4 lg:space-y-5 text-sm text-zinc-400 font-medium">
                <li><a href="#tracks" className="hover:text-white transition-colors">Challenges</a></li>
                <li><a href="#nas" className="hover:text-white transition-colors">NAS Score</a></li>
                <li><a href="#protocol" className="hover:text-white transition-colors">Organizations</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 lg:mb-8 text-[10px] sm:text-xs tracking-widest uppercase font-mono">Connect</h4>
              <ul className="space-y-4 lg:space-y-5 text-sm text-zinc-400 font-medium">
                <li><a href="https://x.com/yash514131" className="hover:text-white transition-colors">X (Twitter)</a></li>
                <li><a href="https://discord.gg/pRBzgxmTK" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="https://github.com/YASH514131" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 lg:mt-24 pt-8 lg:pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-[10px] sm:text-xs font-mono text-zinc-600 tracking-widest uppercase reveal delay-200 text-center sm:text-left">
            <p>© 2026 StudyChain Protocol. Built on Solana.</p>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card border-none">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#14F195] animate-pulse"></span>
              Testnet Beta Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
