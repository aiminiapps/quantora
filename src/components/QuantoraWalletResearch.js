'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { 
  HiOutlinePaperAirplane, 
  HiOutlineLightningBolt, 
  HiOutlineTrendingUp, 
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
  HiTerminal
} from 'react-icons/hi';
import { HiOutlineWallet } from "react-icons/hi2";
import { SiEthereum, SiBinance, SiPolygon } from 'react-icons/si';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function QuantoraDashboard() {
  // --- STATE ---
  const [walletAddress, setWalletAddress] = useState(null);
  const [portfolioData, setPortfolioData] = useState({ 
    totalValue: 0, 
    assets: [], 
    riskScore: 'Scanning...' 
  });
  
  // Market & AI State
  const [marketPrices, setMarketPrices] = useState({});
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 'init', 
      role: 'assistant', 
      content: "Welcome back, Operator. I am connected to your live portfolio feed. How can I assist you today?", 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Recover Session
    const saved = localStorage.getItem('quantora_wallet');
    if (saved) {
      setWalletAddress(saved);
      fetchPortfolio(saved);
      fetchLivePrices();
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // --- DATA FETCHING ---
  const fetchLivePrices = async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,matic-network&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await res.json();
      setMarketPrices(data);
    } catch (error) { console.warn(error); }
  };

  const fetchPortfolio = async (address) => {
    try {
      const res = await fetch(`/api/connect?wallet=${address}`);
      const data = await res.json();
      
      if (data.assets) {
        const assetCount = data.assets.length;
        // Simple Logic for Risk Score
        const risk = assetCount < 2 ? "High Concentration" : "Balanced";
        
        setPortfolioData({
          totalValue: data.totalValue,
          assets: data.assets,
          riskScore: risk
        });
      }
    } catch (e) { console.error(e); }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not found!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts[0]) {
        setWalletAddress(accounts[0]);
        localStorage.setItem('quantora_wallet', accounts[0]);
        // Trigger data load
        fetchPortfolio(accounts[0]);
        fetchLivePrices();
      }
    } catch (err) { console.error(err); }
  };

  const sendChatMessage = async (manualInput = null) => {
    const text = manualInput || userInput;
    if (!text.trim() || isTyping) return;

    setUserInput('');
    setChatMessages(p => [...p, { id: Date.now(), role: 'user', content: text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setIsTyping(true);

    // Simulated AI Delay/Fallback (Replace with your actual /api/agent call)
    try {
        // Construct context for your /api/agent
        const context = `Assets: ${portfolioData.assets.length}, Value: $${portfolioData.totalValue}`;
        
        // Example Fetch (Commented out to prevent errors if API isn't ready)
        /* const res = await fetch('/api/agent', { 
            method: 'POST', 
            body: JSON.stringify({ prompt: text, context }) 
        });
        const data = await res.json();
        */

        // Mock Response for UI Demo
        setTimeout(() => {
            setChatMessages(p => [...p, {
                id: Date.now()+1,
                role: 'assistant',
                content: `I've analyzed your request regarding **${portfolioData.assets.length} assets**. \n\nMarket sentiment is currently neutral. Would you like a rebalancing strategy?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
        }, 1500);

    } catch (e) { setIsTyping(false); }
  };

  // --- RENDER HELPERS ---
  const disconnect = () => {
    localStorage.removeItem('quantora_wallet');
    setWalletAddress(null);
    setPortfolioData({ totalValue: 0, assets: [], riskScore: 'Scanning...' });
  };

  // --- VIEW: CONNECT WALLET (LOCKED) ---
  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-lime-900/5 relative overflow-hidden"
        >
            {/* Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-lime-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-tr from-lime-400/20 to-transparent flex items-center justify-center border border-lime-400/30">
                    <HiOutlineWallet className="w-10 h-10 text-lime-400" />
                </div>
                
                <h2 className="text-2xl font-black text-white tektur mb-2">Access Dashboard</h2>
                <p className="text-white/50 text-sm mb-8 leading-relaxed">
                    Connect your secure wallet to view assets, analyze risks, and chat with the AI Agent.
                </p>

                <button 
                    onClick={connectWallet}
                    className="group relative w-full py-4 bg-lime-400 text-black font-black tektur rounded-xl overflow-hidden transition-transform active:scale-95"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <HiOutlineLightningBolt className="text-lg" /> 
                        Connect MetaMask
                    </span>
                    <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </div>
        </motion.div>
      </div>
    );
  }

  // --- VIEW: DASHBOARD (UNLOCKED) ---
  return (
    <div className="pb-24 pt-4 px-4 max-w-xl mx-auto">
      
      {/* HEADER */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <HiTerminal className="text-lime-400 w-5 h-5" />
            <span className="font-bold text-white tracking-wider tektur">QUANTORA <span className="text-lime-400">OS</span></span>
        </div>
        <button onClick={disconnect} className="text-[10px] text-red-400/70 hover:text-red-400 border border-red-400/20 px-3 py-1 rounded-full transition-colors">
            DISCONNECT
        </button>
      </motion.div>

      {/* 1. MARKET TICKER (Clean Glass) */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="grid grid-cols-4 gap-2 mb-6">
        {[
          { id: 'bitcoin', sym: 'BTC' },
          { id: 'ethereum', sym: 'ETH' },
          { id: 'binancecoin', sym: 'BNB' },
          { id: 'matic-network', sym: 'MATIC' }
        ].map((coin) => (
            <div key={coin.id} className="bg-white/5 backdrop-blur-md rounded-xl p-2 text-center border border-white/5 shadow-lg">
                <div className="text-[10px] text-white/40 font-bold mb-1">{coin.sym}</div>
                <div className="text-xs font-bold text-white">${marketPrices[coin.id]?.usd?.toLocaleString() || '---'}</div>
                <div className={`text-[9px] font-bold ${marketPrices[coin.id]?.usd_24h_change >= 0 ? 'text-lime-400' : 'text-red-400'}`}>
                    {marketPrices[coin.id]?.usd_24h_change?.toFixed(1)}%
                </div>
            </div>
        ))}
      </motion.div>

      {/* 2. PORTFOLIO CARD */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-6 relative group">
        <div className="absolute inset-0 bg-lime-400/5 blur-xl rounded-2xl group-hover:bg-lime-400/10 transition-colors duration-500" />
        <div className="relative glass glass-p p-5 rounded-2xl border border-white/10 backdrop-blur-xl">
            
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Net Worth</p>
                    <div className="text-3xl font-black text-white tektur tracking-tight">
                        ${Number(portfolioData.totalValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                    <HiOutlineShieldCheck className="text-lime-400 w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold text-lime-400">{portfolioData.riskScore}</span>
                </div>
            </div>

            {/* Asset List Headers */}
            <div className="grid grid-cols-12 text-[10px] text-white/30 uppercase font-bold mb-3 px-2">
                <div className="col-span-5">Asset</div>
                <div className="col-span-3 text-right">Price</div>
                <div className="col-span-4 text-right">Value</div>
            </div>

            {/* Scrollable List */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                {portfolioData.assets.map((asset, i) => (
                    <div key={i} className="grid grid-cols-12 items-center p-2 rounded-lg hover:bg-white/5 transition-colors group/item">
                        {/* Token Info */}
                        <div className="col-span-5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/80 border border-white/5">
                                {asset.chain === 'Ethereum' ? <SiEthereum size={14} /> : 
                                 asset.chain === 'BSC' ? <SiBinance size={14} /> : 
                                 <SiPolygon size={14} />}
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white">{asset.symbol}</div>
                                <div className="text-[9px] text-white/40">{Number(asset.balance).toFixed(4)}</div>
                            </div>
                        </div>
                        {/* Price */}
                        <div className="col-span-3 text-right">
                            <div className="text-xs text-white/60">${asset.price?.toLocaleString()}</div>
                        </div>
                        {/* Total Value */}
                        <div className="col-span-4 text-right">
                            <div className="text-xs font-bold text-white">${Number(asset.value).toLocaleString()}</div>
                        </div>
                    </div>
                ))}
                {portfolioData.assets.length === 0 && (
                    <div className="text-center py-4 text-white/30 text-xs italic">Scanning blockchain...</div>
                )}
            </div>
        </div>
      </motion.div>

      {/* 3. AI CHAT INTERFACE (Redesigned) */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex flex-col h-[400px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Chat Title */}
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 bg-white/5">
            <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">QUANTORA AI ANALYST</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chatMessages.map((msg) => (
                <motion.div 
                    key={msg.id} 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-5 ${
                        msg.role === 'user' 
                        ? 'bg-lime-400 text-black font-semibold rounded-tr-sm shadow-lg shadow-lime-400/10' 
                        : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-sm backdrop-blur-md'
                    }`}>
                        {msg.content}
                    </div>
                    <span className="text-[9px] text-white/20 mt-1 px-1">{msg.timestamp}</span>
                </motion.div>
            ))}
            
            {/* Thinking Indicator */}
            {isTyping && (
                <div className="flex items-center gap-1.5 ml-2 p-2">
                    <div className="w-1.5 h-1.5 bg-lime-400/50 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-lime-400/50 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-lime-400/50 rounded-full animate-bounce delay-200" />
                </div>
            )}
            <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white/5 border-t border-white/5">
            <div className="relative">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Ask about your assets..."
                    className="w-full bg-black/20 border border-white/10 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-lime-400/30 focus:bg-black/40 transition-all placeholder:text-white/20"
                />
                <button 
                    onClick={() => sendChatMessage()}
                    disabled={!userInput.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-lime-400 text-black rounded-lg hover:scale-105 active:scale-95 disabled:opacity-0 disabled:scale-75 transition-all"
                >
                    <HiOutlinePaperAirplane className="w-4 h-4 rotate-90" />
                </button>
            </div>
        </div>
      </motion.div>

    </div>
  );
}