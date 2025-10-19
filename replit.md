# TUHO Healthy Foods - E-commerce Website

## Overview
TUHO Healthy Foods is a Vietnamese e-commerce platform selling organic and healthy food products. The website is built with React, Vite, TypeScript, and uses Tailwind CSS for styling.

## Recent Changes (October 19, 2025)

### Added Legal & Policy Pages
- **Terms of Service** (`/terms-of-service`) - Comprehensive terms and conditions for using the website and services
- **Privacy Policy** (`/privacy-policy`) - Detailed privacy policy covering data collection, usage, and protection
- **Data Removal** (`/data-removal`) - Policy and procedures for requesting personal data deletion

All three pages are available in Vietnamese and follow the same design pattern as existing support pages.

## Project Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API (CartContext)
- **Forms**: React Hook Form with Zod validation
- **Backend**: Express.js
- **Database**: PostgreSQL (Neon)
- **Session Management**: express-session with connect-pg-simple

### Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── layouts/      # MainLayout, Navbar, Footer
│   │   └── ui/           # shadcn/ui components
│   ├── context/          # CartContext
│   ├── pages/            # All page components
│   │   ├── support/      # Support pages (FAQ, Shipping, Refund, Privacy)
│   │   ├── TermsOfService.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   └── DataRemoval.tsx
│   └── App.tsx           # Main app with routes
server/
└── index.ts              # Express server
```

### Key Routes
- `/` - Home
- `/products` - Product listing
- `/products/:slug` - Product details
- `/about` - About page
- `/blog` - Blog listing
- `/blog/:slug` - Blog post
- `/contact` - Contact page
- `/certificates` - Certificates page
- `/support/shipping` - Shipping policy
- `/support/refund` - Refund policy
- `/support/faq` - FAQ
- `/support/privacy` - Privacy information
- `/terms-of-service` - Terms of Service (NEW)
- `/privacy-policy` - Privacy Policy (NEW)
- `/data-removal` - Data Removal Policy (NEW)

## User Preferences
- Language: Vietnamese
- Focus on organic and healthy food products
- Clean, modern design with green color scheme

## Development

### Running the Project
The project uses a single workflow: "Start application" which runs `npm run dev`

### Key Features
- Lazy-loaded routes for better performance
- Responsive design
- Shopping cart functionality
- Blog system
- Product catalog
- Support pages with company policies

## Company Information
- **Name**: CÔNG TY TNHH TUHO HEALTHY FOOD
- **Tax ID**: 6001773821
- **Address**: Thôn Hải Hà, Xã Ea Tân, Huyện Krông Năng, Tỉnh Đắk Lắk, Việt Nam
- **Email**: tuhohealthyfood@gmail.com
- **Hotline**: 0398 377 304
