import { useEffect } from 'react';
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

export default function AdminShell() {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <AppSurface>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
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
      <div className="p-4 max-w-6xl mx-auto pb-8">
        <div className="mb-6 pt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/80 mt-1">Bikaner Express Delivery Management</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="bg-white/10 text-white border-white/20 hover:bg-white/20">
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

        <div className="text-center text-xs text-white/60 pt-8">
          <p>© 2026. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline">caffeine.ai</a></p>
        </div>
      </div>
    </AppSurface>
  );
}
