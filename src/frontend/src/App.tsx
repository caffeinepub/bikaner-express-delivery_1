import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUser';
import LoginPage from './pages/auth/LoginPage';
import ProfileSetupPage from './pages/auth/ProfileSetupPage';
import CustomerShell from './areas/customer/CustomerShell';
import RiderShell from './areas/rider/RiderShell';
import AdminShell from './areas/admin/AdminShell';
import AccessDeniedScreen from './components/auth/AccessDeniedScreen';
import FloatingInstallFab from './components/pwa/FloatingInstallFab';
import { useEffect } from 'react';
import { registerServiceWorker } from './pwa/registerServiceWorker';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <FloatingInstallFab />
      <Toaster />
    </>
  ),
});

// Public routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

const profileSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/setup',
  component: ProfileSetupPage,
});

// Customer routes
const customerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer',
  component: CustomerShell,
});

// Rider routes
const riderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rider',
  component: RiderShell,
});

// Admin routes - now handles its own auth
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminShell,
});

// Access denied route
const accessDeniedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access-denied',
  component: AccessDeniedScreen,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  profileSetupRoute,
  customerRoute,
  riderRoute,
  adminRoute,
  accessDeniedRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Redirect logic based on auth state
  useEffect(() => {
    if (loginStatus === 'initializing' || profileLoading) return;

    const currentPath = window.location.hash.replace('#', '') || '/';

    // Admin route handles its own authentication
    if (currentPath.startsWith('/admin')) {
      return;
    }

    if (!isAuthenticated) {
      if (currentPath !== '/' && currentPath !== '') {
        router.navigate({ to: '/' });
      }
      return;
    }

    // User is authenticated
    if (!isFetched) return;

    if (userProfile === null) {
      // Need to setup profile
      if (currentPath !== '/setup') {
        router.navigate({ to: '/setup' });
      }
      return;
    }

    // User has profile, redirect to their area
    if (userProfile && (currentPath === '/' || currentPath === '/setup')) {
      switch (userProfile.role) {
        case 'customer':
          router.navigate({ to: '/customer' });
          break;
        case 'rider':
          router.navigate({ to: '/rider' });
          break;
        case 'admin':
          router.navigate({ to: '/admin' });
          break;
      }
    }
  }, [isAuthenticated, userProfile, profileLoading, isFetched, loginStatus]);

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AppContent />
    </ThemeProvider>
  );
}
