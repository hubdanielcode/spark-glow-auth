import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, Truck, Bell, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

function useSettings<T>(key: string) {
  return useQuery({
    queryKey: ['store-settings', key],
    queryFn: async () => {
      const { data, error } = await supabase.from('store_settings' as any).select('value').eq('key', key).single();
      if (error) throw error;
      return (data as any).value as T;
    },
  });
}

function useSaveSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase.from('store_settings' as any).update({ value, updated_at: new Date().toISOString() } as any).eq('key', key);
      if (error) throw error;
    },
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ['store-settings', key] });
      toast.success('Configurações salvas!');
    },
    onError: () => toast.error('Erro ao salvar configurações'),
  });
}

const storeInfoSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional().default(''),
  email: z.string().email('E-mail inválido').max(255).or(z.literal('')),
  phone: z.string().max(20, 'Máximo 20 caracteres').optional().default(''),
  instagram: z.string().max(100, 'Máximo 100 caracteres').optional().default(''),
});

type StoreInfoForm = z.infer<typeof storeInfoSchema>;

function StoreInfoTab() {
  const { data, isLoading } = useSettings<StoreInfoForm>('store_info');
  const save = useSaveSettings();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<StoreInfoForm>({
    resolver: zodResolver(storeInfoSchema),
    defaultValues: { name: '', description: '', email: '', phone: '', instagram: '' },
  });

  useEffect(() => { if (data) reset(data); }, [data, reset]);

  if (isLoading) return <LoadingState />;

  const onSubmit = (form: StoreInfoForm) => save.mutate({ key: 'store_info', value: form });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5 text-amber" /> Informações da Loja</CardTitle>
        <CardDescription>Dados básicos exibidos no site</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Nome da Loja *</Label>
              <Input id="store-name" maxLength={100} {...register('name')} className={errors.name ? 'border-destructive' : ''} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-email">E-mail de Contato</Label>
              <Input id="store-email" type="email" maxLength={255} {...register('email')} className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-phone">Telefone</Label>
              <Input id="store-phone" maxLength={20} {...register('phone')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-instagram">Instagram</Label>
              <Input id="store-instagram" maxLength={100} {...register('instagram')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-desc">Descrição</Label>
            <Input id="store-desc" maxLength={500} {...register('description')} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Salvar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const shippingSchema = z.object({
  free_shipping_threshold: z.number().min(0, 'Deve ser zero ou mais').max(99999),
  default_shipping_cost: z.number().min(0, 'Deve ser zero ou mais').max(9999),
  estimated_days_min: z.number().int().min(1, 'Mínimo 1 dia').max(90),
  estimated_days_max: z.number().int().min(1, 'Mínimo 1 dia').max(90),
}).refine(d => d.estimated_days_max >= d.estimated_days_min, { message: 'Prazo máximo deve ser >= mínimo', path: ['estimated_days_max'] });

type ShippingForm = z.infer<typeof shippingSchema>;

function ShippingTab() {
  const { data, isLoading } = useSettings<ShippingForm>('shipping');
  const save = useSaveSettings();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { free_shipping_threshold: 199, default_shipping_cost: 15, estimated_days_min: 3, estimated_days_max: 7 },
  });

  useEffect(() => { if (data) reset(data); }, [data, reset]);

  if (isLoading) return <LoadingState />;

  const onSubmit = (form: ShippingForm) => save.mutate({ key: 'shipping', value: form });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-amber" /> Frete</CardTitle>
        <CardDescription>Configurações de entrega e frete grátis</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="free-threshold">Frete grátis acima de (R$)</Label>
              <Input id="free-threshold" type="number" step="0.01" min="0" max="99999" {...register('free_shipping_threshold', { valueAsNumber: true })} className={errors.free_shipping_threshold ? 'border-destructive' : ''} />
              {errors.free_shipping_threshold && <p className="text-sm text-destructive">{errors.free_shipping_threshold.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-cost">Custo padrão de frete (R$)</Label>
              <Input id="default-cost" type="number" step="0.01" min="0" max="9999" {...register('default_shipping_cost', { valueAsNumber: true })} className={errors.default_shipping_cost ? 'border-destructive' : ''} />
              {errors.default_shipping_cost && <p className="text-sm text-destructive">{errors.default_shipping_cost.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="days-min">Prazo mínimo (dias)</Label>
              <Input id="days-min" type="number" min="1" max="90" {...register('estimated_days_min', { valueAsNumber: true })} className={errors.estimated_days_min ? 'border-destructive' : ''} />
              {errors.estimated_days_min && <p className="text-sm text-destructive">{errors.estimated_days_min.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="days-max">Prazo máximo (dias)</Label>
              <Input id="days-max" type="number" min="1" max="90" {...register('estimated_days_max', { valueAsNumber: true })} className={errors.estimated_days_max ? 'border-destructive' : ''} />
              {errors.estimated_days_max && <p className="text-sm text-destructive">{errors.estimated_days_max.message}</p>}
            </div>
          </div>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Salvar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface NotificationSettings {
  email_new_order: boolean;
  email_low_stock: boolean;
  low_stock_threshold: number;
}

function NotificationsTab() {
  const { data, isLoading } = useSettings<NotificationSettings>('notifications');
  const save = useSaveSettings();
  const [form, setForm] = useState<NotificationSettings>({ email_new_order: true, email_low_stock: true, low_stock_threshold: 5 });

  useEffect(() => { if (data) setForm(data); }, [data]);

  if (isLoading) return <LoadingState />;

  const handleSave = () => {
    if (form.low_stock_threshold < 0 || form.low_stock_threshold > 9999) {
      toast.error('Limite de estoque deve ser entre 0 e 9999');
      return;
    }
    save.mutate({ key: 'notifications', value: form });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-amber" /> Notificações</CardTitle>
        <CardDescription>Controle os alertas que você recebe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div><p className="font-medium text-sm">Novo pedido</p><p className="text-xs text-muted-foreground">Receber e-mail quando um novo pedido for realizado</p></div>
          <Switch checked={form.email_new_order} onCheckedChange={v => setForm(f => ({ ...f, email_new_order: v }))} />
        </div>
        <div className="flex items-center justify-between">
          <div><p className="font-medium text-sm">Estoque baixo</p><p className="text-xs text-muted-foreground">Alerta quando um produto atingir o limite mínimo</p></div>
          <Switch checked={form.email_low_stock} onCheckedChange={v => setForm(f => ({ ...f, email_low_stock: v }))} />
        </div>
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="stock-threshold">Limite de estoque baixo</Label>
          <Input id="stock-threshold" type="number" min="0" max="9999" value={form.low_stock_threshold} onChange={e => setForm(f => ({ ...f, low_stock_threshold: Number(e.target.value) }))} />
        </div>
        <Button onClick={handleSave} disabled={save.isPending}>
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
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
