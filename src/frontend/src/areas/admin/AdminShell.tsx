import AppSurface from '../../components/layout/AppSurface';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminRidersPage from './pages/AdminRidersPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminLoginPage from './auth/AdminLoginPage';
import { useAdminAuth } from './auth/useAdminAuth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, List, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import PageContainer from '../../components/layout/PageContainer';

export default function AdminShell() {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <AppSurface>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-foreground text-lg">Loading...</div>
        </div>
      </AppSurface>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  const handleLogout = () => {
    logout();
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  return (
    <AppSurface>
      <PageContainer className="py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-1 text-sm">Bikaner Express Delivery Management</p>
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="riders" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Riders</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <AdminDashboardPage />
          </TabsContent>
          <TabsContent value="orders">
            <AdminOrdersPage />
          </TabsContent>
          <TabsContent value="riders">
            <AdminRidersPage />
          </TabsContent>
          <TabsContent value="reports">
            <AdminReportsPage />
          </TabsContent>
          <TabsContent value="settings">
            <AdminSettingsPage />
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-muted-foreground pt-8">
          <p>© 2026. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline">caffeine.ai</a></p>
        </div>
      </PageContainer>
    </AppSurface>
  );
}
