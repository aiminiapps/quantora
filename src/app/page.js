'use client';

import { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/storage';
import { useTelegram } from '@/lib/useTelegram';
import CustomLoader from '@/components/Loader';
import BottomNav from '@/components/BottomNav';
import CoinAgent from '@/components/CoinAgent';
import Agent from '@/components/Agent';
import TaskCenter from '@/components/TaskCenter';
import InviteCenter from '@/components/InviteCenter';
import CryptoAgentCenter from '@/components/CryptoAgentCenter';
import DataCenterHome from '@/components/DataCenterHome';
import SearchAgent from '@/components/ui/SearchAgent';
import { 
  HiOutlineUsers,
  HiArrowRight,
  HiPlay,
} from 'react-icons/hi';
import { LuBrainCircuit } from "react-icons/lu";
import { SquareCheckBig, UserPlus, History, Check, CheckCircle } from 'lucide-react';

// Premium Intro Carousel Component
const QuantoraIntroCarousel = ({ user, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const autoPlayRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: "Welcome to Quantora",
      subtitle: "Institutional-Grade AI Research",
      description: "Join 120K+ crypto analysts worldwide leveraging advanced AI for professional market intelligence.",
      icon: LuBrainCircuit,
      gradient: "from-lime-400 to-green-500",
      color: "lime-400",
      stats: { users: "120K+", accuracy: "96%", reports: "50K+" },
      animation: "fadeInUp"
    },
    {
      id: 2,
      title: "Meet Your AI Research Team",
      subtitle: "5 Specialized Intelligence Agents",
      description: "TokenMaster, WhaleWatch, VestGuard, PulseAI, and RiskShield - each expert in their domain.",
      icon: HiOutlineUsers,
      gradient: "from-cyan-400 to-blue-500",
      color: "cyan-400",
      agents: ["TokenMaster AI", "WhaleWatch AI", "VestGuard AI"],
      animation: "slideInRight"
    },
    {
      id: 3,
      title: "Start Your Research Journey",
      subtitle: "Premium Intelligence Platform",
      description: "Access advanced analytics, real-time insights, and AI-powered research tools designed for professionals.",
      icon: HiPlay,
      gradient: "from-violet-400 to-pink-500",
      color: "violet-400",
      features: ["Real-time Analysis", "Export Reports", "Community Insights", "Risk Assessment"],
      animation: "zoomIn"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, slides.length]);

  const nextSlide = () => {
    setAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setAutoPlay(false);
    setCurrentSlide(index);
  };

  const handleComplete = () => {
    localStorage.setItem('quantora_intro_completed', 'true');
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('quantora_intro_completed', 'true');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Premium Background Effects */}
      <motion.div 
        className="absolute w-72 h-72 rounded-full bg-lime-400/10 blur-3xl -top-20 -left-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute w-48 h-48 rounded-full bg-cyan-400/10 blur-3xl -bottom-20 -right-20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
          x: [0, -20, 0],
          y: [0, 20, 0]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* User Info Header */}
      <motion.div 
        className="absolute top-8 left-0 right-0 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-lime-400/30 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={user?.photo_url || `https://api.dicebear.com/9.x/personas/svg?seed=${user?.first_name || 'User'}&backgroundColor=b6e3f4`}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div>
              <p className="text-white font-bold text-lg">
                Welcome, {user?.first_name || 'Researcher'}!
              </p>
              <p className="text-white/70 text-sm">
                Ready to explore AI research?
              </p>
            </div>
          </div>
          
          <motion.button
            onClick={handleSkip}
            className="px-4 glass-button py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white/80 text-sm font-semibold hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
          </motion.button>
        </div>
      </motion.div>

      {/* Main Slide Content */}
      <div className="relative h-screen flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="text-center max-w-lg"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          >
            {/* Slide Icon */}
            <motion.div
              className={`w-24 h-24 hidden mx-auto mb-8 bg-gradient-to-r ${slides[currentSlide].gradient} rounded-3xl flex items-center justify-center shadow-2xl`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            >
              {/* <slides[currentSlide].icon className="w-12 h-12 text-white" /> */}
            </motion.div>

            {/* Slide Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-2xl font-bold text-white mb-3 tracking-normal">
                {slides[currentSlide].title}
              </h1>
              <p className={`text-xl hidden font-bold text-${slides[currentSlide].color} mb-4 uppercase tracking-wider`}>
                {slides[currentSlide].subtitle}
              </p>
              <p className="text-white/80 text-sm text-balance leading-relaxed mb-8">
                {slides[currentSlide].description}
              </p>
            </motion.div>

            {/* Slide-Specific Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {/* Slide 1: Stats */}
              {currentSlide === 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(slides[0].stats).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      className="glass p-4 rounded-2xl"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.1, type: "spring" }}
                    >
                      <div className={`text-${slides[0].color} font-black text-2xl mb-1`}>
                        {value}
                      </div>
                      <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {/* Slide 2: AI Agents */}
              {currentSlide === 1 && (
                <div className="grid grid-cols-1 gap-1 ">
                  {slides[1].agents.map((agent, index) => (
                    <motion.div
                      key={agent}
                      className="flex items-center gap-3 glass glass-p rounded-xl"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className={`w-8 h-8 rounded-xl bg-${slides[1].color}/20 flex items-center justify-center`}>
                        <LuBrainCircuit className={`w-4 h-4 text-${slides[1].color}`} />
                      </div>
                      <span className="text-white font-semibold text-sm">{agent}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Slide 3: Features */}
              {currentSlide === 2 && (
                <div className="grid grid-cols-1 gap-3 ">
                  {/* {slides[2].features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="glass p-4 rounded-xl -mt-5 text-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                    >
                      <HiSparkles className={`w-6 h-6 text-${slides[2].color} mx-auto mb-2`} />
                      <span className="text-white text-sm font-semibold">{feature}</span>
                    </motion.div>
                  ))} */}
                  <motion.button
                    onClick={handleSkip}
                    className="px-4 flex w-[75%] items-center gap-3 justify-center mx-auto glass-button py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white/80 text-sm font-semibold hover:bg-white/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started  <HiArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              currentSlide === index 
                ? `bg-${slides[currentSlide].color} scale-125 shadow-lg` 
                : "bg-white/30"
            )}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-16 left-0 right-0 px-6">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HiArrowRight className="w-5 h-5 transform rotate-180" />
          </motion.button>

          {currentSlide === slides.length - 1 ? (
            <motion.button
              onClick={handleComplete}
              className={`px-8 py-4 hidden absolute glass bg-gradient-to-r ${slides[currentSlide].gradient} rounded-2xl text-white font-black text-lg shadow-2xl`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              Get Started
            </motion.button>
          ) : (
            <motion.button
              onClick={nextSlide}
              className={`px-6 py-3 hidden bg-gradient-to-r ${slides[currentSlide].gradient} rounded-xl text-white font-bold flex items-center gap-2 shadow-xl`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Next</span>
              <HiArrowRight className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HiArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Your existing components remain the same...
const EarningTimer = () => {
  const { earningTimer, startEarningTimer, formatTime } = useStore();

  useEffect(() => {
    if (earningTimer.isActive && earningTimer.startTimestamp) {
      const duration = 6 * 60 * 60;
      const elapsedSeconds = Math.floor((Date.now() - earningTimer.startTimestamp) / 1000);
      const newTimeRemaining = Math.max(duration - elapsedSeconds, 0);

      if (newTimeRemaining === 0 && !earningTimer.hasAwardedPoints) {
        useStore.getState().updateEarningTimer();
      }
    }
  }, [earningTimer.isActive, earningTimer.startTimestamp, earningTimer.hasAwardedPoints]);

  return (
    <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-xl p-4 border border-green-500/30 mb-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-green-400 font-bold text-lg">Earn 2,000 QTRA POINT</span>
        <span className="text-gray-300 font-mono text-lg">
          {earningTimer.isActive ? formatTime(earningTimer.timeRemaining) : '00:00:00'}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div
          className="bg-gradient-to-r from-lime-400 to-green-400 h-2 rounded-full transition-all duration-1000"
          style={{
            width: earningTimer.isActive
              ? `${((6 * 60 * 60 - earningTimer.timeRemaining) / (6 * 60 * 60)) * 100}%`
              : '0%',
          }}
        ></div>
      </div>
      {!earningTimer.isActive && (
        <button
          onClick={() => startEarningTimer(6 * 60 * 60)}
          className="w-full bg-gradient-to-r from-lime-400 to-green-400 text-black font-bold py-2 rounded-lg"
        >
          Start Earning
        </button>
      )}
    </div>
  );
};

const UserBalance = () => {
  const { spaiPoints, agentTickets } = useStore();
  return (
    <div className="flex gap-3 mb-6">
      <div className="flex-1 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-4 text-center">
        <div className="text-white font-bold text-[15px]">QTRA POINT {spaiPoints.toLocaleString()}</div>
      </div>
      <div className="flex-1 bg-gradient-to-r from-teal-600 to-[#22B496] rounded-xl p-4 text-center">
        <div className="text-white font-bold text-[15px]">AGENT PASS {agentTickets}</div>
      </div>
    </div>
  );
};

const SocialTask = () => {
  const { addSpaiPoints, setTwitterFollowCompleted, tasks } = useStore();
  const [completed, setCompleted] = useState(tasks.followX.completed);
  const { hapticFeedback } = useTelegram();

  const handleJoinX = () => {
    if (!completed) {
      setCompleted(true);
      addSpaiPoints(1000);
      setTwitterFollowCompleted(true);
      hapticFeedback('success');
      window.open('https://x.com/RevX_officialX', '_blank');
    }
  };

  return (
    <div className="backdrop-blur-lg bg-[#0A4729] rounded-xl p-4 border border-green-400/20 mb-6 border-l-2 border-l-green-500/30 border-r-2 border-r-green-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold">Join QTRA official X</h3>
            <p className="text-gray-300 text-sm">Follow on X for 1,000 QTRA Points</p>
          </div>
        </div>
        <button
          onClick={handleJoinX}
          className={cn(
            'p-2 rounded-lg transition-colors',
            completed ? 'bg-green-600' : 'bg-gray-300 hover:bg-gray-500'
          )}
          disabled={completed}
        >
          {completed ? (
              <CheckCircle/>
          ) : (
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

const NavigationButtons = ({ setActiveTab, earningTimer, startEarningTimer }) => {
  const { hapticFeedback } = useTelegram();

  const handleNavClick = (tab) => {
    hapticFeedback('light');
    setActiveTab(tab);
  };

  return (
    <div className="grid grid-cols-4 gap-2 mb-6">
      <button onClick={() => handleNavClick('task')}>
        <div className="backdrop-blur-lg glass bg-[#0A4729] rounded-xl py-6 flex items-center justify-center border border-green-400/20 border-l-2 border-l-green-500/30 border-r-2 border-r-green-500/30 transition-colors">
          <SquareCheckBig size={30} className='my-0.5'/>
        </div>
        <p className="text-gray-300 mt-1.5">Task</p>
      </button>
      <button onClick={() => handleNavClick('SPAI')}>
        <div className="backdrop-blur-lg glass glass-p bg-[#0A4729] rounded-xl py-3 flex items-center justify-center border border-green-400/20 border-l-2 border-l-green-500/30 border-r-2 border-r-green-500/30 transition-colors">
          <Image src="/agent/agentlogo.png" alt="SPAI" width={45} height={45} className='py-2' />
        </div>
        <p className="text-gray-300 mt-1.5">QTRA AI</p>
      </button>
      <button onClick={() => handleNavClick('invite')}>
        <div className="backdrop-blur-lg glass bg-[#0A4729] rounded-xl py-6 flex items-center justify-center border border-green-400/20 border-l-2 border-l-green-500/30 border-r-2 border-r-green-500/30 transition-colors">
          <UserPlus size={30} className='my-0.5'/>
        </div>
        <p className="text-gray-300 mt-1.5">Invite</p>
      </button>
      <button
        onClick={() => {
          hapticFeedback('medium');
          startEarningTimer(6 * 60 * 60);
        }}
        disabled={earningTimer.isActive}
        className={cn(
          'text-white font-medium rounded-lg text-sm transition-opacity',
          earningTimer.isActive ? 'opacity-40' : 'opacity-100'
        )}
      >
        <div className="backdrop-blur-lg glass bg-[#0A4729] rounded-xl py-6 flex items-center justify-center border border-green-400/20 border-l-2 border-l-green-500/30 border-r-2 border-r-green-500/30 transition-colors">
          <History size={30} className='my-0.5'/>
        </div>
        <p className="text-gray-300 mt-1.5">Start</p>
      </button>
    </div>
  );
};

const DebugPanel = ({ user, error, webApp }) => {
  const [showDebug, setShowDebug] = useState(false);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-4 right-4 z-50 hidden">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-red-600 text-white p-2 rounded text-xs"
      >
        Debug
      </button>
      {showDebug && (
        <div className="absolute top-10 right-0 bg-black text-white p-4 rounded text-xs max-w-xs overflow-auto max-h-96">
          <h4 className="font-bold mb-2">Debug Info:</h4>
          <p><strong>User:</strong> {user ? '✅' : '❌'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          <p><strong>WebApp:</strong> {webApp ? '✅' : '❌'}</p>
          <p><strong>Platform:</strong> {webApp?.platform || 'Unknown'}</p>
          <p><strong>Version:</strong> {webApp?.version || 'Unknown'}</p>
          {user && (
            <div className="mt-2">
              <p><strong>User Data:</strong></p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Component
function TelegramMiniApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [showLoader, setShowLoader] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  
  const { 
    user, 
    loading: telegramLoading, 
    error: telegramError, 
    webApp,
    showAlert,
    hapticFeedback,
    retry: retryTelegram,
    loadFallbackUser
  } = useTelegram();
  
  const { 
    agentTickets, 
    useAgentTicket, 
    setUser, 
    earningTimer, 
    startEarningTimer 
  } = useStore();
  
  const router = useRouter();

  // Check if intro should be shown
  useEffect(() => {
    const introCompleted = localStorage.getItem('quantora_intro_completed');
    if (!introCompleted) {
      setShowIntro(true);
    }
  }, []);

  // Show loader for 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      console.log('✅ Setting user in store:', user);
      setUser(user);
    }
  }, [user, setUser]);

  const handleAgentAccess = useCallback(() => {
    if (agentTickets > 0) {
      useAgentTicket();
      setActiveTab('SPAI');
      hapticFeedback('success');
    } else {
      showAlert('You need at least 1 Agent Ticket to access the AI Agent.');
      hapticFeedback('error');
    }
  }, [agentTickets, useAgentTicket, showAlert, hapticFeedback]);

  const handleTabNavigation = useCallback((tab) => {
    console.log('Navigating to tab:', tab);
    setActiveTab(tab);
    hapticFeedback('light');
    router.push(`/?tab=${tab}`, { scroll: false });
  }, [router, hapticFeedback]);

  const TopNav = () => (
    <div>
      <div className="w-full flex justify-between items-center py-4 px-2">
        <Image src="/logo.png" alt="Logo" width={150} height={50} priority />
        <div className="text-right">
          <p className="text-gray-300 text-sm">Welcome</p>
          <p className="text-white text-lg font-bold">
            {user?.first_name || 'Loading...'}
          </p>
        </div>
      </div>
      <SearchAgent />
    </div>
  );

  const renderHomeContent = () => (
    <div className="space-y-6">
      <SocialTask />
      <NavigationButtons
        setActiveTab={handleTabNavigation}
        earningTimer={earningTimer}
        startEarningTimer={startEarningTimer}
      />
      <CryptoAgentCenter />
      <div className="flex justify-between items-center">
        <h2 className="text-white text-xl font-bold">Market Intelligence</h2>
        <button
          onClick={() => handleTabNavigation('dataCenter')}
          className="text-gray-400 text-sm hover:text-white transition-colors"
        >
          More
        </button>
      </div>
      <DataCenterHome />
      <div className="h-10" />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'dataCenter':
        return <CoinAgent />;
      case 'SPAI':
        return <Agent />;
      case 'aiNews':
        return <InviteCenter />;
      case 'task':
        return <TaskCenter user={user} />;
      case 'invite':
        return <InviteCenter user={user} />;
      default:
        return renderHomeContent();
    }
  };

  // Show loader while initializing
  if (showLoader || telegramLoading) {
    return <CustomLoader />;
  }

  // Show intro carousel if not completed
  if (showIntro && user) {
    return (
      <QuantoraIntroCarousel 
        user={user} 
        onComplete={() => setShowIntro(false)} 
      />
    );
  }

  // Show error state with retry options
  if (telegramError && !user) {
    return (
      <div className="min-h-screen bg-[#021941] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="text-red-400 mb-4">
            <h2 className="text-xl font-bold mb-2">Connection Issue</h2>
            <p className="text-sm">{telegramError}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={retryTelegram}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg block w-full transition-colors"
            >
              🔄 Retry Connection
            </button>
            <button
              onClick={loadFallbackUser}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg block w-full transition-colors"
            >
              🧪 Continue with Test User
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg block w-full transition-colors"
            >
              🔃 Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<CustomLoader />}>
      <div className="min-h-screen max-w-md w-full mx-auto text-white flex flex-col items-center p-4 relative overflow-hidden">
        <DebugPanel user={user} error={telegramError} webApp={webApp} />
        
        <div className="absolute size-52 bg-[#132427] rounded-full blur-2xl -bottom-14 -right-14" />
        
        <div className="w-full">
          <TopNav />
          <SearchParamsWrapper setActiveTab={setActiveTab} renderContent={renderContent} />
        </div>
        
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
          <BottomNav
            activeTab={activeTab}
            setActiveTab={handleTabNavigation}
            handleAgentAccess={handleAgentAccess}
          />
        </div>
      </div>
    </Suspense>
  );
}

const SearchParamsWrapper = ({ setActiveTab, renderContent }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab') || 'home';
    setActiveTab(tab);
  }, [searchParams, setActiveTab]);

  return renderContent();
};

export default TelegramMiniApp;
