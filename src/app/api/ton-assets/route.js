export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get("address")
  
    if (!address) {
      return new Response(
        JSON.stringify({ error: "Missing wallet address" }),
        { status: 400 }
      )
    }
  
    try {
      // Call Toncenter API
      const resp = await fetch(
        `https://toncenter.com/api/v2/getAddressInformation?address=${address}`
      )
      const data = await resp.json()
  
      if (!data.ok) {
        return new Response(
          JSON.stringify({ error: "Invalid response from Toncenter" }),
          { status: 400 }
        )
      }
  
      const tonBalance = data.result.balance
        ? parseInt(data.result.balance, 10) / 1e9
        : 0
  
      return new Response(
        JSON.stringify({
          tonBalance,
          accountState: data.result.state,
          accountType: data.result.account_type,
        }),
        { status: 200 }
      )
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500 }
      )
    }
  }
  