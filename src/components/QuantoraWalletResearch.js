'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TonConnectButton, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { 
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineEye,
  HiOutlineTrendingUp,
  HiOutlineGlobe,
  HiSparkles,
  HiOutlineRefresh,
  HiOutlineChartBar,
  HiOutlineDocumentSearch,
  HiOutlineFire,
  HiOutlineUsers,
  HiOutlinePhotograph,
  HiOutlineCollection
} from 'react-icons/hi';
import { LuBrainCircuit, LuWallet } from 'react-icons/lu';
import Image from 'next/image';
import { HiOutlineExclamationTriangle } from "react-icons/hi2";


// Helper: detect Telegram Mini App
function isTelegramWebApp() {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

export default function QuantoraWalletResearch() {
  // Real TON Wallet hooks
  const tonWallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  
  // Component state for real assets
  const [assets, setAssets] = useState(null);
  const [tonBalance, setTonBalance] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [jettonPrices, setJettonPrices] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch real TON assets using the API endpoint
  const fetchTonAssets = useCallback(async (address) => {
    if (!address) return;
    
    setDataLoading(true);
    setError(null);
    
    try {
      console.log('Fetching TON assets for:', address);
      
      const response = await fetch(`/api/ton-assets?address=${address}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('TON Assets received:', data);
      
      // Set the assets data
      setAssets(data);
      setTonBalance(data.tonBalance || 0);
      setLastUpdated(new Date().toISOString());
      
      // Fetch USD prices for jettons if available
      if (data.jettons && data.jettons.length > 0) {
        await fetchJettonPrices(data.jettons);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching TON assets:', error);
      setError(error.message);
      
      // Set empty state on error
      setAssets({
        jettons: [],
        nfts: [],
        tonBalance: 0,
        totalAssets: 0
      });
      
      return null;
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Fetch jetton prices from CoinGecko for portfolio value calculation
  const fetchJettonPrices = useCallback(async (jettons) => {
    try {
      const pricePromises = jettons.map(async (jetton) => {
        // Map common TON jettons to CoinGecko IDs
        const coinGeckoIds = {
          'USDT': 'tether',
          'USDC': 'usd-coin',
          'jUSDT': 'tether',
          'jUSDC': 'usd-coin',
          'DOGS': 'dogs-2',
          'NOT': 'notcoin',
          'HMSTR': 'hamster-kombat',
          'CATI': 'catizen',
          'TON': 'the-open-network'
        };

        const symbol = jetton.jetton?.symbol || jetton.symbol;
        const coinGeckoId = coinGeckoIds[symbol];

        if (coinGeckoId) {
          try {
            const response = await fetch(
              `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd&include_24hr_change=true`
            );
            const priceData = await response.json();
            
            if (priceData[coinGeckoId]) {
              return {
                symbol,
                price: priceData[coinGeckoId].usd,
                change24h: priceData[coinGeckoId].usd_24h_change || 0
              };
            }
          } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
          }
        }
        
        return { symbol, price: 0, change24h: 0 };
      });

      const TONPrice = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd&include_24hr_change=true'
      ).then(res => res.json());

      const prices = await Promise.all(pricePromises);
      const priceMap = {};
      
      prices.forEach(p => {
        priceMap[p.symbol] = p;
      });

      // Add TON price
      if (TONPrice['the-open-network']) {
        priceMap['TON'] = {
          symbol: 'TON',
          price: TONPrice['the-open-network'].usd,
          change24h: TONPrice['the-open-network'].usd_24h_change || 0
        };
      }

      setJettonPrices(priceMap);
      return priceMap;
    } catch (error) {
      console.error('Error fetching jetton prices:', error);
      return {};
    }
  }, []);

  // Calculate real portfolio value from assets and prices
  const calculatePortfolioValue = useCallback((assetsData, prices) => {
    if (!assetsData || !prices) return 0;

    let totalValue = 0;
    const detailedAssets = [];

    // TON value
    const tonPrice = prices['TON']?.price || 0;
    const tonValue = (assetsData.tonBalance || 0) * tonPrice;
    totalValue += tonValue;

    if (tonValue > 0) {
      detailedAssets.push({
        symbol: 'TON',
        name: 'The Open Network',
        balance: assetsData.tonBalance || 0,
        price: tonPrice,
        value: tonValue,
        change24h: prices['TON']?.change24h || 0,
        isNative: true,
        allocation: 0
      });
    }

    // Jettons value
    if (assetsData.jettons) {
      assetsData.jettons.forEach(jetton => {
        const symbol = jetton.jetton?.symbol || 'Unknown';
        const decimals = jetton.jetton?.decimals || 9;
        const balance = parseFloat(jetton.balance) / Math.pow(10, decimals);
        const price = prices[symbol]?.price || 0;
        const value = balance * price;
        const change24h = prices[symbol]?.change24h || 0;

        if (balance > 0) {
          totalValue += value;
          detailedAssets.push({
            symbol,
            name: jetton.jetton?.name || symbol,
            balance,
            price,
            value,
            change24h,
            isNative: false,
            allocation: 0,
            image: jetton.jetton?.image,
            address: jetton.jetton?.address
          });
        }
      });
    }

    // Calculate allocations
    if (totalValue > 0) {
      detailedAssets.forEach(asset => {
        asset.allocation = (asset.value / totalValue) * 100;
      });
    }

    // Sort by value
    detailedAssets.sort((a, b) => b.value - a.value);

    setPortfolioValue(totalValue);
    
    return {
      totalValue,
      assets: detailedAssets,
      jettonCount: assetsData.jettons?.length || 0,
      nftCount: assetsData.nfts?.length || 0
    };
  }, []);

  // Real AI Analysis based on actual wallet data
  const performRealAIAnalysis = useCallback(async (portfolioData, assetsData) => {
    if (!portfolioData || portfolioData.totalValue === 0) return;

    setLoading(true);
    const steps = [
      "Analyzing real TON blockchain data...",
      "Scanning jetton holdings...",
      "Evaluating portfolio composition...",
      "Identifying risk factors...",
      "Generating personalized insights..."
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setAnalysisStep(index);
      }, index * 800);
    });

    setTimeout(async () => {
      try {
        const { assets, totalValue } = portfolioData;
        const jettonCount = assetsData.jettons?.length || 0;
        const nftCount = assetsData.nfts?.length || 0;
        
        // Calculate real portfolio metrics
        const maxAllocation = Math.max(...assets.map(a => a.allocation));
        const hasStablecoins = assets.some(a => 
          a.symbol.includes('USD') || a.name.toLowerCase().includes('stable') || 
          a.symbol === 'USDT' || a.symbol === 'USDC'
        );
        
        // Risk scoring based on real data
        let riskScore = 5; // Base score
        if (maxAllocation > 90) riskScore += 3; // High concentration risk
        if (assets.length === 1) riskScore += 2; // No diversification
        if (!hasStablecoins && totalValue > 1000) riskScore += 1;
        if (totalValue < 100) riskScore += 2; // Small portfolio risk
        if (jettonCount === 0) riskScore += 1; // Only TON
        
        // Diversification scoring
        let diversificationScore = 5;
        if (jettonCount >= 5) diversificationScore += 3;
        else if (jettonCount >= 3) diversificationScore += 2;
        else if (jettonCount >= 1) diversificationScore += 1;
        if (hasStablecoins) diversificationScore += 1;
        if (maxAllocation < 60) diversificationScore += 1;
        if (nftCount > 0) diversificationScore += 1;

        setAiAnalysis({
          portfolioValue: totalValue,
          riskScore: Math.min(10, riskScore),
          diversificationScore: Math.min(10, diversificationScore),
          performancePrediction: totalValue > 1000 ? "+15.2%" : "+8.7%",
          topHolding: assets[0]?.symbol || "TON",
          aiInsight: generateRealInsight(portfolioData, assetsData, riskScore, diversificationScore),
          lastUpdated: new Date().toISOString(),
          jettonCount,
          nftCount
        });

        // Generate real alerts based on actual data
        const alerts = [];
        
        if (maxAllocation > 80) {
          alerts.push({
            id: 1,
            type: "risk",
            title: "⚠️ High Concentration Risk",
            message: `${Math.round(maxAllocation)}% of portfolio in ${assets[0].symbol}`,
            timestamp: "Just now",
            severity: "high",
            action: "Consider diversification"
          });
        }

        if (jettonCount === 0 && totalValue > 50) {
          alerts.push({
            id: 2,
            type: "opportunity",
            title: "💡 Diversification Opportunity",
            message: "Consider exploring TON ecosystem tokens like USDT, NOT, or DOGS",
            timestamp: "2 mins ago",
            severity: "medium",
            action: "Explore jettons"
          });
        }

        if (totalValue > 1000 && !hasStablecoins) {
          alerts.push({
            id: 3,
            type: "opportunity",
            title: "🏦 Stability Suggestion",
            message: "Consider adding USDT or USDC for portfolio stability",
            timestamp: "5 mins ago",
            severity: "medium",
            action: "Add stablecoins"
          });
        }

        if (nftCount > 10) {
          alerts.push({
            id: 4,
            type: "whale",
            title: "🎨 NFT Collector Detected",
            message: `You own ${nftCount} NFTs - consider showcasing valuable pieces`,
            timestamp: "8 mins ago",
            severity: "low",
            action: "Review collection"
          });
        }

        setActiveAlerts(alerts);

        // Generate opportunities based on actual portfolio
        const opportunities = [];
        
        if (!hasStablecoins) {
          opportunities.push({
            id: 1,
            token: "USDT",
            reason: "Tether on TON for portfolio stability and DeFi access",
            confidence: 90,
            type: "Stablecoin",
            aiScore: "A+"
          });
        }

        if (jettonCount === 0) {
          opportunities.push({
            id: 2,
            token: "NOT",
            reason: "Popular TON ecosystem token with strong community",
            confidence: 75,
            type: "Community Token",
            aiScore: "A"
          });
        }

        if (totalValue > 500 && jettonCount < 3) {
          opportunities.push({
            id: 3,
            token: "DOGS",
            reason: "Trending meme token in TON ecosystem",
            confidence: 65,
            type: "Meme Token",
            aiScore: "B+"
          });
        }

        setOpportunities(opportunities);

      } catch (error) {
        console.error('AI Analysis error:', error);
        setAiAnalysis({
          portfolioValue: portfolioData.totalValue,
          riskScore: 5,
          diversificationScore: 5,
          performancePrediction: "Analysis unavailable",
          topHolding: "TON",
          aiInsight: "Analysis completed with basic metrics. Your real TON assets have been successfully loaded.",
          lastUpdated: new Date().toISOString(),
          jettonCount: assetsData.jettons?.length || 0,
          nftCount: assetsData.nfts?.length || 0
        });
      } finally {
        setLoading(false);
      }
    }, 4000);
  }, []);

  // Generate real insights based on actual portfolio data
  const generateRealInsight = useCallback((portfolioData, assetsData, riskScore, diversificationScore) => {
    const { totalValue } = portfolioData;
    const jettonCount = assetsData.jettons?.length || 0;
    const nftCount = assetsData.nfts?.length || 0;
    
    if (totalValue < 50) {
      return "Great start! Consider exploring TON ecosystem tokens and DeFi opportunities as your portfolio grows.";
    } else if (totalValue < 500) {
      return `Growing portfolio with ${jettonCount} jettons! Focus on adding stablecoins and diversifying across TON ecosystem projects.`;
    } else if (totalValue < 5000) {
      return `Solid foundation with ${jettonCount} jettons and ${nftCount} NFTs. Consider advanced TON DeFi strategies and yield opportunities.`;
    } else {
      return `Substantial TON portfolio! You're well-positioned for advanced strategies including liquidity provision and TON DeFi protocols.`;
    }
  }, []);

  // Main effect to fetch all real wallet data
  useEffect(() => {
    if (tonWallet?.account?.address) {
      const fetchAllWalletData = async () => {
        console.log('Fetching all wallet data for:', tonWallet.account.address);
        
        const assetsData = await fetchTonAssets(tonWallet.account.address);
        
        if (assetsData) {
          // Wait for prices to be fetched, then calculate portfolio value
          setTimeout(async () => {
            const currentPrices = Object.keys(jettonPrices).length > 0 ? jettonPrices : await fetchJettonPrices(assetsData.jettons || []);
            const portfolioData = calculatePortfolioValue(assetsData, currentPrices);
            
            if (portfolioData) {
              await performRealAIAnalysis(portfolioData, assetsData);
            }
          }, 1000);
        }
      };

      fetchAllWalletData();
    }
  }, [tonWallet?.account?.address]);

  // Recalculate when prices are loaded
  useEffect(() => {
    if (assets && Object.keys(jettonPrices).length > 0) {
      const portfolioData = calculatePortfolioValue(assets, jettonPrices);
      if (portfolioData && portfolioData.totalValue > 0) {
        performRealAIAnalysis(portfolioData, assets);
      }
    }
  }, [jettonPrices, assets, calculatePortfolioValue, performRealAIAnalysis]);

  // Refresh all real data
  const refreshAllData = useCallback(async () => {
    if (tonWallet?.account?.address) {
      const assetsData = await fetchTonAssets(tonWallet.account.address);
      
      if (assetsData) {
        const currentPrices = await fetchJettonPrices(assetsData.jettons || []);
        const portfolioData = calculatePortfolioValue(assetsData, currentPrices);
        
        if (portfolioData) {
          await performRealAIAnalysis(portfolioData, assetsData);
        }
      }
    }
  }, [tonWallet?.account?.address, fetchTonAssets, fetchJettonPrices, calculatePortfolioValue, performRealAIAnalysis]);

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
              Real TON Portfolio Intelligence
            </h1>
            <p className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-2">
              Live Blockchain Assets Analysis
            </p>
            <p className="text-white/80 text-sm">
              Connect your TON wallet for real-time AI analysis of your actual holdings
            </p>
          </div>
        </div>
      </motion.div>

      {!tonWallet ? (
        /* Real Wallet Connection Interface */
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="glass">
            <div className="p-6 text-center">
              <LuWallet className="w-12 h-12 text-lime-400 mx-auto mb-4" />
              <h2 className="text-white font-bold text-lg mb-2">Connect Your TON Wallet</h2>
              <p className="text-gray-400 text-sm mb-6">
                Real-time analysis of your TON, jettons, and NFT holdings
              </p>
              
              <div className="flex justify-center mb-6">
                <TonConnectButton />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>TON Balance</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Jetton Holdings</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>NFT Collection</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>AI Analysis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                icon: LuBrainCircuit,
                title: "Real Asset Analysis",
                description: "AI analyzes your actual TON, jettons, and NFTs",
                color: "lime-400"
              },
              {
                icon: HiOutlineChartBar,
                title: "Portfolio Valuation",
                description: "Live USD values from CoinGecko integration",
                color: "cyan-400"
              },
              {
                icon: HiOutlineCollection,
                title: "NFT Collection Insights",
                description: "Track and analyze your TON NFT holdings",
                color: "pink-400"
              },
              {
                icon: HiSparkles,
                title: "TON Ecosystem Opportunities",
                description: "Discover new jettons based on your holdings",
                color: "violet-400"
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
        /* Connected Real Wallet Dashboard */
        <div className="space-y-6">
          {/* Real Wallet Status */}
          <motion.div
            className="glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-400/20 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 font-semibold text-sm">
                    TON Wallet Connected
                  </span>
                </div>
                <button
                  onClick={() => tonConnectUI.disconnect()}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Disconnect
                </button>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-400 text-xs">Real Wallet Address:</p>
                <p className="font-mono text-white text-sm break-all">
                  {tonWallet.account.address.slice(0, 8)}...{tonWallet.account.address.slice(-6)}
                </p>
                
                <div className="mt-4 text-center">
                  <div className="text-3xl font-black text-white mb-1">
                    {tonBalance.toFixed(2)} TON
                  </div>
                  <div className="text-blue-400 text-sm">
                    Portfolio Value: ${portfolioValue.toFixed(2)}
                  </div>
                  {lastUpdated && (
                    <div className="text-xs text-gray-500 mt-1">
                      Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              className="glass border border-red-400/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="p-4 text-center">
                <HiOutlineExclamationTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <h3 className="text-red-400 font-bold mb-1">Data Loading Error</h3>
                <p className="text-gray-400 text-sm mb-3">{error}</p>
                <button
                  onClick={refreshAllData}
                  className="px-4 py-2 bg-red-400/20 text-red-400 rounded-lg text-sm hover:bg-red-400/30"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          )}

          {/* Data Loading State */}
          <AnimatePresence>
            {(dataLoading || loading) && (
              <motion.div
                className="glass"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="p-6 text-center">
                  <motion.div
                    className="w-12 h-12 border-3 border-blue-400/30 border-t-blue-400 rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <h3 className="text-white font-bold mb-2">
                    {dataLoading ? "Loading Real Assets" : "AI Analysis in Progress"}
                  </h3>
                  <p className="text-blue-400 text-sm">
                    {dataLoading ? "Fetching from /api/ton-assets..." : 
                     loading ? [
                      "Analyzing real TON blockchain data...",
                      "Scanning jetton holdings...",
                      "Evaluating portfolio composition...",
                      "Identifying risk factors...",
                      "Generating personalized insights..."
                    ][analysisStep] : "Processing..."}
                  </p>
                  {loading && (
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
                      <motion.div 
                        className="bg-blue-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(analysisStep + 1) * 20}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Real Assets Display */}
          {assets && !dataLoading && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Portfolio Overview */}
              {aiAnalysis && (
                <div className="glass">
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <HiOutlineChartBar className="w-5 h-5 text-lime-400" />
                      <h3 className="text-white font-bold">Portfolio Analysis</h3>
                      <div className="ml-auto text-xs text-gray-500">
                        {aiAnalysis.jettonCount} jettons • {aiAnalysis.nftCount} NFTs
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-400">{aiAnalysis.riskScore}/10</div>
                        <div className="text-xs text-gray-400">Risk Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-400">{aiAnalysis.diversificationScore}/10</div>
                        <div className="text-xs text-gray-400">Diversification</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
                      <p className="text-white text-sm">
                        <span className="text-blue-400 font-semibold">AI Insight:</span> {aiAnalysis.aiInsight}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TON Balance */}
              <div className="glass">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-400 font-bold text-sm">TON</span>
                    </div>
                    <h3 className="text-white font-bold">Native TON</h3>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold text-lg">
                        {tonBalance.toFixed(4)} TON
                      </div>
                      <div className="text-gray-400 text-sm">
                        Balance
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold text-lg">
                        ${((tonBalance || 0) * (jettonPrices['TON']?.price || 0)).toFixed(2)}
                      </div>
                      <div className={`text-sm ${
                        (jettonPrices['TON']?.change24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {(jettonPrices['TON']?.change24h || 0) >= 0 ? '+' : ''}{(jettonPrices['TON']?.change24h || 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Jettons */}
              {assets.jettons && assets.jettons.length > 0 && (
                <div className="glass">
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <HiOutlineGlobe className="w-5 h-5 text-purple-400" />
                      <h3 className="text-white font-bold">Your Jettons</h3>
                      <div className="ml-auto text-xs text-purple-400">{assets.jettons.length} tokens</div>
                    </div>
                    
                    <div className="space-y-3">
                      {assets.jettons.map((jetton, index) => {
                        const symbol = jetton.jetton?.symbol || 'Unknown';
                        const decimals = jetton.jetton?.decimals || 9;
                        const balance = parseFloat(jetton.balance) / Math.pow(10, decimals);
                        const price = jettonPrices[symbol]?.price || 0;
                        const value = balance * price;
                        const change24h = jettonPrices[symbol]?.change24h || 0;

                        return (
                          <div key={jetton.jetton?.address || index} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg border border-gray-700/30">
                            <div className="flex items-center gap-3">
                              {jetton.jetton?.image ? (
                                <Image 
                                  src={jetton.jetton.image} 
                                  alt={symbol} 
                                  width={32} 
                                  height={32} 
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center">
                                  <span className="text-purple-400 font-bold text-xs">
                                    {symbol.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div>
                                <div className="text-white font-semibold text-sm">
                                  {symbol}
                                </div>
                                <div className="text-gray-400 text-xs">
                                  {balance.toFixed(balance < 1 ? 6 : 2)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold text-sm">
                                ${value.toFixed(2)}
                              </div>
                              {price > 0 && (
                                <div className={`text-xs ${change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {change24h >= 0 ? '+' : ''}{change24h.toFixed(1)}%
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Real NFTs */}
              {assets.nfts && assets.nfts.length > 0 && (
                <div className="glass">
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <HiOutlinePhotograph className="w-5 h-5 text-pink-400" />
                      <h3 className="text-white font-bold">Your NFTs</h3>
                      <div className="ml-auto text-xs text-pink-400">{assets.nfts.length} items</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {assets.nfts.slice(0, 6).map((nft, index) => (
                        <div key={nft.address || index} className="p-3 bg-pink-500/10 rounded-lg border border-pink-400/20">
                          <div className="aspect-square bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                            {nft.metadata?.image ? (
                              <Image 
                                src={nft.metadata.image} 
                                alt={nft.metadata?.name || 'NFT'} 
                                width={80} 
                                height={80} 
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <HiOutlinePhotograph className="w-8 h-8 text-gray-600" />
                            )}
                          </div>
                          <h4 className="text-white font-semibold text-sm truncate">
                            {nft.metadata?.name || 'Unnamed NFT'}
                          </h4>
                          {nft.collection?.name && (
                            <p className="text-gray-400 text-xs truncate">
                              {nft.collection.name}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {assets.nfts.length > 6 && (
                      <p className="text-center text-gray-400 text-sm mt-3">
                        +{assets.nfts.length - 6} more NFTs
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Real Alerts */}
              {activeAlerts.length > 0 && (
                <div className="glass">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <HiOutlineEye className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-white font-bold">Portfolio Alerts</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <span className="text-red-400 text-xs">{activeAlerts.length} Alert{activeAlerts.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {activeAlerts.map((alert) => (
                        <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                          alert.severity === 'high' ? 'bg-red-500/10 border-red-400' :
                          alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-400' :
                          'bg-gray-500/10 border-gray-400'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold text-sm">{alert.title}</h4>
                            <span className="text-xs text-gray-400">{alert.timestamp}</span>
                          </div>
                          <p className="text-gray-300 text-xs mb-2">{alert.message}</p>
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                            alert.severity === 'high' ? 'bg-red-400/20 text-red-400' :
                            alert.severity === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-gray-400/20 text-gray-400'
                          }`}>
                            {alert.action}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TON Ecosystem Opportunities */}
              {opportunities.length > 0 && (
                <div className="glass">
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <HiSparkles className="w-5 h-5 text-violet-400" />
                      <h3 className="text-white font-bold">Recommended for You</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {opportunities.map((opportunity) => (
                        <div key={opportunity.id} className="p-3 bg-violet-500/10 rounded-lg border border-violet-400/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-violet-400 font-bold">{opportunity.token}</span>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                opportunity.aiScore === 'A+' ? 'bg-green-400/20 text-green-400' :
                                opportunity.aiScore === 'A' ? 'bg-lime-400/20 text-lime-400' :
                                'bg-yellow-400/20 text-yellow-400'
                              }`}>
                                {opportunity.aiScore}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <HiOutlineTrendingUp className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-sm font-semibold">{opportunity.confidence}%</span>
                            </div>
                          </div>
                          <p className="text-white text-sm mb-2">{opportunity.reason}</p>
                          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                            {opportunity.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {assets.jettons?.length === 0 && assets.nfts?.length === 0 && tonBalance === 0 && (
                <div className="glass text-center py-12">
                  <LuWallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2">No Assets Found</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    This wallet appears to be empty or the assets couldn't be loaded.
                  </p>
                  <button
                    onClick={refreshAllData}
                    className="px-4 py-2 bg-blue-400/20 text-blue-400 rounded-lg text-sm hover:bg-blue-400/30"
                  >
                    Refresh Data
                  </button>
                </div>
              )}

              {/* Refresh Real Data Button */}
              <motion.button
                className="w-full glass-button flex items-center justify-center gap-2 py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={refreshAllData}
                disabled={dataLoading}
              >
                <HiOutlineRefresh className={`w-5 h-5 ${dataLoading ? 'animate-spin' : ''}`} />
                <span>{dataLoading ? 'Refreshing...' : 'Refresh Assets Data'}</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
