import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Package } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus, loginError } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 app-gradient">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/assets/generated/bed-app-icon.dim_512x512.png" 
              alt="Bikaner Express Delivery" 
              className="w-24 h-24 rounded-3xl shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Bikaner Express</h1>
            <p className="text-white/80 text-lg">Fast & Reliable Delivery</p>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your delivery dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full h-12 text-base"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Package className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>

            {loginError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">{loginError.message}</p>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Secure authentication powered by Internet Identity
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
