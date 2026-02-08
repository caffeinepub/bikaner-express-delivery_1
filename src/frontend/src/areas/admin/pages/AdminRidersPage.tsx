import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Bike, Plus, Edit, Trash2, Phone, ExternalLink, Loader2 } from 'lucide-react';
import { useGetAllRiders, useAddRider, useUpdateRiderLocation, useDeleteRider } from '../../../hooks/useAdminRiders';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function AdminRidersPage() {
  const { data: riders, isLoading } = useGetAllRiders();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingRider, setEditingRider] = useState<any>(null);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Bike');
  const [locationUrl, setLocationUrl] = useState('');
  const [riderId, setRiderId] = useState('');

  const addRider = useAddRider();
  const updateLocation = useUpdateRiderLocation();
  const deleteRider = useDeleteRider();

  const handleAddRider = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phoneNumber.trim() || !riderId.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const principal = Principal.fromText(riderId.trim());
      await addRider.mutateAsync({
        riderId: principal,
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        vehicleType: vehicleType.trim() || 'Bike',
      });
      toast.success('Rider added successfully!');
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Add rider error:', error);
      toast.error('Failed to add rider. Please check the Principal ID.');
    }
  };

  const handleEditRider = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingRider) return;

    try {
      await updateLocation.mutateAsync({
        riderId: editingRider.id,
        locationUrl: locationUrl.trim(),
      });
      toast.success('Rider location updated successfully!');
      setShowEditDialog(false);
      setEditingRider(null);
      resetForm();
    } catch (error) {
      console.error('Update rider error:', error);
      toast.error('Failed to update rider');
    }
  };

  const handleDeleteRider = async (riderId: Principal) => {
    if (!confirm('Are you sure you want to delete this rider?')) return;

    try {
      await deleteRider.mutateAsync(riderId);
      toast.success('Rider deleted successfully!');
    } catch (error) {
      console.error('Delete rider error:', error);
      toast.error('Failed to delete rider');
    }
  };

  const openEditDialog = (rider: any) => {
    setEditingRider(rider);
    setLocationUrl(rider.locationUrl || '');
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setName('');
    setPhoneNumber('');
    setVehicleType('Bike');
    setLocationUrl('');
    setRiderId('');
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Riders Management</CardTitle>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Rider
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Loading riders...</p>
            </div>
          </CardContent>
        </Card>
      ) : !riders || riders.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Bike className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No riders found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {riders.map((rider) => (
            <Card key={rider.id.toString()} className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bike className="h-5 w-5" />
                      {rider.name}
                    </CardTitle>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {rider.phoneNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vehicle: {rider.vehicleType}
                      </p>
                      {rider.locationUrl ? (
                        <a
                          href={rider.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Location
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">No location link</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(rider)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteRider(rider.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Rider</DialogTitle>
            <DialogDescription>Enter rider details to add them to the system</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRider} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="riderId">Rider Principal ID *</Label>
              <Input
                id="riderId"
                value={riderId}
                onChange={(e) => setRiderId(e.target.value)}
                placeholder="Enter rider's Principal ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter rider name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Input
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                placeholder="e.g., Bike, Scooter"
              />
            </div>
            <Button type="submit" className="w-full" disabled={addRider.isPending}>
              {addRider.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Rider'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Rider Location</DialogTitle>
            <DialogDescription>Update the Google Maps location link for this rider</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRider} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="locationUrl">Google Maps Link</Label>
              <Input
                id="locationUrl"
                value={locationUrl}
                onChange={(e) => setLocationUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
            <Button type="submit" className="w-full" disabled={updateLocation.isPending}>
              {updateLocation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Location'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
