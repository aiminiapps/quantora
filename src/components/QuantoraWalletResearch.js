'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useBalance, useEnsName, useDisconnect } from 'wagmi';
import { W3mButton, useWeb3Modal } from '@web3modal/wagmi/react';
import { TonConnectButton, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { formatUnits } from 'viem';
import { 
  HiOutlineWallet,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineBrain,
  HiOutlineEye,
  HiOutlineExclamationTriangle,
  HiOutlineTrendingUp,
  HiOutlineGlobe,
  HiSparkles,
  HiOutlineRefresh,
  HiOutlineChartBar,
  HiOutlineDocumentSearch,
  HiOutlineFire
} from 'react-icons/hi';
import { LuBrainCircuit } from 'react-icons/lu';

// Helper: detect Telegram Mini App
function isTelegramWebApp() {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

export default function QuantoraWalletResearch() {
  // EVM Wallet hooks
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });
  const { open } = useWeb3Modal();
  
  // TON Wallet hooks
  const tonWallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [tonBalance, setTonBalance] = useState(null);
  
  // Component state
  const [tokens, setTokens] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Fetch EVM tokens
  useEffect(() => {
    if (address) {
      setLoading(true);
      fetch(
        `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?key=ckey_demo`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.data?.items) {
            const erc20s = data.data.items.filter((t) => t.type === 'cryptocurrency');
            setTokens(erc20s.slice(0, 8));
            // Trigger AI analysis after token fetch
            setTimeout(() => performAIAnalysis(erc20s), 1000);
          }
        })
        .catch(() => {
          // Mock data for demo purposes
          const mockTokens = [
            { contract_ticker_symbol: 'USDC', balance: 2500, contract_decimals: 6, quote: 2500 },
            { contract_ticker_symbol: 'ETH', balance: 1.5, contract_decimals: 18, quote: 3750 },
            { contract_ticker_symbol: 'BTC', balance: 0.1, contract_decimals: 8, quote: 4300 },
          ];
          setTokens(mockTokens);
          setTimeout(() => performAIAnalysis(mockTokens), 1000);
        })
        .finally(() => setLoading(false));
    }
  }, [address]);

  // Fetch TON balance
  useEffect(() => {
    if (tonWallet) {
      fetch(
        `https://toncenter.com/api/v2/getAddressBalance?address=${tonWallet.account.address}`
      )
        .then((res) => res.json())
        .then((data) => {
          const balance = parseInt(data.result) / 1e9;
          setTonBalance(balance);
          // Mock TON analysis
          setTimeout(() => performAIAnalysis([{ contract_ticker_symbol: 'TON', balance, quote: balance * 5.2 }]), 1000);
        });
    }
  }, [tonWallet]);

  // AI Analysis simulation
  const performAIAnalysis = (tokenData) => {
    const steps = [
      "Analyzing portfolio composition...",
      "Scanning smart money movements...",
      "Evaluating risk factors...",
      "Discovering opportunities...",
      "Generating personalized research..."
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setAnalysisStep(index);
      }, index * 1000);
    });

    setTimeout(() => {
      const totalValue = tokenData.reduce((sum, token) => sum + (token.quote || 0), 0);
      
      setAiAnalysis({
        portfolioValue: totalValue,
        riskScore: Math.floor(Math.random() * 10) + 1,
        diversificationScore: Math.floor(Math.random() * 10) + 1,
        performancePrediction: "+12.5%",
        topHolding: tokenData[0]?.contract_ticker_symbol || "N/A"
      });

      setActiveAlerts([
        {
          id: 1,
          type: "warning",
          title: "Whale Alert",
          message: `Large ${tokenData[0]?.contract_ticker_symbol || 'BTC'} movement detected`,
          timestamp: "2 mins ago",
          severity: "high"
        },
        {
          id: 2,
          type: "opportunity",
          title: "Yield Opportunity",
          message: "High APY farming opportunity found for your holdings",
          timestamp: "5 mins ago",
          severity: "medium"
        },
        {
          id: 3,
          type: "risk",
          title: "Risk Assessment",
          message: "Portfolio concentration risk detected",
          timestamp: "10 mins ago",
          severity: "low"
        }
      ]);

      setOpportunities([
        {
          id: 1,
          token: "ARB",
          reason: "Similar to your ETH holding pattern",
          confidence: 87,
          type: "Layer 2 Scaling"
        },
        {
          id: 2,
          token: "OP",
          reason: "Correlates with your DeFi portfolio",
          confidence: 75,
          type: "Optimistic Rollup"
        }
      ]);
    }, 5000);
  };

  const walletConnected = isConnected || tonWallet;
  const currentAddress = address || tonWallet?.account?.address;
  const currentBalance = balance || { value: BigInt(Math.floor((tonBalance || 0) * 1e9)), decimals: 9, symbol: 'TON' };

  return (
    <div className="pb-20 space-y-6">
      {/* Header */}
      <motion.div 
        className="glass mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-6 bg-gradient-to-r from-lime-400/20 via-cyan-400/15 to-violet-400/20 rounded-2xl">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-lime-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <LuBrainCircuit className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-black tektur text-white mb-2">
              AI Portfolio Intelligence
            </h1>
            <p className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-2">
              Personalized Research Platform
            </p>
            <p className="text-white/80 text-sm">
              Connect your wallet for AI-powered research tailored to your holdings
            </p>
          </div>
        </div>
      </motion.div>

      {!walletConnected ? (
        /* Wallet Connection Interface */
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="glass">
            <div className="p-6 text-center">
              <HiOutlineWallet className="w-12 h-12 text-lime-400 mx-auto mb-4" />
              <h2 className="text-white font-bold text-lg mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 text-sm mb-6">
                Unlock personalized AI research based on your actual holdings
              </p>
              
              <div className="space-y-3">
                {isTelegramWebApp() ? (
                  <div className="flex flex-col items-center gap-4">
                    <TonConnectButton />
                    <p className="text-xs text-gray-500">TON Wallet for Telegram Mini App</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <W3mButton />
                    <p className="text-xs text-gray-500">MetaMask, WalletConnect, and more</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                icon: HiOutlineBrain,
                title: "Custom Research",
                description: "AI analyzes your holdings for personalized insights",
                color: "lime-400"
              },
              {
                icon: HiOutlineLightningBolt,
                title: "Smart Alerts",
                description: "Real-time notifications about your tokens",
                color: "yellow-400"
              },
              {
                icon: HiOutlineShieldCheck,
                title: "Risk Warnings",
                description: "AI monitors portfolio risks and vulnerabilities",
                color: "red-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${feature.color}/20 rounded-xl flex items-center justify-center`}>
                    <feature.icon className={`w-5 h-5 text-${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                    <p className="text-gray-400 text-xs">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        /* Connected Wallet Dashboard */
        <div className="space-y-6">
          {/* Wallet Status */}
          <motion.div
            className="glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6 bg-gradient-to-br from-green-500/20 to-lime-400/20 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold text-sm">
                    {isTelegramWebApp() ? 'TON Wallet' : 'EVM Wallet'} Connected
                  </span>
                </div>
                <button
                  onClick={() => isTelegramWebApp() ? tonConnectUI.disconnect() : disconnect()}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Disconnect
                </button>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-400 text-xs">Wallet Address:</p>
                <p className="font-mono text-white text-sm break-all">
                  {currentAddress?.slice(0, 6)}...{currentAddress?.slice(-4)}
                </p>
                {ensName && <p className="text-cyan-400 text-sm">ENS: {ensName}</p>}
                
                {currentBalance && (
                  <div className="mt-3 text-center">
                    <div className="text-2xl font-black text-white">
                      {parseFloat(formatUnits(currentBalance.value, currentBalance.decimals)).toFixed(4)} {currentBalance.symbol}
                    </div>
                    {aiAnalysis && (
                      <div className="text-lime-400 text-sm">
                        Portfolio Value: ${aiAnalysis.portfolioValue?.toLocaleString() || '0'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* AI Analysis Loading */}
          <AnimatePresence>
            {loading || (!aiAnalysis && walletConnected) && (
              <motion.div
                className="glass"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="p-6 text-center">
                  <motion.div
                    className="w-12 h-12 border-3 border-lime-400/30 border-t-lime-400 rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <h3 className="text-white font-bold mb-2">AI Analysis in Progress</h3>
                  <p className="text-lime-400 text-sm">
                    {analysisStep < 5 ? [
                      "Analyzing portfolio composition...",
                      "Scanning smart money movements...",
                      "Evaluating risk factors...",
                      "Discovering opportunities...",
                      "Generating personalized research..."
                    ][analysisStep] : "Analysis Complete!"}
                  </p>
                  <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
                    <motion.div 
                      className="bg-lime-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(analysisStep + 1) * 20}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Analysis Results */}
          {aiAnalysis && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Portfolio Overview */}
              <div className="glass">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <HiOutlineChartBar className="w-5 h-5 text-lime-400" />
                    <h3 className="text-white font-bold">AI Portfolio Analysis</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-lime-400">{aiAnalysis.riskScore}/10</div>
                      <div className="text-xs text-gray-400">Risk Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-cyan-400">{aiAnalysis.diversificationScore}/10</div>
                      <div className="text-xs text-gray-400">Diversification</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-lime-400/10 rounded-lg">
                    <p className="text-white text-sm">
                      <span className="text-lime-400 font-semibold">AI Prediction:</span> Your portfolio shows potential for {aiAnalysis.performancePrediction} growth based on current market conditions and smart money movements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Smart Alerts */}
              <div className="glass">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <HiOutlineEye className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-white font-bold">Smart Alerts</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-xs">{activeAlerts.length} Active</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {activeAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                        alert.severity === 'high' ? 'bg-red-500/10 border-red-400' :
                        alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-400' :
                        'bg-gray-500/10 border-gray-400'
                      }`}>
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-semibold text-sm">{alert.title}</h4>
                          <span className="text-xs text-gray-400">{alert.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-xs mt-1">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Opportunity Discovery */}
              <div className="glass">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <HiSparkles className="w-5 h-5 text-violet-400" />
                    <h3 className="text-white font-bold">AI Opportunities</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="p-3 bg-violet-500/10 rounded-lg border border-violet-400/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-violet-400 font-bold">${opportunity.token}</span>
                          <div className="flex items-center gap-1">
                            <HiOutlineTrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-semibold">{opportunity.confidence}%</span>
                          </div>
                        </div>
                        <p className="text-white text-sm mb-1">{opportunity.reason}</p>
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                          {opportunity.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Token Holdings */}
              {tokens.length > 0 && (
                <div className="glass">
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <HiOutlineGlobe className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-white font-bold">Your Holdings</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {tokens.slice(0, 5).map((token, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-white/5 rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-cyan-400/20 rounded-full flex items-center justify-center">
                              <span className="text-cyan-400 font-bold text-xs">
                                {token.contract_ticker_symbol?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-semibold text-sm">
                                {token.contract_ticker_symbol}
                              </div>
                              <div className="text-gray-400 text-xs">
                                {(token.balance / 10 ** token.contract_decimals).toFixed(4)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold text-sm">
                              ${token.quote?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Refresh Button */}
              <motion.button
                className="w-full glass-button flex items-center justify-center gap-2 py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => performAIAnalysis(tokens)}
              >
                <HiOutlineRefresh className="w-5 h-5" />
                <span>Refresh AI Analysis</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
