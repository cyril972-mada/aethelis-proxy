export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Methode non autorisee' });
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return res.status(500).json({ error: 'Cle Stripe manquante' });
  const PRICE_IDS = {
    starter:  process.env.STRIPE_PRICE_STARTER  || '',
    pro:      process.env.STRIPE_PRICE_PRO      || '',
    business: process.env.STRIPE_PRICE_BUSINESS || '',
    elite:    process.env.STRIPE_PRICE_ELITE    || '',
  };
  const { plan, email, userId } = req.body || {};
  if (!plan || !PRICE_IDS[plan]) return res.status(400).json({ error: 'Plan invalide' });
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  try {
    const params = new URLSearchParams({
      mode: 'subscription',
      'payment_method_types[0]': 'card',
      'line_items[0][price]': PRICE_IDS[plan],
      'line_items[0][quantity]': '1',
      'success_url': `${appUrl}?upgrade=success&plan=${plan}`,
      'cancel_url': `${appUrl}?upgrade=cancelled`,
    });
    if (email) params.append('customer_email', email);
    if (userId) params.append('metadata[userId]', userId);
    if (plan) params.append('metadata[plan]', plan);
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    const session = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: session.error?.message || 'Erreur Stripe' });
    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
