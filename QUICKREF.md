# Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# 3. Run migrations in Supabase SQL Editor
# Copy contents of supabase/migrations/*.sql

# 4. Start dev server
npm run dev

# 5. Visit dashboard
# http://localhost:3000/dashboard
```

---

## 📦 Key Files & Their Purpose

### Entry Points
- `app/layout.tsx` - Root layout
- `app/dashboard/page.tsx` - Dashboard entry point
- `app/page.tsx` - Home page

### Core Systems
- `lib/auth/` - Authentication, roles, permissions
- `lib/supabase/` - Supabase client
- `lib/analytics/insightsEngine.ts` - AI insights

### Custom Hooks  
- `lib/hooks/useDemands.ts` - Demand CRUD
- `lib/hooks/useAnalytics.ts` - Analytics data
- `lib/hooks/useRealtime.ts` - Real-time updates
- `lib/hooks/useNotifications.ts` - Notifications

### Components
- `components/dashboard/DashboardOverview.tsx` - Main page
- `components/dashboard/DemandTable.tsx` - Data table
- `components/dashboard/Cards.tsx` - UI cards
- `components/auth/ProtectedComponent.tsx` - Permission-based rendering

### API Routes
- `app/api/auth/` - Login/logout
- `app/api/demands/` - CRUD operations
- `app/api/analytics/` - Analytics & insights

---

## 🔗 Common Tasks

### Fetch Demands
```typescript
import { useDemands } from '@/lib/hooks/useDemands';

function MyComponent() {
  const { demands, loading, error } = useDemands({
    status: 'pending',
    priority: 'high'
  });
  
  return <div>{demands.length} high priority pending demands</div>;
}
```

### Get Analytics with AI Insights
```typescript
import { useAnalytics } from '@/lib/hooks/useAnalytics';

function Analytics() {
  const { analytics, loading } = useAnalytics('overview', 30);
  
  return <div>
    {analytics?.summary?.total} total requests
    {analytics?.insights?.map(insight => (
      <div key={insight.message}>{insight.message}</div>
    ))}
  </div>;
}
```

### Subscribe to Real-Time Changes
```typescript
import { useRealtime } from '@/lib/hooks/useRealtime';

function RealTimeDemo() {
  useRealtime({
    table: 'demand_requests',
    event: 'UPDATE',
    onUpdate: (payload) => console.log('Updated:', payload)
  });
  
  return <div>Listening to live updates...</div>;
}
```

### Render Based on Permissions
```typescript
import { ProtectedComponent } from '@/components/auth/ProtectedComponent';

function AdminPanel() {
  return (
    <ProtectedComponent 
      requiredPermission="manageUsers"
      fallback={<div>Access Denied</div>}
    >
      <div>Admin content only</div>
    </ProtectedComponent>
  );
}
```

---

## 🏗️ Architecture

```
Frontend (React/Next.js)
    ↓
Custom Hooks (useDemands, useAnalytics)
    ↓
API Routes (/api/*)
    ↓
Supabase Backend
    ├─ Database (PostgreSQL)
    ├─ Auth (JWT)
    ├─ Real-time (Subscriptions)
    └─ Functions (optional)
```

---

## 🔐 Permission System

**Check permissions:**
```typescript
import { hasPermission, ROLE_PERMISSIONS } from '@/lib/auth/roles';

hasPermission('analyst', 'viewDashboard'); // true
hasPermission('analyst', 'manageUsers');   // false
```

**All permissions:**
```typescript
ROLE_PERMISSIONS.analyst = {
  viewDashboard: true,
  viewAnalytics: true,
  filterData: true,
  exportData: true,
  viewTrends: true,
  viewAnomalies: true,
  createReports: false,
  manageUsers: false,
  manageSystem: false,
  approveDemands: false,
}
```

---

## 🗄️ Database Quick Reference

### Demand Request
```sql
SELECT * FROM demand_requests 
WHERE status = 'pending' 
  AND priority = 'critical'
ORDER BY created_at DESC;
```

### User Info
```sql
SELECT id, name, email, role FROM users WHERE role = 'leadership';
```

### Get Insights
```sql
SELECT * FROM demand_requests 
WHERE created_at > NOW() - INTERVAL '30 days'
ORDER BY status, priority DESC;
```

---

## 🐛 Debugging

### Check Auth State
```typescript
const { user, loading, error } = useAuthContext();
console.log('User:', user?.name, 'Role:', user?.role);
```

### Inspect API Response
```typescript
const response = await fetch('/api/demands?status=pending');
const data = await response.json();
console.log('Demands:', data);
```

### Test Real-Time Connection
```typescript
useRealtime({
  table: 'demand_requests',
  onInsert: (p) => console.log('Insert:', p),
  onUpdate: (p) => console.log('Update:', p),
  onDelete: (p) => console.log('Delete:', p),
});
```

---

## 📊 Sample Data Creation

```sql
-- Add test user
INSERT INTO users (id, email, name, role)
VALUES ('test-id', 'analyst@linde.com', 'Test Analyst', 'analyst');

-- Add test demand
INSERT INTO demand_requests 
  (title, category, priority, requester_id, status)
VALUES 
  ('Test Demand', 'Engineering', 'high', 'test-id', 'pending');
```

---

## ⚡ Performance Tips

1. **Use filters** - Don't fetch all data
   ```typescript
   useDemands({ status: 'pending' }) // Good
   useDemands({}) // Fetches everything - avoid
   ```

2. **Pagination** - Use limit/offset
   ```typescript
   useDemands({ limit: 50, offset: 0 })
   useDemands({ limit: 50, offset: 50 })
   ```

3. **Real-time carefully** - Only subscribe when needed
   ```typescript
   useRealtime({ table: 'demand_requests', event: 'UPDATE' })
   // Not: useRealtime({ table, event: '*' }) // Too many events
   ```

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "User not found" | Run migrations, check auth setup |
| "RLS policy error" | Verify service role key, RLS policies |
| "Real-time not working" | Check Supabase real-time is enabled |
| "Slow queries" | Add indexes, use filters, limit results |
| "CORS error" | Check Supabase URL configuration |

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [React Docs](https://react.dev)

---

## 📝 Checklists

### Before Deployment
- [ ] All env vars set
- [ ] Migrations applied
- [ ] RLS enabled
- [ ] Auth working
- [ ] Real-time tested
- [ ] Analytics working

### Adding New Feature
- [ ] Create types in `types/`
- [ ] Create API route in `app/api/`
- [ ] Create hook in `lib/hooks/`
- [ ] Create component in `components/`
- [ ] Test with permissions
- [ ] Add to real-time subscriptions (if needed)
