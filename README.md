# 🎂 Bloom Bakery

An elegant e-commerce platform for a modern bakery, built with Next.js, Sanity CMS, Stripe payments, and Prisma.

🔗 **Status:** Currently in development (not yet deployed)

---

## ✨ Features

### 🛍️ Shop & Browse

- Beautiful product catalog powered by Sanity CMS
- Product filtering by category
- Product search functionality
- High-quality product images with lazy loading
- Detailed product information with descriptions
- Real-time inventory tracking
- Product ratings and reviews display

### 🛒 Shopping Cart Management

- Add/remove items from cart
- Adjust item quantities
- Persistent cart using localStorage
- Real-time cart total calculation
- Cart item count badge in navigation
- Empty cart state messaging
- View cart details anytime

### 💳 Secure Checkout & Payment

- Multi-step checkout process
- Secure payment processing with Stripe
- Multiple payment method support
- Order summary review before payment
- Real-time currency conversion (PKR/USD)
- Coupon/discount code application
- Free delivery threshold settings
- Automatic delivery fee calculation

### 🎟️ Coupon & Discount System

- Apply coupon codes at checkout
- Discount calculation and display
- Active coupon validation
- Expired coupon detection
- Real-time discount preview
- Coupon code error handling

### 📦 Order Management

- Create and track orders
- Order status tracking (Pending → Confirmed → Preparing → Ready → Delivered)
- View order history
- Order details with items and pricing
- Delivery and pickup order types
- Time slot selection for delivery
- Special instructions/notes for orders
- Order confirmation via email

### 👤 User Authentication

- Secure user registration and login
- Email-based account management
- Password encryption with bcryptjs
- Session management with NextAuth
- Protected routes for authenticated users
- User profile management
- Order history linked to user accounts

### 📧 Email Notifications

- Order confirmation emails
- Shipment/delivery status updates
- Payment receipt emails
- Marketing and promotional emails
- Powered by Resend email service

### 🏪 Store Management (Admin)

- Store open/closed status toggle
- Delivery fee configuration
- Free delivery threshold settings
- Order cutoff time management
- Store-wide announcements
- Dashboard for order monitoring
- Admin order management interface

### 🌐 Navigation & Routing

- Home page (/) - featured products
- Shop page (/shop) - product catalog
- Product detail page (/product/:id) - full product info
- Cart page (/cart) - cart review
- Checkout page (/checkout) - payment processing
- Order confirmation page
- User dashboard with order history
- Admin dashboard for management
- 404 page for invalid routes

### 📱 Responsive Design

- Mobile-first approach with Tailwind CSS v4
- 1-column layout on mobile devices
- 2-column grid on tablets
- 3-4 column grid on desktop
- Responsive navigation with hamburger menu
- Touch-friendly button sizing
- Optimized images for all screen sizes

### 🛡️ Security Features

- Secure payment handling with Stripe
- Password hashing and encryption
- Protected API routes
- Environment variable protection
- CSRF protection
- SQL injection prevention via Prisma

### ♿ Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance
- Accessible form inputs

---

## 🛠️ Built With

- **Next.js 16.2.4** — React framework with App Router and SSR
- **React 19.2.4** — UI library with hooks
- **TypeScript 5** — Type-safe development
- **Tailwind CSS 4** — Utility-first CSS for responsive design
- **Prisma 7.8.0** — ORM for database management
- **PostgreSQL** — Relational database with Prisma Adapter
- **Sanity CMS 5.23.0** — Headless CMS for content management
- **Stripe** — Payment processing
- **NextAuth.js 5** — Authentication solution
- **Resend** — Email service
- **bcryptjs** — Password hashing
- **Lucide React** — Icon library

---

## 📁 Project Structure

<details>
<summary><strong>Click to expand</strong></summary>

```plaintext
bloom-bakery/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (shop)/
│   │   ├── page.tsx (Home)
│   │   ├── shop/page.tsx (Products)
│   │   ├── product/[id]/page.tsx
│   │   ├── cart/page.tsx
│   │   └── checkout/page.tsx
│   ├── admin/
│   │   ├── page.tsx (Dashboard)
│   │   └── orders/page.tsx
│   ├── orders/page.tsx (User Orders)
│   ├── api/
│   │   ├── auth/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── coupons/
│   │   └── payments/
│   ├── layout.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   └── OrderManagement.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── Cart.tsx
│   │   └── Checkout.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── emails/
│   │   ├── OrderConfirmation.tsx
│   │   └── ShippingUpdate.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Loading.tsx
│       └── Toast.tsx
├── lib/
│   ├── actions.ts (Shop Actions)
│   ├── admin-actions.ts (Admin Actions)
│   ├── prisma.ts (Prisma Client)
│   ├── sanity.ts (Sanity Client)
│   ├── queries.ts (GROQ Queries)
│   ├── validation.ts (Form Validation)
│   ├── constants.ts
│   ├── types.ts
│   └── formatting.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── sanity/
│   ├── env.ts
│   ├── structure.ts
│   ├── lib/
│   │   ├── client.ts
│   │   ├── image.ts
│   │   └── queries.ts
│   └── schemaTypes/
│       ├── product.ts
│       ├── category.ts
│       └── index.ts
├── public/
│   ├── images/
│   └── icons/
├── auth.ts
├── sanity.cli.ts
├── sanity.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

</details>

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- PostgreSQL database
- Stripe account for payments
- Sanity account for CMS
- Resend account for emails

### Installation

```bash
# Clone the repository
# Repository coming soon on GitHub

# Navigate to the project folder (once repository is available)
cd bloom-bakery

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env.local

# Set up the database
npx prisma migrate dev

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for production

```bash
npm run build
npm start
```

---

## 🔧 Available Scripts

- `npm run dev` — Start Next.js development server with hot reload
- `npm run build` — Build production bundle with optimization
- `npm start` — Start production server
- `npm run lint` — Run ESLint for code quality
- `npx prisma migrate dev` — Create and run database migrations
- `npx prisma studio` — Open Prisma Studio for database visualization

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bloom_bakery

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# NextAuth
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Resend (Email)
RESEND_API_KEY=your_resend_key
```

---

## 📸 Screenshots

### Home Page — Featured Products & Categories

Browse and discover our bakery products with beautiful imagery
<img src="screenshots/Home.png" width="100%" alt="Home page with featured products" />
<br/><br/>

### Shop Page — Product Catalog & Filtering

Complete product catalog with filtering, search, and sorting options
<img src="screenshots/Shop.png" width="100%" alt="Shop page with product grid" />
<br/><br/>

### Checkout Page — Secure Payment

Multi-step checkout with Stripe integration and order review
<img src="screenshots/Checkout.png" width="100%" alt="Checkout page with payment form" />
<br/><br/>

### Order Tracking — User Dashboard

View order history, status updates, and delivery tracking
<img src="screenshots/Orders.png" width="100%" alt="Order dashboard" />

---

## 📝 License

MIT License

_Built as a full-featured e-commerce platform showcasing Next.js, Sanity CMS, Stripe payments, and Prisma database management._
