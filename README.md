# AETHELIS Proxy — Guide de déploiement Vercel

## Structure
```
aethelis-proxy/
├── api/
│   ├── claude.js          → Proxy Claude (Anthropic)
│   ├── price.js           → Cours en temps réel (Yahoo Finance)
│   └── stripe-checkout.js → Paiements Stripe
├── vercel.json            → Config Vercel
└── package.json
```

## Déploiement en 5 minutes

### 1. GitHub
1. Va sur github.com → New repository
2. Nom : `aethelis-proxy`
3. Private ✓ → Create repository
4. Upload tous ces fichiers (glisser-déposer)

### 2. Vercel
1. Va sur vercel.com → Add New Project
2. Importe ton repo GitHub `aethelis-proxy`
3. Framework Preset : **Other**
4. Deploy → tu obtiens une URL `https://aethelis-proxy-xxx.vercel.app`

### 3. Variables d'environnement (Vercel → Settings → Environment Variables)

| Nom | Valeur | Obligatoire |
|-----|--------|-------------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | ✅ Pour l'IA |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Pour les paiements |
| `STRIPE_PRICE_STARTER` | `price_xxx` | Pour le plan Starter |
| `STRIPE_PRICE_PRO` | `price_xxx` | Pour le plan Pro |
| `STRIPE_PRICE_BUSINESS` | `price_xxx` | Pour le plan Business |
| `STRIPE_PRICE_ELITE` | `price_xxx` | Pour le plan Elite |
| `APP_URL` | URL de ta plateforme | Pour les redirections Stripe |

### 4. Dans AETHELIS
Paramètres → Admin → URL Proxy Vercel → colle `https://aethelis-proxy-xxx.vercel.app`

## Endpoints disponibles
- `POST /api/claude` → IA Studio + Coach IA
- `GET  /api/price?ticker=MC.PA` → Cours en temps réel
- `POST /api/stripe-checkout` → Créer session paiement

## Coûts
- Vercel Hobby : GRATUIT (100GB bandwidth/mois)
- Anthropic : ~0.003€ par deck généré
- Yahoo Finance : GRATUIT
- Stripe : 1.5% + 0.25€ par transaction réussie
