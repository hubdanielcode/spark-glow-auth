import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: {
    id: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async (): Promise<DashboardStats> => {
      // Get orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total, status, created_at')
        .order('created_at', { ascending: false });

      // Get products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get customers count
      const { count: customersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const totalRevenue = (orders || [])
        .filter(o => o.status === 'payment_approved' || o.status === 'delivered')
        .reduce((sum, o) => sum + Number(o.total), 0);

      return {
        totalRevenue,
        totalOrders: orders?.length || 0,
        totalProducts: productsCount || 0,
        totalCustomers: customersCount || 0,
        recentOrders: (orders || []).slice(0, 5).map(o => ({
          id: o.id,
          total: Number(o.total),
          status: o.status,
          createdAt: o.created_at,
        })),
      };
    },
  });

  const statCards = [
    {
      title: 'Receita Total',
      value: `R$ ${(stats?.totalRevenue || 0).toFixed(2).replace('.', ',')}`,
      icon: DollarSign,
      change: '+12%',
      positive: true,
    },
    {
      title: 'Pedidos',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      change: '+8%',
      positive: true,
    },
    {
      title: 'Produtos',
      value: stats?.totalProducts || 0,
      icon: Package,
      change: '+2',
      positive: true,
    },
    {
      title: 'Clientes',
      value: stats?.totalCustomers || 0,
      icon: Users,
      change: '+5%',
      positive: true,
    },
  ];

  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    payment_approved: 'Pago',
    preparing: 'Preparando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-sm font-serif mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu e-commerce
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs mt-1">
                  {stat.positive ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={stat.positive ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-1">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber" />
            Pedidos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between animate-pulse">
                  <div className="h-5 bg-muted rounded w-24" />
                  <div className="h-5 bg-muted rounded w-20" />
                  <div className="h-5 bg-muted rounded w-16" />
                </div>
              ))}
            </div>
          ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b">
                    <th className="pb-3 font-medium">Pedido</th>
                    <th className="pb-3 font-medium">Data</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-3 font-mono">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium">
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhum pedido ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
