import { useState, useEffect } from 'react';
import { fileToBytes } from '../utils/fileToBytes';

interface CompanySettings {
  companyName: string;
  contactNumbers: string;
}

interface Rate {
  id: string;
  name: string;
  amount: number;
}

const SETTINGS_KEY = 'bed_admin_settings';
const RATES_KEY = 'bed_admin_rates';
const LOGO_KEY = 'bed_admin_logo';

export function useAdminSettings() {
  const [settings, setSettings] = useState<CompanySettings>({
    companyName: 'Bikaner Express Delivery',
    contactNumbers: '',
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
    loadLogo();
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadLogo = () => {
    try {
      const saved = localStorage.getItem(LOGO_KEY);
      if (saved) {
        setLogoUrl(saved);
      }
    } catch (error) {
      console.error('Failed to load logo:', error);
    }
  };

  const updateSettings = async (newSettings: CompanySettings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      throw new Error('Failed to save settings');
    }
  };

  const uploadLogo = async (file: File) => {
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        localStorage.setItem(LOGO_KEY, dataUrl);
        setLogoUrl(dataUrl);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsLoading(false);
      throw new Error('Failed to upload logo');
    }
  };

  return {
    settings,
    updateSettings,
    uploadLogo,
    logoUrl,
    isLoading,
  };
}

export function useAdminRates() {
  const [rates, setRates] = useState<Rate[]>([]);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = () => {
    try {
      const saved = localStorage.getItem(RATES_KEY);
      if (saved) {
        setRates(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load rates:', error);
    }
  };

  const saveRates = (newRates: Rate[]) => {
    try {
      localStorage.setItem(RATES_KEY, JSON.stringify(newRates));
      setRates(newRates);
    } catch (error) {
      throw new Error('Failed to save rates');
    }
  };

  const addRate = async (rate: Omit<Rate, 'id'>) => {
    const newRate: Rate = {
      ...rate,
      id: Date.now().toString(),
    };
    saveRates([...rates, newRate]);
  };

  const updateRate = async (updatedRate: Rate) => {
    const newRates = rates.map((r) => (r.id === updatedRate.id ? updatedRate : r));
    saveRates(newRates);
  };

  const deleteRate = async (rateId: string) => {
    const newRates = rates.filter((r) => r.id !== rateId);
    saveRates(newRates);
  };

  return {
    rates,
    addRate,
    updateRate,
    deleteRate,
  };
}
