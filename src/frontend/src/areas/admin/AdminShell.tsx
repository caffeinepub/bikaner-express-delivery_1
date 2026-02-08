import { useState } from 'react';
import AppSurface from '../../components/layout/AppSurface';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LayoutDashboard, List } from 'lucide-react';

export default function AdminShell() {
  return (
    <AppSurface>
      <div className="p-4 max-w-4xl mx-auto pb-8">
        <div className="mb-6 pt-4">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/80 mt-1">Manage orders and riders</p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Orders
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <AdminDashboardPage />
          </TabsContent>
          <TabsContent value="orders">
            <AdminOrdersPage />
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-white/60 pt-8">
          <p>© 2026. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline">caffeine.ai</a></p>
        </div>
      </div>
    </AppSurface>
  );
}
