import { AuthProvider } from '@/lib/auth/AuthContext';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardOverview />
    </AuthProvider>
  );
}
