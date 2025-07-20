# QR Pro - Multi-Niche Business QR Platform

## Overview

QR Pro is a comprehensive business-focused QR code platform positioned for multi-niche markets including restaurants, real estate, creators, and small businesses. The platform features trackable, editable QR codes with built-in analytics, moving beyond basic generation to provide real business intelligence. Users get 1 free QR code, with a $15/month Pro subscription offering unlimited QR codes, analytics dashboard, dynamic URL updates, and branded customization.

## User Preferences

Preferred communication style: Simple, everyday language.
Target deployment: Railway production environment (Node.js 18).

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend:

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Payment Integration**: Stripe for subscription management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store

## Key Components

### Authentication System
- **Provider**: Passport.js with Local Strategy for Railway deployment
- **Session Storage**: PostgreSQL-backed session store with connect-pg-simple
- **Security**: HTTP-only cookies with secure settings for production
- **User Management**: Email-based user registration with bcrypt password hashing
- **Login Method**: Email and password authentication with registration support
- **Password Reset**: Secure token-based password reset with email confirmation

### Database Schema
- **Users Table**: Stores user profile, Stripe customer info, and subscription status
- **QR Codes Table**: Stores QR code data with customization options
- **Sessions Table**: Manages user authentication sessions

### Subscription System
- **Provider**: Stripe for payment processing
- **Tiers**: Free (1 QR code limit) and Pro (unlimited)
- **Features**: Subscription status tracking with automatic limit enforcement

### QR Code Generation & Analytics
- **Dynamic QR Codes**: Editable destination URLs without regenerating QR code (redirect through /r/:id)
- **Analytics Dashboard**: Comprehensive scan tracking with device detection, location data, and performance metrics
- **Branded Customization**: Size, color, and logo options for Pro users while maintaining scannability
- **Business Intelligence**: Scan analytics with device breakdown, country tracking, and engagement metrics
- **Management**: Full CRUD operations with user ownership validation and soft deletion

## Data Flow

1. **Authentication**: Users log in through Replit Auth, creating/updating user records
2. **QR Creation**: Frontend sends QR data to backend, which generates and stores the QR code
3. **Subscription**: Stripe handles payment processing and webhook updates for subscription status
4. **Access Control**: Backend enforces subscription limits before allowing QR code creation
5. **Analytics**: QR code scans are tracked and stored for user analytics

## External Dependencies

### Core Dependencies
- **pg**: PostgreSQL database connection for Railway
- **drizzle-orm**: Type-safe database ORM with node-postgres driver
- **stripe**: Payment processing
- **nodemailer**: Email service integration
- **qrcode**: QR code generation
- **passport + passport-local**: Local authentication strategy
- **bcrypt**: Password hashing for secure authentication

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI components
- **@stripe/stripe-js + @stripe/react-stripe-js**: Stripe integration
- **wouter**: Lightweight routing
- **tailwindcss**: Utility-first CSS framework

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Vite HMR for frontend, tsx for backend auto-restart
- **Database**: Neon PostgreSQL with connection pooling

### Railway Production Deployment
- **Platform**: Railway.app with Node.js 18+ runtime
- **Build Process**: Vite builds frontend to `dist/public`, esbuild bundles backend
- **Static Serving**: Express serves built frontend files
- **Database**: Railway PostgreSQL with SSL support
- **Environment**: Production PostgreSQL, Stripe integration, Gmail SMTP
- **Required Environment Variables**: 
  - DATABASE_URL (auto-provided by Railway PostgreSQL)
  - STRIPE_SECRET_KEY and VITE_STRIPE_PUBLIC_KEY (use test keys for testing: sk_test_... and pk_test_...)
  - SESSION_SECRET for secure sessions
  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE for Gmail

### Testing with Stripe
- **Test Mode**: Use test keys (sk_test_... and pk_test_...) in Railway environment
- **Test Cards**: Use 4242 4242 4242 4242 with any future expiry and CVC
- **Live Mode**: Only switch to live keys (sk_live_... and pk_live_...) for production

### Recent Changes
- **July 20, 2025**: Implemented multi-niche positioning strategy with trackable QR codes for real businesses
- **July 20, 2025**: Added comprehensive analytics dashboard with scan tracking, device detection, and performance metrics
- **July 20, 2025**: Implemented dynamic QR codes allowing destination URL updates without changing QR code
- **July 20, 2025**: Enhanced QR generator with branded customization options (colors, sizes) for Pro users
- **July 20, 2025**: Added QR scan analytics table with detailed tracking (device type, location, timestamps)
- **July 20, 2025**: Created redirect system (/r/:id) for trackable QR codes with automatic analytics recording
- **July 20, 2025**: Updated homepage messaging to "Trackable QR Codes for Real Businesses" targeting multiple industries
- **July 20, 2025**: Added industry showcase section featuring restaurants, real estate, creators, and small businesses
- **July 20, 2025**: Enhanced Pro features with analytics dashboard, dynamic QR codes, and branded customization
- **July 16, 2025**: Successfully migrated from Replit Agent to standard Replit environment with PostgreSQL database setup
- **July 16, 2025**: Enhanced billing period display with improved fallback data for Railway deployment
- **July 16, 2025**: Fixed subscription details API to handle cases without Stripe configuration
- **July 16, 2025**: Improved frontend subscription query logic to prevent authentication errors
- **July 16, 2025**: Simplified subscription management - removed reactivation, users purchase new subscription after cancellation
- **July 16, 2025**: Added modern cityscape background image to landing page hero section
- **July 16, 2025**: Fixed account deletion to work immediately with proper Stripe cancellation
- **July 16, 2025**: Enhanced subscription management with accurate billing period display from Stripe
- **July 16, 2025**: Completed full migration from Replit Agent to standard Replit environment with UI updates
- **July 16, 2025**: Updated landing page features - changed "Full Customization" to "Unlimited QR Generation"
- **July 16, 2025**: Standardized Pro pricing across all pages ($15/month with Unlimited QR Codes, Full Customization, Cloud Storage, Priority Support)
- **July 16, 2025**: Added custom favicon with QR Pro branding
- **July 16, 2025**: Added customer service email to settings (clientservicesdigital@gmail.com)
- **July 16, 2025**: Enhanced password reset email for Railway production deployment with all user-requested updates
- **July 16, 2025**: Updated landing page feature section to highlight "Unlimited QR Generation" instead of customization
- **July 16, 2025**: Updated all pricing information across pages to match Pro plan specifications ($15/month, Unlimited QR Codes, Full Customization, Cloud Storage, Priority Support)
- **July 16, 2025**: Added favicon and improved HTML meta tags for production deployment
- **July 16, 2025**: Added customer service email in settings page (clientservicesdigital@gmail.com)
- **July 16, 2025**: Enhanced password reset email template for Railway production deployment with proper URL handling
- **July 16, 2025**: Fixed Railway deployment port configuration to use process.env.PORT for dynamic port assignment
- **July 16, 2025**: Fixed account deletion error that was crashing due to incorrect user ID access
- **July 16, 2025**: Added subscription reactivation functionality with full Stripe integration
- **July 15, 2025**: Fixed subscription cancellation error with invalid date handling
- **July 15, 2025**: Removed color customization from QR code generation for better scannability
- **July 15, 2025**: Fixed subscription system with Stripe Checkout Sessions for Railway deployment
- **July 15, 2025**: Successfully tested subscription payment flow with test cards

### Configuration Management
- **Environment Variables**: Database URL, Stripe keys, SMTP settings, session secrets
- **Build Scripts**: Separate dev/build/start scripts for different environments
- **Type Safety**: Full TypeScript coverage with strict configuration