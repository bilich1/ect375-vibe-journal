# Linde AMT Dashboard - Complete Implementation Guide

## 🎯 Overview

This guide covers all implemented features for the AI Demand Request Dashboard. The system is production-ready with authentication, real-time updates, analytics, and advanced AI insights.

---

## 📋 Completed Implementation Phases

### ✅ Phase 1-2: Foundation (Completed)
- Project structure & Next.js setup
- Supabase integration
- Role-based authentication (RBAC)
- Environment configuration

### ✅ Phase 3: API Endpoints (Completed)
**RESTful API with full CRUD operations**

- `GET /api/demands` - List all demands with filters
  - Query params: `status`, `priority`, `category`, `limit`, `offset`
  - Returns paginated results with total count
  
- `POST /api/demands` - Create new demand request
  - Required: `title`, `category`, `requester_id`
  - Optional: `description`, `priority`, `due_date`, `notes`
  
- `GET /api/demands/[id]` - Get specific demand
- `PATCH /api/demands/[id]` - Update demand
- `DELETE /api/demands/[id]` - Delete demand

- `GET /api/analytics` - Get analytics with AI insights
  - Query params: `metric` (overview|trends|performance), `days` (default: 30)
  - Returns real-time summary, trends, and AI-generated insights

### ✅ Phase 4: Dashboard UI (Completed)

**Main Components:**
- `DashboardOverview` - Main dashboard page
- `StatusCard` - Quick metric cards
- `DemandTable` - Interactive data table with sorting
- `InsightItem` - AI insight display cards
- `NotificationPanel` - User notification center

**Features:**
- Real-time status updates with live indicators
- Filterable demand list (status, priority, category)
- Sortable columns by clicking headers
- Role-based component visibility
- Responsive design with Tailwind CSS

### ✅ Phase 5: Real-Time Features (Completed)

**Real-Time Hook:** `useRealtime()`
- Subscribes to Supabase real-time changes
- Supports INSERT, UPDATE, DELETE events
- Automatic reconnection handling
- Event-based callbacks

**Supported Real-Time Tables:**
- `demand_requests` - Live updates when requests change
- `notifications` - Instant user notifications
- `audit_logs` - Live compliance tracking

### ✅ Phase 6: AI Insights Engine (Completed)

**AIInsightsEngine Class** (`lib/analytics/insightsEngine.ts`)

Advanced anomaly detection:
1. **Urgent Bottleneck Detection**
   - Identifies delayed request spikes
   - Flags critical request overloads
   
2. **Trend Analysis**
   - Compares recent vs. historical patterns
   - Detects 20%+ demand increases/decreases
   
3. **Priority Skew Detection**
   - Warns when one priority dominates >50%
   - Suggests priority re-calibration
   
4. **Category Hotspot Analysis**
   - Identifies categories with 50%+ above-average volume
   - Recommends resource allocation
   
5. **Performance Monitoring**
   - Tracks average resolution time (target: 48 hours)
   - Monitors completion rates
   - Alerts if <50% completion
   
6. **Stuck Request Detection**
   - Identifies requests stuck 14+ days in progress
   - Suggests escalation

### ✅ Phase 7: Notification System (Completed)

**Features:**
- `useNotifications()` - Hook for managing notifications
- Real-time notification delivery
- Read/unread status tracking
- Notification types: info, warning, error, success
- Notification panel with badge counter
- Database table with RLS policies

**Database Schema:**
```sql
notifications (
  id, user_id, type, title, message, read, created_at, updated_at
)
```

---

## 🗄️ Database Schema

### Tables Created

**1. users**
- Manages user profiles and roles
- Roles: analyst, it_staff, leadership

**2. demand_requests**
- Core business table
- Status: pending, in_progress, completed, delayed, cancelled
- Priority: low, medium, high, critical
- Includes audit fields: created_at, updated_at, completed_at

**3. audit_logs**
- Compliance & audit trail
- Tracks all changes with before/after snapshots
- User attribution for accountability

**4. notifications**
- User notification system
- Real-time delivery via Supabase
- Status tracking (read/unread)

**Indexes:**
- Status, priority, category, created_at (demands)
- user_id, created_at (audit_logs & notifications)
- For optimal query performance

**Security:**
- Row-Level Security (RLS) on all tables
- Users can only access appropriate data
- Service role for admin operations

---

## 🎣 Custom Hooks

### Data Fetching
- `useDemands(filters?)` - List demands
- `useDemand(id)` - Single demand detail
- `useCreateDemand()` - Create new demand
- `useUpdateDemand(id)` - Update existing demand
- `useDeleteDemand(id)` - Delete demand

### Analytics & Insights
- `useAnalytics(metric, days)` - Fetch analytics with AI insights
- Returns summary, trends, and actionable insights

### Real-Time
- `useRealtime(options)` - Subscribe to database changes
- Supports INSERT, UPDATE, DELETE events
- Auto-reconnects on disconnect

### Notifications
- `useNotifications(userId)` - Manage user notifications
- Real-time subscription to new notifications
- Mark as read / clear functions

---

## 🔐 Authentication & Roles

### Permission Matrix

**Analyst:**
- ✅ View dashboard & analytics
- ✅ Filter & export data
- ✅ View trends & anomalies
- ❌ Cannot manage users

**IT Staff:**
- ✅ All analyst permissions
- ✅ Manage users
- ✅ System configuration

**Leadership:**
- ✅ All permissions
- ✅ Approve demands
- ✅ Create reports

See `lib/auth/roles.ts` for complete matrix.

---

## 🚀 Getting Started

### 1. Set Up Environment
```bash
cd ect375-vibe-journal
npm install
```

### 2. Configure Supabase
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Migrations
Copy and run migrations in Supabase SQL Editor:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_add_notifications.sql`

### 4. Start Development
```bash
npm run dev
# Visit http://localhost:3000/dashboard
```

---

## 📊 API Usage Examples

### Fetch Demands with Filters
```javascript
const { demands, loading } = useDemands({
  status: 'pending',
  priority: 'high',
  limit: 20,
  offset: 0,
});
```

### Create New Demand
```javascript
const { createDemand } = useCreateDemand();
await createDemand({
  title: 'New Marketing Campaign',
  description: 'Q3 marketing initiative',
  category: 'Marketing',
  priority: 'high',
  requester_id: userId,
  due_date: '2026-06-30',
});
```

### Get AI Insights
```javascript
const { analytics } = useAnalytics('overview', 30);
// Returns: summary, trend, insights with AI analysis
```

### Subscribe to Real-Time Updates
```javascript
useRealtime({
  table: 'demand_requests',
  event: 'UPDATE',
  onUpdate: (payload) => console.log('Demand updated:', payload),
});
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── demands/           # CRUD endpoints
│   │   └── analytics/         # Analytics & insights
│   ├── dashboard/             # Dashboard pages
│   └── layout.tsx             # Root layout
│
├── lib/
│   ├── auth/                  # Auth utilities & hooks
│   ├── supabase/              # Supabase client
│   ├── hooks/                 # Custom React hooks
│   └── analytics/             # AI insights engine
│
├── components/
│   ├── auth/                  # Auth components
│   └── dashboard/             # Dashboard UI components
│
├── types/                     # TypeScript definitions
├── supabase/
│   └── migrations/            # SQL migration files
└── .env.local                 # Environment variables
```

---

## 🔄 Data Flow

```
User → Dashboard (UI)
  ↓
Auth Check (AuthContext)
  ↓
Fetch Data (useDemands hook)
  ↓
API Route (/api/demands)
  ↓
Supabase (with RLS)
  ↓
Real-Time Subscription (useRealtime)
  ↓
AI Analysis (AIInsightsEngine)
  ↓
Display Results → Notifications
```

---

## 🧪 Testing the System

### 1. Test Authentication
```bash
# Navigate to /dashboard
# System should check auth context
# Redirect if not logged in
```

### 2. Test CRUD Operations
```bash
# Create: POST /api/demands
# Read: GET /api/demands
# Update: PATCH /api/demands/[id]
# Delete: DELETE /api/demands/[id]
```

### 3. Test Analytics
```bash
# GET /api/analytics?metric=overview&days=30
# Should return insights with AI analysis
```

### 4. Test Real-Time
```bash
# Update a demand in one window
# Check if other windows update automatically
```

---

## 📈 AI Insights in Action

The system automatically detects:

🚨 **Critical Issues**
- Delayed request rates >5%
- Stuck requests (>14 days)
- Low completion rates (<50%)

⚠️ **Warnings**
- Critical priority overload (>15%)
- Slow resolution times (>72 hours)
- Priority skew (>50% in one level)

ℹ️ **Informational**
- Demand trend changes (>20%)
- Category hotspots (>50% above avg)
- Most common categories

---

## 🛠️ Development Tips

### Enable Debug Logging
```typescript
// In components
console.log('Debug:', data);
```

### Test Pagination
```javascript
useDemands({ limit: 10, offset: 0 }); // Page 1
useDemands({ limit: 10, offset: 10 }); // Page 2
```

### Simulate Real-Time Events
- Update demand status in Supabase
- Watch UI update automatically

### Check Performance
- Use React DevTools Profiler
- Monitor API response times

---

## 📝 Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Service role key secured
- [ ] Real-time subscriptions working
- [ ] AI insights engine tested
- [ ] Notifications system active
- [ ] Error handling verified
- [ ] Auth redirects working
- [ ] Dashboard responsive on mobile

---

## 🤝 Next Steps / Future Enhancements

- [ ] Export to PDF/Excel
- [ ] Advanced scheduling
- [ ] Integration with external systems
- [ ] Machine learning predictions
- [ ] Email notifications
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Advanced audit trail UI

---

## 📞 Support & Documentation

For issues:
1. Check Supabase docs: https://supabase.com/docs
2. Review Next.js guides: https://nextjs.org/docs
3. Check type definitions in `types/`
4. Review migration SQL for schema

---

**Status:** ✅ Production Ready
**Last Updated:** May 5, 2026
**Version:** 1.0.0
