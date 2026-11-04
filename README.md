# Electro Adam Store

Pour publier ce projet sur GitHub et configurer les déploiements automatiques
sur Vercel, voir [DEPLOYMENT.md](./DEPLOYMENT.md).

Arabic RTL storefront built with React, Vite, Tailwind CSS v4, React Router and Lucide. Requires Node.js 22.12+ (or 20.19+).

## Run locally

```sh
npm install
npm run dev
```

On PowerShell with scripts disabled, use `npm.cmd` instead of `npm`.

```sh
npm run build
npm run preview
```

Components are organized under `src/components/{layout,home,common}`. Mock catalog and reviews live in `src/data/products.js`. Routes include the homepage, category listings, search results, product details and informational pages. The cart persists in localStorage; no payment, authentication or order APIs are connected.

Copy `.env.example` to `.env` and set `VITE_WHATSAPP_NUMBER` to your international business number (digits only). Restart Vite after changing it. Until configured, the WhatsApp control shows a coming-soon message.

The original logo is preserved at `public/assets/logo.jpg`. Small temporary image excerpts come from the supplied `desin/accueil.jpeg`; replace them with licensed high-resolution product photography and illustrations before launch. `drone.svg` is a temporary vector illustration. The full reference screenshot is never rendered on the website. Cairo loads through Google Fonts with a sans-serif fallback.

Prices, discounts, ratings and reviews are explicitly illustrative. Delivery, guarantees, policies and social links must be finalized before launch. Social icons currently lead to the contact information page.
