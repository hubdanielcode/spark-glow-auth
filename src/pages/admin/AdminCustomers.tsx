import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, ShoppingBag, Trash2, Loader2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Customer {
  userId: string;
  fullName: string | null;
  phone: string | null;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
}

export default function AdminCustomers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles").select("user_id, full_name, phone, created_at").order("created_at", { ascending: false });
      if (profilesError) throw profilesError;

      const { data: orders, error: ordersError } = await supabase.from("orders").select("user_id, total");
      if (ordersError) throw ordersError;

      const ordersByUser = (orders || []).reduce((acc, order) => {
        if (!acc[order.user_id]) acc[order.user_id] = { count: 0, total: 0 };
        acc[order.user_id].count++;
        acc[order.user_id].total += Number(order.total);
        return acc;
      }, {} as Record<string, { count: number; total: number }>);

      return (profiles || []).map((p): Customer => ({
        userId: p.user_id, fullName: p.full_name, phone: p.phone, createdAt: p.created_at,
        ordersCount: ordersByUser[p.user_id]?.count || 0, totalSpent: ordersByUser[p.user_id]?.total || 0,
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke("delete-user", { body: { user_id: userId } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success("Usuário excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir usuário");
    },
  });

  const filteredCustomers = customers?.filter((c) =>
    (c.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || "").includes(search)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-sm font-serif mb-2">Clientes</h1>
        <p className="text-muted-foreground">Gerencie os clientes da sua loja</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar clientes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" maxLength={100} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber" />
            Todos os Clientes ({filteredCustomers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCustomers && filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b">
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Telefone</th>
                    <th className="pb-3 font-medium">Cadastro</th>
                    <th className="pb-3 font-medium text-center">Pedidos</th>
                    <th className="pb-3 font-medium text-right">Total Gasto</th>
                    <th className="pb-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCustomers.map((customer, i) => (
                    <motion.tr key={customer.userId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="text-sm">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-amber text-xs font-medium">{customer.fullName?.charAt(0)?.toUpperCase() || "?"}</span>
                          </div>
                          <span className="font-medium">{customer.fullName || "Sem nome"}</span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{customer.phone || "—"}</td>
                      <td className="py-3 text-muted-foreground">{new Date(customer.createdAt).toLocaleDateString("pt-BR")}</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
                          <ShoppingBag className="h-3 w-3" />{customer.ordersCount}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium">R$ {customer.totalSpent.toFixed(2).replace(".", ",")}</td>
                      <td className="py-3 text-right">
                        {customer.ordersCount === 0 ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={deleteMutation.isPending}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. O cliente "{customer.fullName || 'Sem nome'}" será removido permanentemente, incluindo perfil e endereços.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMutation.mutate(customer.userId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <span className="text-xs text-muted-foreground" title="Clientes com pedidos não podem ser excluídos">—</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum cliente encontrado</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
