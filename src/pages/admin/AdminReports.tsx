import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function AdminReports() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-reports-stats"],
    queryFn: async () => {
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from("orders").select("id, total, status, created_at"),
        supabase.from("products").select("id, stock, price, is_active"),
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];

      const totalRevenue = orders
        .filter((o) => !["cancelled", "pending"].includes(o.status))
        .reduce((sum, o) => sum + Number(o.total), 0);

      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const monthlyOrders = orders.filter(
        (o) => new Date(o.created_at) >= thisMonth,
      );
      const monthlyRevenue = monthlyOrders
        .filter((o) => !["cancelled", "pending"].includes(o.status))
        .reduce((sum, o) => sum + Number(o.total), 0);

      const activeProducts = products.filter((p) => p.is_active).length;
      const lowStock = products.filter(
        (p) => p.stock <= 5 && p.is_active,
      ).length;

      return {
        totalOrders: orders.length,
        totalRevenue,
        monthlyOrders: monthlyOrders.length,
        monthlyRevenue,
        activeProducts,
        lowStock,
        cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
        deliveredOrders: orders.filter((o) => o.status === "delivered").length,
      };
    },
  });

  const cards = [
    {
      title: "Receita Total",
      value: stats
        ? `R$ ${stats.totalRevenue.toFixed(2).replace(".", ",")}`
        : "—",
      icon: DollarSign,
      description: "Todos os pedidos pagos",
    },
    {
      title: "Receita do Mês",
      value: stats
        ? `R$ ${stats.monthlyRevenue.toFixed(2).replace(".", ",")}`
        : "—",
      icon: TrendingUp,
      description: `${stats?.monthlyOrders || 0} pedidos este mês`,
    },
    {
      title: "Total de Pedidos",
      value: stats?.totalOrders ?? "—",
      icon: ShoppingCart,
      description: `${stats?.deliveredOrders || 0} entregues, ${stats?.cancelledOrders || 0} cancelados`,
    },
    {
      title: "Produtos Ativos",
      value: stats?.activeProducts ?? "—",
      icon: Package,
      description: stats?.lowStock
        ? `${stats.lowStock} com estoque baixo`
        : "Estoque ok",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-sm font-serif mb-2">Relatórios</h1>
        <p className="text-muted-foreground">
          Visão geral do desempenho da loja
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
