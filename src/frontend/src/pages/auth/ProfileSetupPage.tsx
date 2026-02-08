import { useState } from 'react';
import { useActor } from '../../hooks/useActor';
import { useIsCallerAdmin } from '../../hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, User, Bike, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Role } from '../../backend';

export default function ProfileSetupPage() {
  const { actor } = useActor();
  const { data: isAdmin } = useIsCallerAdmin();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(Role.customer);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !name.trim()) return;

    setIsSaving(true);
    try {
      await actor.saveCallerUserProfile({ name: name.trim(), role });
      toast.success('Profile created successfully!');
      // Navigation will be handled by App.tsx
    } catch (error) {
      console.error('Profile setup error:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 app-gradient">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>Tell us a bit about yourself to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-3">
              <Label>I am a</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as Role)} disabled={isSaving}>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value={Role.customer} id="customer" />
                  <Label htmlFor="customer" className="flex items-center gap-2 cursor-pointer flex-1">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Customer</div>
                      <div className="text-xs text-muted-foreground">Book and track deliveries</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value={Role.rider} id="rider" />
                  <Label htmlFor="rider" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Bike className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Rider</div>
                      <div className="text-xs text-muted-foreground">Deliver parcels to customers</div>
                    </div>
                  </Label>
                </div>

                {isAdmin && (
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                    <RadioGroupItem value={Role.admin} id="admin" />
                    <Label htmlFor="admin" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Admin</div>
                        <div className="text-xs text-muted-foreground">Manage orders and riders</div>
                      </div>
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isSaving || !name.trim()}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
