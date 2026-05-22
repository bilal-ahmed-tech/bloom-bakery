# 🧁 Bloom Bakery

A modern e-commerce bakery platform built with Next.js, TypeScript, Prisma, and Sanity CMS, featuring a beautiful product catalog, secure checkout with Stripe payment processing, comprehensive admin dashboard, and real-time order management.

🔗 **GitHub Repository:** [bloom-bakery](https://github.com/bilal-ahmed-tech/bloom-bakery)

---

## ✨ Features

### 🛍️ Customer Shopping Experience

- Browse curated bakery products with high-quality images
- Product filtering by categories (Cakes, Pastries, Bread, etc.)
- Detailed product pages with descriptions and pricing
- Add products to shopping cart with quantity selection
- Real-time cart updates and total calculations
- Persistent cart storage for session continuity
- Product search across entire catalog
- Customer testimonials and reviews

### 🛒 Shopping Cart & Checkout

- Intuitive cart interface with product details
- Adjust quantities and remove items
- Real-time price calculations with taxes
- Apply coupon codes for discounts
- One-click checkout process
- Guest checkout option
- Saved addresses for returning customers
- Multiple payment method support

### 💳 Secure Payments

- Stripe payment integration for secure transactions
- Payment intent creation with real-time validation
- Multiple payment methods (cards, digital wallets)
- PCI compliance for data security
- Order confirmation immediately after payment
- Failed payment retry mechanism
- Transaction history and receipts

### 📦 Order Management

- Order confirmation emails with details
- Order tracking and status updates
- Order history for customer accounts
- Admin order management system
- Real-time order status visibility
- Order cancellation and refund handling
- Order analytics and reporting

### 🎟️ Coupon & Discount Management

- Create and manage promotional coupons
- Discount percentage or fixed amount options
- Expiration date management
- Usage limit tracking per coupon
- Customer coupon application at checkout
- Admin coupon creation interface
- Discount code validation

### 👤 User Authentication & Accounts

- Secure user registration and account creation
- Email-based authentication system
- Password encryption with bcryptjs
- Session management with NextAuth.js
- Protected customer account pages
- Account profile management
- Order history access
- Wishlist management
- Address book functionality

### 🏪 Admin Dashboard

- Comprehensive admin control panel
- Real-time order monitoring and management
- Product inventory management
- Product creation and editing
- Category organization and management
- Coupon code creation and configuration
- Sales analytics and revenue tracking
- Admin user role management
- Recent orders overview
- Revenue charts and statistics

### 📊 Business Analytics

- Revenue tracking and reporting
- Sales performance metrics
- Product popularity analysis
- Customer order trends
- Discount code effectiveness
- Inventory status monitoring
- Order fulfillment statistics
- Dashboard with key performance indicators

### 📧 Email Communications

- Order confirmation emails with itemized details
- Email notifications for order status updates
- Customer notification system
- Admin alert system for new orders
- Email templates with branding

### 🎨 Product Management

- Sanity CMS integration for content management
- Rich product descriptions and imagery
- Product categorization and filtering
- Category management interface
- Featured products showcase
- Hero section with promotional content
- Testimonials management
- Product images with optimization

### 🌐 Navigation & Routing

- Home page (/) - Featured products and promotions
- Shop page (/shop) - Product catalog
- Categories page (/categories) - Browse by type
- Product detail page (/products/[slug]) - Full product information
- Cart page (/cart) - Shopping cart management
- Checkout page (/checkout) - Payment processing
- Account page (/account) - User dashboard
- About page (/about) - Company information
- Contact page (/contact) - Customer support
- Admin area (/admin) - Admin dashboard and controls
- Auth pages (/login, /register) - User authentication
- Order confirmation page (/orders/confirmation) - Post-purchase
- Protected routes requiring authentication

### 📱 Responsive Design

- Mobile-first approach with Tailwind CSS v4
- 1-column layout on mobile devices (< 640px)
- 2-column grid on tablets (640px - 1024px)
- 3-column grid on desktop (1024px+)
- Responsive navigation with mobile menu
- Touch-friendly buttons and interactions
- Optimized images for all screen sizes
- Flexible spacing and typography
- WhatsApp CTA button for customer support

### ⚡ Performance & Optimization

- Server-side rendering with Next.js App Router
- Optimized database queries with Prisma
- Image optimization with Next.js Image component
- Lazy loading for product images
- Efficient state management with React hooks
- Code splitting for better load times
- Caching strategies for content
- Minimal bundle size

### 🛡️ Security & Best Practices

- Environment variables for sensitive data
- Password encryption with bcryptjs
- NextAuth.js for secure sessions
- CORS protection on API routes
- Input validation on forms
- SQL injection prevention with Prisma
- Secure payment handling with Stripe
- Protected admin routes
- CSRF protection

### ♿ Accessibility

- Semantic HTML elements (main, nav, button, section)
- ARIA labels and roles for screen readers
- Keyboard navigation support
- Alt text on all product images
- Accessible form inputs and labels
- Color contrast compliance
- Focus management in navigation
- Accessible modals and dialogs

### 📡 Real-Time Features

- Live cart synchronization
- Real-time order status updates
- Instant product availability checks
- Live inventory management
- Real-time notification system

---

## 🛠️ Built With

- **Next.js 16.2.4** — React framework with App Router and SSR
- **React 19.2.4** — UI library with hooks and state management
- **TypeScript 5** — Type-safe development for reliability
- **Tailwind CSS 4** — Utility-first CSS for responsive design
- **Prisma 7.8.0** — Modern ORM for database management
- **PostgreSQL** — Relational database for data persistence
- **NextAuth.js 5** — Secure authentication and sessions
- **Sanity CMS** — Headless CMS for content management
- **Stripe** — Payment processing and transactions
- **bcryptjs** — Password hashing and encryption
- **Lucide React** — Modern icon library
- **Sonner** — Toast notifications for user feedback

---

## 📁 Project Structure

<details>
<summary><strong>Click to expand</strong></summary>

```plaintext
bloom-bakery/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (shop)/
│   │   ├── page.tsx (Home/Featured Products)
│   │   ├── shop/
│   │   │   └── page.tsx (Product Catalog)
│   │   ├── categories/
│   │   │   └── page.tsx (Browse Categories)
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.tsx (Product Detail)
│   │   ├── cart/
│   │   │   └── page.tsx (Shopping Cart)
│   │   ├── checkout/
│   │   │   └── page.tsx (Payment & Checkout)
│   │   ├── account/
│   │   │   └── page.tsx (User Account)
│   │   ├── about/
│   │   │   └── page.tsx (About Company)
│   │   └── contact/
│   │       └── page.tsx (Contact Support)
│   ├── admin/
│   │   ├── page.tsx (Admin Dashboard)
│   │   ├── products/
│   │   │   └── page.tsx (Product Management)
│   │   ├── orders/
│   │   │   └── page.tsx (Order Management)
│   │   ├── coupons/
│   │   │   └── page.tsx (Coupon Management)
│   │   └── settings/
│   │       └── page.tsx (Admin Settings)
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts (NextAuth Configuration)
│   │   ├── stripe/
│   │   │   └── payment-intent/
│   │   │       └── route.ts (Stripe Payment Processing)
│   │   └── register/
│   │       └── route.ts (User Registration)
│   ├── orders/
│   │   └── confirmation/
│   │       └── page.tsx (Order Confirmation)
│   ├── studio/
│   │   └── [[...tool]]/
│   │       └── page.tsx (Sanity Studio)
│   ├── layout.tsx (Root Layout)
│   ├── error.tsx (Error Boundary)
│   ├── not-found.tsx (404 Page)
│   └── globals.css (Global Styles)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx (Navigation Bar)
│   │   ├── Footer.tsx (Footer)
│   │   ├── SessionProvider.tsx (Auth Provider)
│   │   └── StoreClosedBanner.tsx (Store Status Banner)
│   ├── shop/
│   │   ├── Hero.tsx (Hero Section)
│   │   ├── FeaturedProducts.tsx (Featured Items)
│   │   ├── FeaturedProductCard.tsx (Product Card)
│   │   ├── Categories.tsx (Category List)
│   │   ├── ShopContent.tsx (Shop Page Content)
│   │   ├── ProductActions.tsx (Add to Cart/Wishlist)
│   │   ├── Testimonials.tsx (Customer Reviews)
│   │   └── WhatsappCTA.tsx (WhatsApp Support)
│   ├── admin/
│   │   ├── AdminSidebar.tsx (Admin Navigation)
│   │   ├── AdminProductsClient.tsx (Product Manager)
│   │   ├── AdminOrdersClient.tsx (Order Manager)
│   │   ├── AdminCouponsClient.tsx (Coupon Manager)
│   │   ├── AdminSettingsClient.tsx (Settings)
│   │   ├── RevenueChart.tsx (Sales Analytics)
│   │   └── RecentOrders.tsx (Order Overview)
│   ├── emails/
│   │   └── OrderConfirmationEmail.tsx (Email Template)
│   └── ui/
│       └── FormComponents.tsx (Reusable Form Elements)
├── lib/
│   ├── actions.ts (Server Actions)
│   ├── admin-actions.ts (Admin Operations)
│   ├── prisma.ts (Prisma Client)
│   ├── sanity.ts (Sanity Client)
│   ├── cart-store.ts (Cart State Management)
│   ├── queries.ts (Database Queries)
│   ├── types.ts (TypeScript Interfaces)
│   ├── validation.ts (Form Validation)
│   ├── formatting.ts (Data Formatting)
│   └── constants.ts (App Constants)
├── sanity/
│   ├── env.ts (Sanity Configuration)
│   ├── structure.ts (CMS Structure)
│   └── lib/
│       ├── client.ts (Sanity Client Setup)
│       ├── image.ts (Image Helpers)
│       └── live.ts (Live Updates)
├── sanity/
│   └── schemaTypes/
│       ├── product.ts (Product Schema)
│       ├── category.ts (Category Schema)
│       ├── testimonial.ts (Testimonial Schema)
│       └── index.ts (Schema Exports)
├── prisma/
│   ├── schema.prisma (Database Schema)
│   └── migrations/ (Schema Versions)
├── public/
│   └── (Images, icons, and static assets)
├── scripts/
│   └── import-products.ts (Data Import Utilities)
├── auth.ts (NextAuth Configuration)
├── sanity.config.ts (Sanity Setup)
├── next.config.ts (Next.js Configuration)
├── tsconfig.json (TypeScript Config)
├── package.json (Dependencies)
└── README.md (Project Documentation)
```

</details>

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- PostgreSQL database (or use Neon for serverless PostgreSQL)
- Sanity account for CMS
- Stripe account for payments
- NextAuth configuration

### Installation

```bash
# Clone the repository
git clone https://github.com/bilal-ahmed-tech/bloom-bakery

# Navigate to the project folder
cd bloom-bakery

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env.local

# Set up the database
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

### Sanity CMS Setup

```bash
# Initialize Sanity Studio (if not already done)
npx sanity@latest init

# Start Sanity development server
npx sanity start
```

---

## 🔧 Available Scripts

- `npm run dev` — Start Next.js development server with hot reload
- `npm run build` — Build production bundle with optimization
- `npm start` — Start production server
- `npm run lint` — Run ESLint for code quality checks
- `npx prisma migrate dev` — Create and run database migrations
- `npx prisma studio` — Open Prisma Studio for database visualization
- `npx sanity start` — Start Sanity Studio for content management
- `npm run postinstall` — Generate Prisma client automatically

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@hostname/database

# NextAuth
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-05-16
SANITY_API_TOKEN=your_api_token

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Email (Optional)
SMTP_FROM=noreply@bloombakery.com
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password

# OAuth (Optional)
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
GOOGLE_ID=your_google_id
GOOGLE_SECRET=your_google_secret
```

---

## � Database Schema
### Key Tables

- **User** — Customer accounts with email and authentication
- **Product** — Bakery items with descriptions, prices, and images
- **Category** — Product categories for organization
- **Cart** — Shopping cart items per user session
- **Order** — Customer orders with status tracking
- **OrderItem** — Individual items within orders
- **Coupon** — Promotional discount codes

---

## 🏪 Admin Dashboard Features

- **Products Management** — Create, edit, and delete bakery products
- **Orders Management** — View, process, and track customer orders
- **Coupons Management** — Create discount codes and manage promotions
- **Store Settings** — Configure business information and policies
- **Analytics** — View revenue charts and sales statistics
- **Recent Orders** — Quick overview of latest transactions

---

## 📸 Key Pages

### Customer Pages

- **Home** — Featured products, hero section, testimonials
- **Shop** — Complete product catalog with filters
- **Categories** — Browse products by type
- **Product Detail** — Full product information and reviews
- **Cart** — Review items before checkout
- **Checkout** — Secure payment processing
- **Account** — User profile and order history

### Admin Pages

- **Dashboard** — Sales overview and analytics
- **Products** — Inventory management
- **Orders** — Order processing and tracking
- **Coupons** — Discount code management
- **Settings** — Store configuration

---

## 🧠 Key Concepts & Architecture

- **Hybrid CMS** — Sanity for content, Prisma for transactional data
- **Type-Safe Development** — TypeScript ensures code reliability
- **Server-Side Rendering** — Next.js App Router for performance
- **Secure Authentication** — NextAuth.js with session management
- **Payment Processing** — Stripe integration for secure transactions
- **Responsive UI** — Tailwind CSS for device flexibility
- **API Routes** — Next.js API routes for backend logic
- **Database Migrations** — Prisma migrations for schema versioning
- **Error Boundaries** — Graceful error handling throughout

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Connect repository to Vercel
# Vercel automatically deploys on push
```

### Environment Variables on Production

1. Go to Vercel project settings
2. Add all environment variables from `.env.local`
3. Restart deployments for changes to take effect

### Database Migration on Production

```bash
# Run migrations in production environment
npx prisma migrate deploy
```

---

## 📸 Screenshots

Add screenshot files under the `screenshots/` folder and reference them here.

### Home Page
Explore featured products and bakery highlights.
<img src="screenshots/Home.png" width="100%" alt="Home page screenshot" />
<br/><br/>

### Shop Page
Browse product listings, categories, and filters.
<img src="screenshots/Shop.png" width="100%" alt="Shop page screenshot" />
<br/><br/>

### Checkout Page
Secure checkout experience with cart review.
<img src="screenshots/Checkout.png" width="100%" alt="Checkout page screenshot" />
<br/><br/>

### Admin Dashboard
Manage products, orders, and coupons from the admin panel.
<img src="screenshots/Admin.png" width="100%" alt="Admin dashboard screenshot" />

---

## 📝 License

MIT License

---

_Built as a full-featured e-commerce platform showcasing Next.js, TypeScript, Prisma, Sanity CMS, Stripe, and NextAuth.js for modern bakery businesses._
