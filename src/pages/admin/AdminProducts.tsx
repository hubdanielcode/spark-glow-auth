import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/useProducts';
import { ImageUpload } from '@/components/admin/ImageUpload';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const productSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(150, 'Nome deve ter no máximo 150 caracteres'),
  description: z.string().max(2000, 'Descrição deve ter no máximo 2000 caracteres').optional().default(''),
  price: z.string().min(1, 'Preço é obrigatório').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Preço deve ser maior que zero'),
  originalPrice: z.string().optional().default('').refine(v => !v || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0), 'Preço original inválido'),
  stock: z.string().min(1, 'Estoque é obrigatório').refine(v => !isNaN(parseInt(v)) && parseInt(v) >= 0, 'Estoque deve ser zero ou mais'),
  categoryId: z.string().optional().default(''),
  weight: z.string().max(50, 'Máximo 50 caracteres').optional().default(''),
  burnTime: z.string().max(50, 'Máximo 50 caracteres').optional().default(''),
  imageUrl: z.string().max(500).optional().default(''),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string | null;
  slug: string;
  imageUrl?: string;
  weight?: string | null;
  burnTime?: string | null;
  category?: { name: string };
}

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: categories } = useCategories();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '', description: '', price: '', originalPrice: '', stock: '',
      categoryId: '', weight: '', burnTime: '', imageUrl: '', isActive: true, isFeatured: false,
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = form;

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`id, name, description, price, original_price, stock, is_active, is_featured, category_id, slug, image_url, weight, burn_time, categories (name)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((p): Product => ({
        id: p.id, name: p.name, description: p.description, price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : null,
        stock: p.stock, isActive: p.is_active, isFeatured: p.is_featured,
        categoryId: p.category_id, slug: p.slug, imageUrl: p.image_url || undefined,
        weight: p.weight, burnTime: p.burn_time,
        category: p.categories ? { name: (p.categories as any).name } : undefined,
      }));
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const slug = data.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const { error } = await supabase.from('products').insert({
        name: data.name.trim(), description: data.description?.trim() || null,
        price: parseFloat(data.price), original_price: data.originalPrice ? parseFloat(data.originalPrice) : null,
        stock: parseInt(data.stock), category_id: data.categoryId || null,
        weight: data.weight || null, burn_time: data.burnTime || null,
        image_url: data.imageUrl || null, is_active: data.isActive, is_featured: data.isFeatured, slug,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produto criado com sucesso!');
      resetForm();
    },
    onError: () => toast.error('Erro ao criar produto'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      const { error } = await supabase.from('products').update({
        name: data.name.trim(), description: data.description?.trim() || null,
        price: parseFloat(data.price), original_price: data.originalPrice ? parseFloat(data.originalPrice) : null,
        stock: parseInt(data.stock), category_id: data.categoryId || null,
        weight: data.weight || null, burn_time: data.burnTime || null,
        image_url: data.imageUrl || null, is_active: data.isActive, is_featured: data.isFeatured,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produto atualizado!');
      resetForm();
    },
    onError: () => toast.error('Erro ao atualizar produto'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produto excluído!');
    },
    onError: () => toast.error('Erro ao excluir produto'),
  });

  const resetForm = () => {
    reset({ name: '', description: '', price: '', originalPrice: '', stock: '', categoryId: '', weight: '', burnTime: '', imageUrl: '', isActive: true, isFeatured: false });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name, description: product.description || '',
      price: product.price.toString(), originalPrice: product.originalPrice?.toString() || '',
      stock: product.stock.toString(), categoryId: product.categoryId || '',
      weight: product.weight || '', burnTime: product.burnTime || '',
      imageUrl: product.imageUrl || '', isActive: product.isActive, isFeatured: product.isFeatured,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-serif mb-2">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de produtos</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Novo Produto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" maxLength={150} placeholder="Nome do produto" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" maxLength={2000} placeholder="Descrição do produto" {...register('description')} className={errors.description ? 'border-destructive' : ''} />
                <p className="text-xs text-muted-foreground">{(watch('description') || '').length}/2000</p>
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço * (R$)</Label>
                  <Input id="price" type="number" step="0.01" min="0.01" max="99999" placeholder="99.90" {...register('price')} className={errors.price ? 'border-destructive' : ''} />
                  {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Preço Original</Label>
                  <Input id="originalPrice" type="number" step="0.01" min="0" max="99999" placeholder="129.90" {...register('originalPrice')} className={errors.originalPrice ? 'border-destructive' : ''} />
                  {errors.originalPrice && <p className="text-sm text-destructive">{errors.originalPrice.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque *</Label>
                  <Input id="stock" type="number" min="0" max="99999" placeholder="50" {...register('stock')} className={errors.stock ? 'border-destructive' : ''} />
                  {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={watch('categoryId')} onValueChange={(value) => setValue('categoryId', value)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso</Label>
                  <Input id="weight" maxLength={50} placeholder="200g" {...register('weight')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="burnTime">Tempo de Queima</Label>
                  <Input id="burnTime" maxLength={50} placeholder="45 horas" {...register('burnTime')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagem do Produto</Label>
                <ImageUpload value={watch('imageUrl') || undefined} onChange={(url) => setValue('imageUrl', url || '')} />
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="isActive">Produto ativo</Label>
                <Switch id="isActive" checked={watch('isActive')} onCheckedChange={(checked) => setValue('isActive', checked)} />
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="isFeatured">Destaque</Label>
                <Switch id="isFeatured" checked={watch('isFeatured')} onCheckedChange={(checked) => setValue('isFeatured', checked)} />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</>) : editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar produtos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" maxLength={100} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-lg shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                            <div className="w-4 h-6 bg-gradient-to-b from-primary/30 to-primary/50 rounded" />
                          </div>
                        )}
                        <div>
                          <p>{product.name}</p>
                          {product.isFeatured && <Badge variant="secondary" className="text-xs mt-1">Destaque</Badge>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.category?.name || '-'}</TableCell>
                    <TableCell>R$ {product.price.toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell>
                      <span className={product.stock < 10 ? 'text-destructive' : ''}>{product.stock}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>{product.isActive ? 'Ativo' : 'Inativo'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
                              <AlertDialogDescription>Esta ação não pode ser desfeita. O produto será removido permanentemente.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteMutation.mutate(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum produto encontrado</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </div>
  );
}
