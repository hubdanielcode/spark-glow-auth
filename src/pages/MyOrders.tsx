import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, Clock, CheckCircle2, Truck, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    product: {
      name: string;
      imageUrl: string | null;
      slug: string;
    };
  }[];
}

const statusConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
  pending: { label: 'Pendente', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmado', icon: CheckCircle2, color: 'bg-blue-100 text-blue-800' },
  payment_approved: { label: 'Pago', icon: CheckCircle2, color: 'bg-green-100 text-green-800' },
  preparing: { label: 'Preparando', icon: Package, color: 'bg-orange-100 text-orange-800' },
  shipped: { label: 'Enviado', icon: Truck, color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Entregue', icon: CheckCircle2, color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'bg-red-100 text-red-800' },
};

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          total,
          created_at,
          order_items (
            id,
            quantity,
            unit_price,
            products (
              name,
              image_url,
              slug
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((order): Order => ({
        id: order.id,
        status: order.status,
        total: Number(order.total),
        createdAt: order.created_at,
        items: (order.order_items || []).map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          unitPrice: Number(item.unit_price),
          product: {
            name: item.products?.name || 'Produto',
            imageUrl: item.products?.image_url,
            slug: item.products?.slug || '',
          },
        })),
      }));
    },
    enabled: !!user,
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <h1 className="text-display-sm font-serif mb-8">Meus Pedidos</h1>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-muted rounded w-32" />
                    <div className="h-6 bg-muted rounded w-20" />
                  </div>
                  <div className="h-20 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-lg shadow-card overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-4 md:p-6 border-b border-border">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Pedido #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-4 md:p-6">
                      <div className="space-y-3">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded bg-cream flex-shrink-0 overflow-hidden">
                              {item.product.imageUrl ? (
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-8 h-10 bg-gradient-to-b from-amber/30 to-amber/50 rounded" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/produto/${item.product.slug}`}
                                className="font-medium hover:text-amber transition-colors line-clamp-1"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity}x R$ {item.unitPrice.toFixed(2).replace('.', ',')}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-muted-foreground">
                            + {order.items.length - 2} item(s)
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                        <span className="font-medium">Total</span>
                        <span className="text-lg font-medium text-amber">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl mb-2">Nenhum pedido ainda</h3>
              <p className="text-muted-foreground mb-6">
                Você ainda não fez nenhum pedido.
              </p>
              <Button asChild>
                <Link to="/produtos">Explorar Produtos</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
