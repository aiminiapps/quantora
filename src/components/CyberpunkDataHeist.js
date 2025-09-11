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
      text: "INITIATING QUANTORA BREACH PROTOCOL",
      description: "Establishing encrypted connection...",
      progress: 15,
      color: "lime-400",
      delay: 2000
    },
    {
      text: "PENETRATING FINANCIAL FIREWALL",
      description: "Bypassing institutional security layers...",
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
      description: "Acquiring institutional-grade data...",
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
      description: "You now have access to the resistance...",
      progress: 100,
      color: "green-400",
      delay: 1500
    }
  ];

  // Matrix rain effect
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$₿Ξ⧫◇";
    const columns = Math.floor(window.innerWidth / 20);
    
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const matrix = setInterval(() => {
      setMatrixChars(prevChars => {
        const newChars = [...prevChars];
        
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          const x = i * 20;
          const y = drops[i] * 20;
          
          newChars[i] = { char: text, x, y, opacity: Math.random() };
          
          if (drops[i] * 20 > window.innerHeight && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        
        return newChars.slice(0, 100); // Limit for performance
      });
    }, 100);

    return () => clearInterval(matrix);
  }, []);

  // Scanline animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanlinePosition(prev => (prev + 2) % window.innerHeight);
    }, 16);

    return () => clearInterval(scanInterval);
  }, []);

  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 3000 + Math.random() * 2000);

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
      }, 50);

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
    <div className="min-h-screen bg-black relative overflow-hidden font-mono">
      {/* Matrix Rain Background */}
      <div className="absolute inset-0">
        {matrixChars.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-lime-400 text-sm pointer-events-none"
            style={{
              left: item.x,
              top: item.y,
              opacity: item.opacity
            }}
            animate={{ 
              y: [item.y, item.y + 100],
              opacity: [item.opacity, 0]
            }}
            transition={{ duration: 2, ease: "linear" }}
          >
            {item.char}
          </motion.div>
        ))}
      </div>

      {/* Scanline Effect */}
      <div 
        className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-30 pointer-events-none"
        style={{ top: scanlinePosition }}
      />

      {/* Glitch Overlay */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 mix-blend-screen pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0, 0.5, 0],
              x: [0, -2, 2, -1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Cyberpunk Grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Main Terminal Interface */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          className={`
            bg-black/90 border-2 border-${hackingStages[hackingStage]?.color || 'lime-400'} 
            rounded-lg p-8 max-w-2xl w-full backdrop-blur-sm
            shadow-[0_0_30px_rgba(50,255,50,0.3)]
          `}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          style={{
            boxShadow: glitchActive 
              ? `0 0 30px rgba(255, 0, 0, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)`
              : `0 0 30px rgba(50, 255, 50, 0.3)`
          }}
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-lime-400/30">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="text-lime-400 text-sm">QUANTORA_BREACH_v2.1</div>
          </div>

          {/* ASCII Art Logo */}
          <div className="text-center mb-8">
            <motion.pre 
              className="text-lime-400 text-xs leading-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
{`
 ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗████████╗ ██████╗ ██████╗  █████╗ 
██╔═══██╗██║   ██║██╔══██╗████╗  ██║╚══██╔══╝██╔═══██╗██╔══██╗██╔══██╗
██║   ██║██║   ██║███████║██╔██╗ ██║   ██║   ██║   ██║██████╔╝███████║
██║▄▄ ██║██║   ██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██╔══██╗██╔══██║
╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║  ██║██║  ██║
 ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
                        ██╗███╗   ██╗████████╗███████╗██╗     
                        ██║████╗  ██║╚══██╔══╝██╔════╝██║     
                        ██║██╔██╗ ██║   ██║   █████╗  ██║     
                        ██║██║╚██╗██║   ██║   ██╔══╝  ██║     
                        ██║██║ ╚████║   ██║   ███████╗███████╗
                        ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝
`}
            </motion.pre>
          </div>

          {/* Hacking Status */}
          <div className="space-y-6">
            <div>
              <motion.div 
                className={`text-2xl font-bold text-${hackingStages[hackingStage]?.color || 'lime-400'} mb-2`}
                key={hackingStage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  textShadow: glitchActive 
                    ? '2px 2px 0px #ff0000, -2px -2px 0px #00ffff'
                    : `0 0 10px currentColor`
                }}
              >
                >>> {typedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="ml-1"
                >
                  |
                </motion.span>
              </motion.div>
              
              <motion.p 
                className="text-gray-300 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {hackingStages[hackingStage]?.description}
              </motion.p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">BREACH PROGRESS</span>
                <span className={`text-${hackingStages[hackingStage]?.color || 'lime-400'} font-bold`}>
                  {progress}%
                </span>
              </div>
              
              <div className="relative h-4 bg-gray-800 border border-gray-600 rounded overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r from-${hackingStages[hackingStage]?.color || 'lime-400'} to-cyan-400 relative`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  {/* Animated progress shine */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">CPU:</span>
                  <span className="text-red-400">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">RAM:</span>
                  <span className="text-yellow-400">15.2GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">NET:</span>
                  <span className="text-green-400">847MB/s</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">PACKETS:</span>
                  <span className="text-cyan-400">2.1M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SECURE:</span>
                  <span className="text-green-400">AES-256</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">STATUS:</span>
                  <span className="text-lime-400 animate-pulse">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Data Stream */}
            <div className="h-32 bg-gray-900/50 rounded border border-gray-700 p-3 overflow-hidden">
              <div className="text-xs space-y-1 text-green-400 font-mono">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: [0, 1, 0.5], x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    {`[${new Date().toISOString()}] DATA_PACKET_${Math.random().toString(36).substr(2, 9).toUpperCase()}: ${['BTC', 'ETH', 'SOL', 'ADA', 'DOT'][Math.floor(Math.random() * 5)]}_ANALYSIS_${Math.floor(Math.random() * 9999)}`}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Warning Message */}
          {hackingStage === hackingStages.length - 1 && (
            <motion.div
              className="mt-6 p-4 border border-red-500 bg-red-500/10 rounded text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="text-red-400 text-sm font-bold mb-2">⚠ CLASSIFIED ACCESS GRANTED ⚠</div>
              <div className="text-gray-300 text-xs">
                You are now connected to the Quantora Intelligence Network.<br/>
                Use this power responsibly, Agent.
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Cyberpunk Corner Effects */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-lime-400 opacity-30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-cyan-400 opacity-30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-400 opacity-30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-yellow-400 opacity-30" />

      {/* Ambient Sound Effect Indicator */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          AUDIO_DISABLED_FOR_STEALTH
        </div>
      </div>
    </div>
  );
};

export default CyberpunkDataHeist;
