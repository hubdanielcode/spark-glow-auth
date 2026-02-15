import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Truck, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logError } from '@/lib/logger';

const checkoutSchema = z.object({
  street: z.string().min(3, 'Rua é obrigatória').max(255),
  number: z.string().min(1, 'Número é obrigatório').max(20),
  complement: z.string().max(100).optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório').max(100),
  city: z.string().min(2, 'Cidade é obrigatória').max(100),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = subtotal >= 200 ? 0 : 15;
  const total = subtotal + shippingCost;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user || items.length === 0) return;

    setIsProcessing(true);

    try {
      // Prepare cart items for Stripe
      const cartItems = items.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.imageUrl,
      }));

      // Call Stripe checkout edge function
      const { data: checkoutData, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: cartItems,
          shipping_cost: shippingCost,
          shipping_address: {
            street: data.street,
            number: data.number,
            complement: data.complement,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            zip_code: data.zipCode,
          },
        },
      });

      if (error) throw error;

      if (checkoutData?.url) {
        // Redirect to Stripe Checkout
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      logError('Checkout', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
      setIsProcessing(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    navigate('/carrinho');
    return null;
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/carrinho')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao carrinho
          </Button>

          <h1 className="text-display-sm font-serif mb-8">Finalizar Compra</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Address */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card p-6 rounded-lg shadow-card"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                    >
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="font-serif text-xl">Endereço de Entrega</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        placeholder="00000-000"
                        {...register('zipCode')}
                        className={errors.zipCode ? 'border-destructive' : ''}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive">{errors.zipCode.message}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        placeholder="Nome da rua"
                        {...register('street')}
                        className={errors.street ? 'border-destructive' : ''}
                      />
                      {errors.street && (
                        <p className="text-sm text-destructive">{errors.street.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        placeholder="123"
                        {...register('number')}
                        className={errors.number ? 'border-destructive' : ''}
                      />
                      {errors.number && (
                        <p className="text-sm text-destructive">{errors.number.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        placeholder="Apto, bloco..."
                        {...register('complement')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        placeholder="Bairro"
                        {...register('neighborhood')}
                        className={errors.neighborhood ? 'border-destructive' : ''}
                      />
                      {errors.neighborhood && (
                        <p className="text-sm text-destructive">{errors.neighborhood.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        placeholder="Cidade"
                        {...register('city')}
                        className={errors.city ? 'border-destructive' : ''}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">{errors.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        placeholder="UF"
                        maxLength={2}
                        {...register('state')}
                        className={errors.state ? 'border-destructive' : ''}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Payment Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card p-6 rounded-lg shadow-card"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                    >
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="font-serif text-xl">Pagamento</h2>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Você será redirecionado para o Stripe Checkout para concluir o pagamento de forma segura.
                      Aceitamos cartões de crédito, débito e outros métodos de pagamento.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card p-6 rounded-lg shadow-card sticky top-24">
                  <h2 className="font-serif text-xl mb-4">Resumo do Pedido</h2>

                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span>
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frete</span>
                      {shippingCost === 0 ? (
                        <span className="text-primary">Grátis</span>
                      ) : (
                        <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      R$ {total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecionando...
                      </>
                    ) : (
                      'Pagar com Stripe'
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Pagamento seguro processado pelo Stripe
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
