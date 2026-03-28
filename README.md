# EduPal

> **© Copyright 2026 - Edudje Wisdom Marvellous (Uplix). All Rights Reserved.**
> 
> *This project is proprietary software. Unauthorized copying, distribution, modification, or commercial use of this project, its code, designs, or assets, via any medium, is strictly prohibited.*

## 📱 Project Overview
EduPal is a peer-to-peer study and past question sharing platform designed to solve the problem of inaccessible, unorganized academic resources among university and NCE students in Nigeria. It creates a centralized, secure ecosystem where students can share, discover, and collaborate on study materials.

## 🎯 Core Problem Statement
Students struggle with:
❌ Inconsistent access to past examination questions
❌ Poorly organized or outdated study materials
❌ Lack of trusted platforms for academic content sharing
❌ Over-reliance on informal channels (WhatsApp, Telegram) without version control or moderation

## 💡 Solution
A secure, organized web platform featuring:
✅ **Centralized Repository** - All study materials in one place
✅ **Peer-Verified Content** - Rating and review system for quality control
✅ **CCMAS & NCE Curricula** - Native integration with official NUC and NCCE course catalogs
✅ **Advanced Search & Filtering** - Find resources by course, department, level, and session
✅ **Gamification & Rewards** - Points and download credits for active contributors

## 🛠️ Technical Stack
**Frontend:**
- Next.js (App Router)
- React.js with TypeScript
- Tailwind CSS for styling
- GSAP for advanced animations

**Backend & Database:**
- Supabase (PostgreSQL Database)
- Supabase Auth integration
- Supabase Storage (For avatars and PDF uploads)
- Row Level Security (RLS) and Schema-Bridging pattern

## 📁 Project Structure (Abridged)
```text
EduPal/
├── app/                  # Next.js App Router (Pages & API Routes)
│   ├── (app)/            # Authenticated internal routes (Library, Profile, Study, etc.)
│   ├── auth/             # Authentication endpoints
│   ├── login/            # Login frontend
│   └── signup/           # Signup frontend
├── components/           # Reusable React components (UI, Forms, Modals)
├── lib/                  # Shared utilities (Supabase client, NCE/Degree helpers)
├── public/               # Static assets & icons
├── supabase/             # Supabase configuration and SQL migrations
│   └── migrations/       # Version-controlled DB schema changes
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Project dependencies (UNLICENSED)
```

## 🚀 Key Features

### For Students:
- 📚 **Upload/Download** past questions, lecture notes, and summaries
- ⭐ **Upvote resources** and earn download credits
- 🔍 **Advanced search** with filters (Department, Level, Session)
- 🤖 **AI Study Ready Integration** and NUC Catalogue tracking
- 🎓 **Support for both Degree and NCE Programmes** with seamless UI toggles

### For Administrators:
- 🛡️ **Content moderation** and reporting system
- 🏫 **Institutional oversight** and dynamic department mappings

## 📈 Target Users
- 🎓 **University & NCE Students** - Primary users
- 🏫 **Educational Institutions** - Potential partners
- 👨‍🏫 **Educators** - Future expansion

## 🎯 Unique Value Proposition
*"EduPal transforms chaotic academic resource sharing into a structured, trusted ecosystem where every student can access quality study materials and contribute to collective knowledge."*

## 💼 Business Value
- 🤝 Fosters academic collaboration
- 💰 Reduces photocopy/printing costs
- 🎓 Improves learning outcomes
- 🌐 Creates educational equity
- 📊 Data-driven insights for institutions

## 📅 Project Status
**Current Phase:** Active Development
**Timeline:** 16-week development cycle

---

**Tagline:** *"Your Academic Companion for Smarter Studying"*
