# Linde AMT AI Demand Request Dashboard

An enterprise-grade AI-powered demand request management system built for Linde Advanced Material Technologies. Built with Next.js, Supabase, and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Npm or yarn
- Supabase account with project credentials

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3. **Run database migrations:**
- Open Supabase SQL Editor
- Run the SQL scripts from `supabase/migrations/`
- Verify tables: `users`, `demand_requests`, `audit_logs`, `notifications`

4. **Start the development server:**
```bash
npm run dev
```

5. **Open the app:**
Visit [http://localhost:3000](http://localhost:3000) — you'll see the login page.

## 📋 Features

### Core Functionality
- **Authentication & Authorization** - Supabase Auth with role-based access control
- **Demand Management** - Create, view, update, and track demand requests
- **Real-Time Updates** - WebSocket subscriptions for live data synchronization
- **Notifications** - Real-time alerts for status changes and important events
- **Audit Logging** - Complete audit trail of all changes

### Role-Based Access Control
- **Analyst** - Create and view demand requests
- **IT Staff** - Manage and update requests
- **Leadership** - Full access and reporting

### Advanced Features
- **AI Insights Engine** - Anomaly detection and trend analysis
- **Analytics Dashboard** - Real-time metrics and performance indicators
- **Data Security** - Row-level security (RLS) policies on all tables
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🏗️ Architecture

```
app/
├── page.tsx          - Login page
├── dashboard/        - Main dashboard
└── api/
    ├── demands/      - CRUD operations
    └── analytics/    - AI insights

components/
├── auth/             - Authentication components
└── dashboard/        - Dashboard UI components

lib/
├── supabase/         - Supabase client
├── auth/             - Auth hooks & RBAC
├── analytics/        - AI insights engine
└── hooks/            - Custom React hooks
```

## 📊 API Endpoints

- `GET /api/demands` - List all demand requests
- `POST /api/demands` - Create new demand request
- `GET /api/demands/[id]` - Get specific demand
- `PUT /api/demands/[id]` - Update demand request
- `DELETE /api/demands/[id]` - Delete demand request
- `GET /api/analytics` - Get AI insights and analytics

## 🧪 Testing

1. **Create test data in Supabase SQL Editor:**
```sql
INSERT INTO public.demand_requests (title, description, status, priority, category, requester_id)
VALUES ('Server Upgrade', 'Upgrade production servers', 'pending', 'high', 'IT Infrastructure', auth.uid());
```

2. **Test real-time updates** - Open dashboard in two tabs, create a request in one and see it update in the other

3. **Test API endpoints:**
```bash
curl http://localhost:3000/api/demands
curl http://localhost:3000/api/analytics
```

## 🛠️ Development

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📚 Technologies

- **Frontend:** Next.js 16.2.4, React 19.2.4, TypeScript
- **Backend:** Supabase (PostgreSQL), Node.js
- **State Management:** Zustand
- **Styling:** Tailwind CSS 4
- **Real-Time:** WebSocket subscriptions
- **Security:** JWT, Row-Level Security (RLS)

## 📖 Documentation

- See `DEVELOPMENT.md` for development setup
- See `IMPLEMENTATION.md` for architecture details
- See `QUICKREF.md` for quick reference
- See `COMPLETION_SUMMARY.md` for feature overview

## 🚀 Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Deploy to Vercel:**
- Push to GitHub
- Connect repository to Vercel
- Vercel will auto-deploy on main branch

3. **Environment variables:**
- Set `NEXT_PUBLIC_SUPABASE_URL` and keys in Vercel dashboard
- Ensure database migrations are applied to production

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

[Your License Here]

## 🆘 Support

For issues or questions, feel free to reach out to the development team.
