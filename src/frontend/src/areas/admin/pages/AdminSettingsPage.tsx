import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Building2, Phone, DollarSign, Plus, Edit, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAdminSettings, useAdminRates } from '../../../hooks/useAdminSettings';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { settings, updateSettings, uploadLogo, logoUrl, isLoading } = useAdminSettings();
  const { rates, addRate, updateRate, deleteRate } = useAdminRates();

  const [companyName, setCompanyName] = useState('');
  const [contactNumbers, setContactNumbers] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [showRateDialog, setShowRateDialog] = useState(false);
  const [editingRate, setEditingRate] = useState<any>(null);
  const [rateName, setRateName] = useState('');
  const [rateAmount, setRateAmount] = useState('');

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName);
      setContactNumbers(settings.contactNumbers);
    }
  }, [settings]);

  useEffect(() => {
    if (logoUrl) {
      setLogoPreview(logoUrl);
    }
  }, [logoUrl]);

  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        companyName: companyName.trim(),
        contactNumbers: contactNumbers.trim(),
      });
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) {
      toast.error('Please select a logo file');
      return;
    }

    try {
      await uploadLogo(logoFile);
      toast.success('Logo uploaded successfully!');
      setLogoFile(null);
    } catch (error) {
      toast.error('Failed to upload logo');
    }
  };

  const handleAddRate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rateName.trim() || !rateAmount.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingRate) {
        await updateRate({
          id: editingRate.id,
          name: rateName.trim(),
          amount: parseFloat(rateAmount),
        });
        toast.success('Rate updated successfully!');
      } else {
        await addRate({
          name: rateName.trim(),
          amount: parseFloat(rateAmount),
        });
        toast.success('Rate added successfully!');
      }
      setShowRateDialog(false);
      setEditingRate(null);
      setRateName('');
      setRateAmount('');
    } catch (error) {
      toast.error('Failed to save rate');
    }
  };

  const handleEditRate = (rate: any) => {
    setEditingRate(rate);
    setRateName(rate.name);
    setRateAmount(rate.amount.toString());
    setShowRateDialog(true);
  };

  const handleDeleteRate = async (rateId: string) => {
    if (!confirm('Are you sure you want to delete this rate?')) return;

    try {
      await deleteRate(rateId);
      toast.success('Rate deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete rate');
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactNumbers">Contact Numbers</Label>
            <Textarea
              id="contactNumbers"
              value={contactNumbers}
              onChange={(e) => setContactNumbers(e.target.value)}
              placeholder="Enter contact numbers (comma separated)"
              rows={2}
            />
          </div>
          <Button onClick={handleSaveSettings} className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Company Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {logoPreview && (
            <div className="flex justify-center">
              <img src={logoPreview} alt="Company Logo" className="max-w-xs max-h-48 rounded-lg" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="logo">Upload Logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
          </div>
          <Button onClick={handleUploadLogo} className="w-full" disabled={!logoFile}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Logo'
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Rate List Management
            </CardTitle>
            <Button onClick={() => {
              setEditingRate(null);
              setRateName('');
              setRateAmount('');
              setShowRateDialog(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Rate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rates.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No rates configured yet</p>
          ) : (
            <div className="space-y-2">
              {rates.map((rate) => (
                <div key={rate.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{rate.name}</p>
                    <p className="text-sm text-muted-foreground">₹{rate.amount}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditRate(rate)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteRate(rate.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showRateDialog} onOpenChange={setShowRateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRate ? 'Edit Rate' : 'Add New Rate'}</DialogTitle>
            <DialogDescription>
              {editingRate ? 'Update the rate details' : 'Enter rate details to add to the system'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rateName">Rate Name</Label>
              <Input
                id="rateName"
                value={rateName}
                onChange={(e) => setRateName(e.target.value)}
                placeholder="e.g., Base Delivery Fee"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rateAmount">Amount (₹)</Label>
              <Input
                id="rateAmount"
                type="number"
                step="0.01"
                value={rateAmount}
                onChange={(e) => setRateAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {editingRate ? 'Update Rate' : 'Add Rate'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
