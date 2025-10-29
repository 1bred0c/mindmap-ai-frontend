'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CreditCard, Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const plans = [
  { name: 'Free', currency: 'VND 0', description: 'Perfect for getting started' },
  { name: 'Premium', price: '59.000', currency: 'VND ', period: '/month', description: 'Everything you need for professional work', popular: true },
];

type PaymentState = 'idle' | 'processing' | 'success' | 'failed';

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState('Free');
  const [paymentState, setPaymentState] = useState('idle');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [orderCode, setOrderCode] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(0);
  const { toast } = useToast();

  const checkSubscription = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user?.userId;
      if (!userId) return;
      setCurrentUserId(userId);
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase.from('subscriptions').select('*').eq('userid', userId).gte('enddate', today).maybeSingle();
      if (error) throw error;
      if (data) setCurrentPlan('Premium'); else setCurrentPlan('Free');
    } catch (err) { console.error('Error checking subscription:', err); }
  };

  useEffect(() => { checkSubscription(); }, []);

  return <DashboardLayout><div className="p-6">Loading...</div></DashboardLayout>;
}
