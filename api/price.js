export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'ticker manquant' });
  if (!/^[A-Za-z0-9.\-^=]+$/.test(ticker)) return res.status(400).json({ error: 'ticker invalide' });
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000)
    });
    const data = await response.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return res.status(404).json({ error: 'cours introuvable' });
    return res.status(200).json({
      ticker: ticker.toUpperCase(),
      price: meta.regularMarketPrice,
      currency: meta.currency || 'EUR',
      previousClose: meta.previousClose || null,
      change: meta.regularMarketPrice - (meta.previousClose || meta.regularMarketPrice),
      changePct: meta.previousClose ? ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100) : 0,
      name: meta.shortName || ticker,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
