export default async function handler(req, res) {
    const { address } = req.query;
  
    if (!address) {
      return res.status(400).json({ error: "Missing wallet address" });
    }
  
    try {
      // Fetch Jettons (fungible tokens)
      const jettonsRes = await fetch(
        `https://tonapi.io/v2/accounts/${address}/jettons`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TONAPI_KEY}`, // get free key from tonapi.io
          },
        }
      );
      const jettons = await jettonsRes.json();
  
      // Fetch NFTs
      const nftsRes = await fetch(
        `https://tonapi.io/v2/accounts/${address}/nfts?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TONAPI_KEY}`,
          },
        }
      );
      const nfts = await nftsRes.json();
  
      res.status(200).json({
        jettons: jettons.balances || [],
        nfts: nfts.nft_items || [],
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  