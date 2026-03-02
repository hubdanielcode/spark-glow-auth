import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Users, Mail, Calendar, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Customer {
  userId: string;
  fullName: string | null;
  phone: string | null;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
}

export default function AdminCustomers() {
  const { data: customers, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get orders grouped by user
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("user_id, total");

      if (ordersError) throw ordersError;

      // Map orders to users
      const ordersByUser = (orders || []).reduce(
        (acc, order) => {
          if (!acc[order.user_id]) {
            acc[order.user_id] = { count: 0, total: 0 };
          }
          acc[order.user_id].count++;
          acc[order.user_id].total += Number(order.total);
          return acc;
        },
        {} as Record<string, { count: number; total: number }>
      );

      return (profiles || []).map(
        (p): Customer => ({
          userId: p.user_id,
          fullName: p.full_name,
          phone: p.phone,
          createdAt: p.created_at,
          ordersCount: ordersByUser[p.user_id]?.count || 0,
          totalSpent: ordersByUser[p.user_id]?.total || 0,
        })
      );
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-sm font-serif mb-2">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie os clientes da sua loja
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber" />
            Todos os Clientes ({customers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between animate-pulse">
                  <div className="h-5 bg-muted rounded w-32" />
                  <div className="h-5 bg-muted rounded w-24" />
                  <div className="h-5 bg-muted rounded w-16" />
                </div>
              ))}
            </div>
          ) : customers && customers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b">
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Telefone</th>
                    <th className="pb-3 font-medium">Cadastro</th>
                    <th className="pb-3 font-medium text-center">Pedidos</th>
                    <th className="pb-3 font-medium text-right">Total Gasto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customers.map((customer, i) => (
                    <motion.tr
                      key={customer.userId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="text-sm"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-amber text-xs font-medium">
                              {customer.fullName?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <span className="font-medium">
                            {customer.fullName || "Sem nome"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {customer.phone || "—"}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
                          <ShoppingBag className="h-3 w-3" />
                          {customer.ordersCount}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium">
                        R${" "}
                        {customer.totalSpent.toFixed(2).replace(".", ",")}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhum cliente cadastrado ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
