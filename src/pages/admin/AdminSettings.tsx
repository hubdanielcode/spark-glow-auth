import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, Truck, Bell, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StoreInfo {
  name: string;
  description: string;
  email: string;
  phone: string;
  instagram: string;
}

interface ShippingSettings {
  free_shipping_threshold: number;
  default_shipping_cost: number;
  estimated_days_min: number;
  estimated_days_max: number;
}

interface NotificationSettings {
  email_new_order: boolean;
  email_low_stock: boolean;
  low_stock_threshold: number;
}

function useSettings<T>(key: string) {
  return useQuery({
    queryKey: ['store-settings', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings' as any)
        .select('value')
        .eq('key', key)
        .single();
      if (error) throw error;
      return (data as any).value as T;
    },
  });
}

function useSaveSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('store_settings' as any)
        .update({ value, updated_at: new Date().toISOString() } as any)
        .eq('key', key);
      if (error) throw error;
    },
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ['store-settings', key] });
      toast.success('Configurações salvas!');
    },
    onError: () => toast.error('Erro ao salvar configurações'),
  });
}

function StoreInfoTab() {
  const { data, isLoading } = useSettings<StoreInfo>('store_info');
  const save = useSaveSettings();
  const [form, setForm] = useState<StoreInfo>({ name: '', description: '', email: '', phone: '', instagram: '' });

  useEffect(() => { if (data) setForm(data); }, [data]);

  if (isLoading) return <LoadingState />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5 text-amber" /> Informações da Loja</CardTitle>
        <CardDescription>Dados básicos exibidos no site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="store-name">Nome da Loja</Label>
            <Input id="store-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-email">E-mail de Contato</Label>
            <Input id="store-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-phone">Telefone</Label>
            <Input id="store-phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-instagram">Instagram</Label>
            <Input id="store-instagram" value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="store-desc">Descrição</Label>
          <Input id="store-desc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <Button onClick={() => save.mutate({ key: 'store_info', value: form })} disabled={save.isPending}>
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

function ShippingTab() {
  const { data, isLoading } = useSettings<ShippingSettings>('shipping');
  const save = useSaveSettings();
  const [form, setForm] = useState<ShippingSettings>({ free_shipping_threshold: 199, default_shipping_cost: 15, estimated_days_min: 3, estimated_days_max: 7 });

  useEffect(() => { if (data) setForm(data); }, [data]);

  if (isLoading) return <LoadingState />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-amber" /> Frete</CardTitle>
        <CardDescription>Configurações de entrega e frete grátis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="free-threshold">Frete grátis acima de (R$)</Label>
            <Input id="free-threshold" type="number" value={form.free_shipping_threshold} onChange={e => setForm(f => ({ ...f, free_shipping_threshold: Number(e.target.value) }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-cost">Custo padrão de frete (R$)</Label>
            <Input id="default-cost" type="number" value={form.default_shipping_cost} onChange={e => setForm(f => ({ ...f, default_shipping_cost: Number(e.target.value) }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="days-min">Prazo mínimo (dias)</Label>
            <Input id="days-min" type="number" value={form.estimated_days_min} onChange={e => setForm(f => ({ ...f, estimated_days_min: Number(e.target.value) }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="days-max">Prazo máximo (dias)</Label>
            <Input id="days-max" type="number" value={form.estimated_days_max} onChange={e => setForm(f => ({ ...f, estimated_days_max: Number(e.target.value) }))} />
          </div>
        </div>
        <Button onClick={() => save.mutate({ key: 'shipping', value: form })} disabled={save.isPending}>
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

function NotificationsTab() {
  const { data, isLoading } = useSettings<NotificationSettings>('notifications');
  const save = useSaveSettings();
  const [form, setForm] = useState<NotificationSettings>({ email_new_order: true, email_low_stock: true, low_stock_threshold: 5 });

  useEffect(() => { if (data) setForm(data); }, [data]);

  if (isLoading) return <LoadingState />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-amber" /> Notificações</CardTitle>
        <CardDescription>Controle os alertas que você recebe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Novo pedido</p>
            <p className="text-xs text-muted-foreground">Receber e-mail quando um novo pedido for realizado</p>
          </div>
          <Switch checked={form.email_new_order} onCheckedChange={v => setForm(f => ({ ...f, email_new_order: v }))} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Estoque baixo</p>
            <p className="text-xs text-muted-foreground">Alerta quando um produto atingir o limite mínimo</p>
          </div>
          <Switch checked={form.email_low_stock} onCheckedChange={v => setForm(f => ({ ...f, email_low_stock: v }))} />
        </div>
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="stock-threshold">Limite de estoque baixo</Label>
          <Input id="stock-threshold" type="number" value={form.low_stock_threshold} onChange={e => setForm(f => ({ ...f, low_stock_threshold: Number(e.target.value) }))} />
        </div>
        <Button onClick={() => save.mutate({ key: 'notifications', value: form })} disabled={save.isPending}>
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-sm font-serif mb-2">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da loja</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Tabs defaultValue="store" className="space-y-4">
          <TabsList>
            <TabsTrigger value="store" className="cursor-pointer"><Store className="h-4 w-4 mr-2" /> Loja</TabsTrigger>
            <TabsTrigger value="shipping" className="cursor-pointer"><Truck className="h-4 w-4 mr-2" /> Frete</TabsTrigger>
            <TabsTrigger value="notifications" className="cursor-pointer"><Bell className="h-4 w-4 mr-2" /> Notificações</TabsTrigger>
          </TabsList>
          <TabsContent value="store"><StoreInfoTab /></TabsContent>
          <TabsContent value="shipping"><ShippingTab /></TabsContent>
          <TabsContent value="notifications"><NotificationsTab /></TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
