'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { 
  HiOutlineUsers, 
  HiOutlineClipboard, 
  HiOutlineShare, 
  HiOutlineCheckCircle,
  HiOutlineGift,
  HiOutlineRefresh
} from 'react-icons/hi';
import { HiOutlineWallet } from "react-icons/hi2";
import { SiEthereum, SiBinance, SiPolygon } from 'react-icons/si';

function QuantoraInviteCenter() {
  // Wallet State
  const [walletAddress, setWalletAddress] = useState(null);
  const [assets, setAssets] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loadingAssets, setLoadingAssets] = useState(false);

  // Invite State
  const [inviteCode] = useState('QTRA2025');
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Initialize
  useEffect(() => {
    // Check for saved session
    const saved = localStorage.getItem('quantora_wallet');
    if (saved) {
      setWalletAddress(saved);
      fetchAssets(saved);
    }
  }, []);

  // --- Wallet Actions ---
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts[0]) {
        setWalletAddress(accounts[0]);
        localStorage.setItem('quantora_wallet', accounts[0]);
        fetchAssets(accounts[0]);
      }
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const fetchAssets = async (address) => {
    setLoadingAssets(true);
    try {
      const res = await fetch(`/api/connect?wallet=${address}`);
      const data = await res.json();
      
      if (data.assets) {
        setAssets(data.assets);
        setTotalValue(data.totalValue);
      }
    } catch (error) {
      console.error("Asset fetch failed:", error);
    } finally {
      setLoadingAssets(false);
    }
  };

  const disconnect = () => {
    setWalletAddress(null);
    setAssets([]);
    setTotalValue(0);
    localStorage.removeItem('quantora_wallet');
  };

  // --- Invite Actions ---

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) { console.error(err); }
  };

  const handleShare = () => {
    const shareData = {
      title: 'Join Quantora AI',
      text: `Use my code ${inviteCode} to join Quantora!`,
      url: 'https://quantora.ai'
    };
    if (navigator.share) navigator.share(shareData);
    else handleCopyCode();
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      
      {/* --- HEADER & WALLET --- */}
      <motion.div 
        className="glass glass-p mb-6 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="p-4 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black tektur text-white">Dashboard</h1>
            {walletAddress && (
              <button 
                onClick={disconnect}
                className="text-xs text-white/50 hover:text-red-400 transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>

          {!walletAddress ? (
            <div className="text-center py-8">
               <div className="w-16 h-16 mx-auto mb-4 bg-lime-400/20 rounded-full flex items-center justify-center">
                  <HiOutlineWallet className="w-8 h-8 text-lime-400" />
               </div>
               <h3 className="text-white font-bold mb-2">Connect Wallet</h3>
               <p className="text-white/50 text-sm mb-6">View your multi-chain assets</p>
               <button
                  onClick={connectWallet}
                  className="w-full py-3 bg-gradient-to-r from-lime-400 to-green-500 text-black font-black tektur rounded-xl shadow-lg shadow-lime-400/20 active:scale-95 transition-transform"
                >
                  Connect MetaMask
               </button>
            </div>
          ) : (
            <div>
              {/* Total Balance */}
              <div className="text-center mb-8">
                <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">Total Net Worth</p>
                <div className="flex items-center justify-center gap-2">
                   {loadingAssets ? (
                     <div className="w-6 h-6 border-2 border-lime-400 border-t-transparent animate-spin rounded-full"/>
                   ) : (
                     <span className="text-4xl font-black text-white tektur">
                       ${totalValue}
                     </span>
                   )}
                </div>
              </div>

              {/* Asset List */}
              <div className="space-y-3">
                {assets.map((asset, i) => (
                  <motion.div 
                    key={asset.chain}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white/80">
                        {asset.chain === 'Ethereum' && <SiEthereum />}
                        {asset.chain === 'BSC' && <SiBinance />}
                        {asset.chain === 'Polygon' && <SiPolygon />}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{asset.symbol}</div>
                        <div className="text-white/40 text-xs">{asset.chain}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-sm">${asset.value}</div>
                      <div className="text-lime-400 text-xs">{asset.balance}</div>
                    </div>
                  </motion.div>
                ))}
                
                {assets.length === 0 && !loadingAssets && (
                   <div className="text-center text-white/30 text-sm py-2">No assets found</div>
                )}
              </div>
              
              <button 
                onClick={() => fetchAssets(walletAddress)}
                disabled={loadingAssets}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs text-lime-400/80 hover:text-lime-400"
              >
                <HiOutlineRefresh className={loadingAssets ? "animate-spin" : ""} />
                Refresh Assets
              </button>
            </div>
          )}
        </div>
      </motion.div>


      {/* --- INVITE SECTION (Preserved & Styled) --- */}
      <motion.div 
        className="glass glass-p"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineGift className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-black tektur text-white">Invite Rewards</h3>
          </div>
          
          <div className="relative p-4 bg-gray-900/50 rounded-2xl border-2 border-dashed border-violet-400/30 mb-4 text-center group">
            <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">Your Code</div>
            <div className="font-mono text-2xl text-violet-400 font-black tracking-widest">
              {inviteCode}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={handleShare}
              whileTap={{ scale: 0.95 }}
              className="glass-button !py-3 flex items-center justify-center gap-2 text-sm font-bold"
            >
              <HiOutlineShare /> Share
            </motion.button>

            <motion.button
              onClick={handleCopyCode}
              whileTap={{ scale: 0.95 }}
              className={`glass-button !py-3 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${
                copySuccess ? 'text-green-400 border-green-400/30' : ''
              }`}
            >
              {copySuccess ? <HiOutlineCheckCircle /> : <HiOutlineClipboard />}
              {copySuccess ? 'Copied!' : 'Copy'}
            </motion.button>
          </div>
        </div>
      </motion.div>
      
    </div>
  );
}

export default QuantoraInviteCenter;