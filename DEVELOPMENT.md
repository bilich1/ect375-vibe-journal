# Linde AMT AI Demand Request Dashboard - Development Setup Guide

## Project Overview

This is a Next.js/React web application with Supabase backend for managing and analyzing Demand Requests at Linde Advanced Material Technologies. The system provides real-time data, role-based access control, and AI-driven insights.

## Completed Tasks (Phase 1-2)

### ✅ Task 1: Project Setup
- [x] Initialized Next.js project structure with TypeScript
- [x] Configured folder hierarchy:
  - `lib/`: Reusable utilities (auth, Supabase client)
  - `types/`: TypeScript interfaces
  - `components/`: React components
  - `app/api/`: API routes
  - `supabase/migrations/`: Database schemas

### ✅ Task 2: Install Dependencies & Authentication Infrastructure
- [x] Installed Supabase client library (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] Installed state management library (Zustand)
- [x] Created authentication system:
  - `types/auth.ts`: Core auth interfaces (User, AuthState, UserRole)
  - `lib/auth/roles.ts`: Role-based permission matrix
  - `lib/auth/useAuth.ts`: Auth hook for client components
  - `lib/auth/AuthContext.tsx`: Global auth context provider
  - `components/auth/ProtectedComponent.tsx`: Permission-based component wrapper
  - `lib/supabase/client.ts`: Supabase client initialization
  - `app/api/auth/login.ts`: Login API endpoint
  - `app/api/auth/logout.ts`: Logout API endpoint
  - `supabase/migrations/001_initial_schema.sql`: Database schema with RLS policies

## User Roles & Permissions

Three predefined roles with specific permissions:

### 🔵 Business Analyst (`analyst`)
- View dashboard & analytics
- Filter & export data
- View trends & anomalies
- Cannot manage users or system

### 🟢 IT Staff (`it_staff`)
- All analyst permissions
- Manage users
- Manage system settings
- Monitor access

### 🟣 Leadership (`leadership`)
- All analyst & IT staff permissions
- Approve demands
- Create reports
- Make strategic decisions

See `lib/auth/roles.ts` for complete permission matrix.

## Environment Variables

Add these to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

> **Note:** Service Role Key should only be used on the server-side for privileged operations.

## Database Schema

Run the migration file in Supabase:

**Key Tables:**
- `users` - User profiles with roles
- `demand_requests` - All demand requests with status tracking
- `audit_logs` - Audit trail for compliance

**Security:**
- Row-Level Security (RLS) enabled on all tables
- Users can only see appropriate data based on their role

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local` and add your Supabase credentials

3. **Apply database migrations:**
   - Go to Supabase Dashboard
   - Open SQL Editor
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Run the migration

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Next Steps (Phase 3+)

- [ ] Dashboard UI with real-time data
- [ ] Demand request filtering & sorting
- [ ] Analytics & visualization components
- [ ] AI insights engine (trend detection, anomaly detection)
- [ ] Notification system
- [ ] Export/sharing functionality

## File Structure

```
.
├── app/
│   ├── api/auth/           # Auth endpoints
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   └── auth/               # Auth components
├── lib/
│   ├── auth/               # Auth utilities
│   └── supabase/           # Supabase client
├── types/
│   └── auth.ts             # Type definitions
├── supabase/
│   └── migrations/         # Database schemas
└── .env.local              # Environment variables
```

## Development Standards

- Use TypeScript for type safety
- Implement RLS policies for data security
- Use `ProtectedComponent` for permission-based rendering
- Add audit logs for important actions
- Follow role-based access patterns

---

**Status:** ✅ Phase 1-7 Complete (Production Ready)
**Last Updated:** May 5, 2026
**Version:** 1.0.0

For detailed implementation docs, see [IMPLEMENTATION.md](IMPLEMENTATION.md)
