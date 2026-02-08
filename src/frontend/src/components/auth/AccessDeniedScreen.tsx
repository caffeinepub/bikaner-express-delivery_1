import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useClearUserData } from '../../hooks/useCurrentUser';

export default function AccessDeniedScreen() {
  const { clear } = useInternetIdentity();
  const clearUserData = useClearUserData();

  const handleLogout = async () => {
    clearUserData();
    await clear();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 app-gradient">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this area
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={() => window.history.back()} variant="outline" className="w-full">
            Go Back
          </Button>
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
