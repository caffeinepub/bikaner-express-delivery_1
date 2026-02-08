import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useClearUserData } from '../../../hooks/useCurrentUser';
import InstallAppButton from '../../../components/pwa/InstallAppButton';

export default function RiderProfilePage() {
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const clearUserData = useClearUserData();

  const handleLogout = async () => {
    clearUserData();
    await clear();
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="mb-6 pt-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <User className="h-8 w-8" />
          Profile
        </h1>
        <p className="text-white/80 mt-1">Manage your account</p>
      </div>

      <div className="space-y-4">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{userProfile?.name || 'Loading...'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{userProfile?.role || 'Loading...'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>App</CardTitle>
            <CardDescription>Install for quick access</CardDescription>
          </CardHeader>
          <CardContent>
            <InstallAppButton />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-white/60 pt-4">
          <p>© 2026. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline">caffeine.ai</a></p>
        </div>
      </div>
    </div>
  );
}
