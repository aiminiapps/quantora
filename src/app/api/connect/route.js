import { NextResponse } from 'next/server';

// Ensure these are in your .env.local file
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const CHAINS = [
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', source: 'alchemy' },
  { id: '0x89', name: 'Polygon', symbol: 'MATIC', source: 'moralis' },
  { id: '0x38', name: 'BSC', symbol: 'BNB', source: 'moralis' }
];

// --- Helper: Fetch via Alchemy (Ethereum) ---
async function fetchAlchemyData(address) {
  try {
    const url = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        { jsonrpc: "2.0", id: 1, method: "eth_getBalance", params: [address, "latest"] },
        // Add token balances call here if needed, keeping it light for now
      ])
    });

    const data = await response.json();
    const ethBalanceHex = data[0].result;
    const nativeBalance = parseInt(ethBalanceHex, 16) / 1e18;
    
    return {
      chain: 'Ethereum',
      nativeBalance,
      price: 2600, // Replace with real price fetch in production
      symbol: 'ETH'
    };
  } catch (error) {
    console.error("Alchemy Error:", error);
    return null;
  }
}

// --- Helper: Fetch via Moralis (Polygon/BSC) ---
async function fetchMoralisData(address, chain) {
  try {
    const response = await fetch(`https://deep-index.moralis.io/api/v2/${address}/balance?chain=${chain.id}`, { 
      headers: { 'X-API-Key': MORALIS_API_KEY } 
    });
    const data = await response.json();

    return {
      chain: chain.name,
      nativeBalance: parseFloat(data.balance) / 1e18,
      price: chain.name === 'Polygon' ? 0.85 : 320, // Replace with real price fetch
      symbol: chain.symbol
    };
  } catch (error) {
    console.error(`Moralis Error (${chain.name}):`, error);
    return null;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 400 });

    // Parallel Fetching
    const promises = CHAINS.map(chain => {
      if (chain.source === 'alchemy') return fetchAlchemyData(wallet);
      return fetchMoralisData(wallet, chain);
    });

    const results = await Promise.all(promises);
    
    // Process & Calculate Total
    let totalValue = 0;
    const assets = results.filter(r => r).map(item => {
      const value = item.nativeBalance * item.price;
      totalValue += value;
      return {
        ...item,
        value: value.toFixed(2),
        balance: item.nativeBalance.toFixed(4)
      };
    });

    // Sort by value
    assets.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

    return NextResponse.json({
      totalValue: totalValue.toFixed(2),
      assets
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}