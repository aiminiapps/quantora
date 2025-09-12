'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CyberpunkDataHeist = ({ onComplete }) => {
  const [hackingStage, setHackingStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [matrixChars, setMatrixChars] = useState([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanlinePosition, setScanlinePosition] = useState(0);
  const [typedText, setTypedText] = useState('');

  const hackingStages = [
    {
      text: "INITIATING QUANTORA BREACH",
      description: "Establishing encrypted connection...",
      progress: 15,
      color: "lime-400",
      delay: 2000
    },
    {
      text: "PENETRATING FINANCIAL FIREWALL",
      description: "Bypassing institutional security...",
      progress: 35,
      color: "cyan-400", 
      delay: 2500
    },
    {
      text: "ACCESSING WHALE DATABASES",
      description: "Extracting smart money patterns...",
      progress: 55,
      color: "yellow-400",
      delay: 2000
    },
    {
      text: "DOWNLOADING MARKET INTELLIGENCE",
      description: "Acquiring institutional data...",
      progress: 75,
      color: "orange-400",
      delay: 2200
    },
    {
      text: "INSTALLING AI NEURAL INTERFACES",
      description: "Calibrating research algorithms...",
      progress: 90,
      color: "purple-400",
      delay: 2000
    },
    {
      text: "BREACH COMPLETE - WELCOME AGENT",
      description: "Access granted to the resistance...",
      progress: 100,
      color: "green-400",
      delay: 1500
    }
  ];

  // Mobile-optimized Matrix rain effect
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$₿Ξ⧫◇※";
    const columns = Math.floor(window.innerWidth / 15); // Smaller columns for mobile
    
    const drops = [];
    for (let i = 0; i < Math.min(columns, 25); i++) { // Limit to 25 columns max
      drops[i] = 1;
    }

    const matrix = setInterval(() => {
      setMatrixChars(prevChars => {
        const newChars = [];
        
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          const x = i * 15;
          const y = drops[i] * 20;
          
          newChars[i] = { char: text, x, y, opacity: Math.random() * 0.8 };
          
          if (drops[i] * 20 > window.innerHeight && Math.random() > 0.98) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        
        return newChars;
      });
    }, 120);

    return () => clearInterval(matrix);
  }, []);

  // Mobile scanline animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanlinePosition(prev => (prev + 3) % window.innerHeight);
    }, 20);

    return () => clearInterval(scanInterval);
  }, []);

  // Subtle glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (hackingStages[hackingStage]) {
      const text = hackingStages[hackingStage].text;
      let i = 0;
      setTypedText('');
      
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          setTypedText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 60);

      return () => clearInterval(typeInterval);
    }
  }, [hackingStage]);

  // Stage progression
  useEffect(() => {
    if (hackingStage < hackingStages.length) {
      const timer = setTimeout(() => {
        setProgress(hackingStages[hackingStage].progress);
        
        if (hackingStage === hackingStages.length - 1) {
          setTimeout(() => {
            onComplete && onComplete();
          }, 2000);
        } else {
          setTimeout(() => {
            setHackingStage(prev => prev + 1);
          }, hackingStages[hackingStage].delay);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [hackingStage, onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden font-mono">
      {/* Mobile Matrix Rain Background */}
      <div className="absolute inset-0">
        {matrixChars.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-lime-400/60 text-xs pointer-events-none"
            style={{
              left: item.x,
              top: item.y,
              opacity: item.opacity
            }}
            animate={{ 
              y: [item.y, item.y + 80],
              opacity: [item.opacity, 0]
            }}
            transition={{ duration: 1.8, ease: "linear" }}
          >
            {item.char}
          </motion.div>
        ))}
      </div>

      {/* Subtle Scanline Effect */}
      <div 
        className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none"
        style={{ top: scanlinePosition }}
      />

      {/* Minimal Glitch Overlay */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 mix-blend-screen pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.2, 0, 0.3, 0],
              x: [0, -1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </AnimatePresence>

      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent">
        <div 
          className="w-full h-full opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px'
          }}
        />
      </div>

      {/* Main Mobile Terminal Interface */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-3">
        <motion.div
          className={`
            bg-black/85 border border-${hackingStages[hackingStage]?.color || 'lime-400'}/60
            rounded-2xl p-6 w-full max-w-sm backdrop-blur-sm
          `}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        >
          {/* Mobile-Optimized ASCII Art Logo */}
          <div className="text-center mb-6">
            <motion.pre 
              className="text-lime-400/90 text-[6px] leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
{`
 ██████╗ ████████╗██████╗  █████╗ 
██╔═══██╗╚══██╔══╝██╔══██╗██╔══██╗
██║   ██║   ██║   ██████╔╝███████║
██║▄▄ ██║   ██║   ██╔══██╗██╔══██║
╚██████╔╝   ██║   ██║  ██║██║  ██║
 ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
`}
            </motion.pre>
          </div>

          {/* Mobile Hacking Status */}
          <div className="space-y-5">
            <div>
              <motion.div 
                className={`text-lg font-bold text-${hackingStages[hackingStage]?.color || 'lime-400'} mb-2 leading-tight`}
                key={hackingStage}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  textShadow: glitchActive 
                    ? '1px 1px 0px #ff0000, -1px -1px 0px #00ffff'
                    : 'none'
                }}
              >
                {typedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="ml-1"
                >
                  |
                </motion.span>
              </motion.div>
              
              <motion.p 
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {hackingStages[hackingStage]?.description}
              </motion.p>
            </div>

            {/* Mobile Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">BREACH PROGRESS</span>
                <span className={`text-${hackingStages[hackingStage]?.color || 'lime-400'} font-bold`}>
                  {progress}%
                </span>
              </div>
              
              <div className="relative h-3 bg-gray-800/80 border border-gray-600/50 rounded-lg overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r from-${hackingStages[hackingStage]?.color || 'lime-400'}/80 to-cyan-400/80 relative`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  {/* Subtle progress shine */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Mobile System Status */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-2 bg-gray-900/30 p-3 rounded-lg border border-gray-700/30">
                <div className="flex justify-between">
                  <span className="text-gray-500">CPU:</span>
                  <span className="text-red-400/80">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">RAM:</span>
                  <span className="text-yellow-400/80">15.2GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">NET:</span>
                  <span className="text-green-400/80">847MB/s</span>
                </div>
              </div>
              <div className="space-y-2 bg-gray-900/30 p-3 rounded-lg border border-gray-700/30">
                <div className="flex justify-between">
                  <span className="text-gray-500">PKTS:</span>
                  <span className="text-cyan-400/80">2.1M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">SEC:</span>
                  <span className="text-green-400/80">AES-256</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">STAT:</span>
                  <span className="text-lime-400/80 animate-pulse">LIVE</span>
                </div>
              </div>
            </div>

            {/* Mobile Data Stream */}
            <div className="h-24 bg-gray-900/40 rounded-lg border border-gray-700/30 p-3 overflow-hidden">
              <div className="text-[10px] space-y-1 text-green-400/70 font-mono">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: [0, 1, 0.6], x: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="truncate"
                  >
                    {`[${new Date().getHours()}:${new Date().getMinutes()}] PKT_${Math.random().toString(36).substr(2, 6).toUpperCase()}: ${['BTC', 'ETH', 'SOL', 'ADA', 'DOT'][Math.floor(Math.random() * 5)]}_${Math.floor(Math.random() * 999)}`}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Warning Message */}
          {hackingStage === hackingStages.length - 1 && (
            <motion.div
              className="mt-5 p-4 border border-red-500/50 bg-red-500/10 rounded-lg text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="text-red-400/90 text-sm font-bold mb-2">⚠ ACCESS GRANTED ⚠</div>
              <div className="text-gray-400 text-xs leading-relaxed">
                Connected to Quantora Intelligence.<br/>
                Welcome to the resistance, Agent.
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Mobile Corner Effects */}
      <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-lime-400/30 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-cyan-400/30 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-purple-400/30 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-yellow-400/30 rounded-br-lg" />

      {/* Mobile Status Indicator */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-mono">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-red-500/60 rounded-full animate-pulse" />
          <span className="text-[10px]">STEALTH_MODE</span>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkDataHeist;
