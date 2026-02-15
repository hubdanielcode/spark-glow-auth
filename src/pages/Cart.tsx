import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Cart() {
  const { items, isLoading, subtotal, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();

  const shippingCost = subtotal >= 200 ? 0 : 15;
  const total = subtotal + shippingCost;

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-serif mb-4">Faça login para ver seu carrinho</h1>
            <p className="text-muted-foreground mb-8">
              Você precisa estar logado para adicionar produtos ao carrinho.
            </p>
            <Button asChild size="lg">
              <Link to="/login">
                Fazer Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-6 p-4 bg-muted rounded-lg">
                <div className="w-24 h-24 bg-muted-foreground/10 rounded" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-muted-foreground/10 rounded w-1/3" />
                  <div className="h-4 bg-muted-foreground/10 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-serif mb-4">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-8">
              Explore nossa coleção e adicione produtos incríveis ao seu carrinho.
            </p>
            <Button asChild size="lg">
              <Link to="/produtos">
                Explorar Produtos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-display-sm font-serif mb-8">Carrinho de Compras</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-4 p-4 bg-card rounded-lg shadow-card"
                  >
                    {/* Image */}
                    <Link to={`/produto/${item.product.slug}`} className="shrink-0">
                      <div className="w-24 h-24 rounded-md overflow-hidden bg-cream">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-12 h-16 bg-gradient-to-b from-amber/30 to-amber/50 rounded" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/produto/${item.product.slug}`}
                        className="font-serif text-lg hover:text-amber transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium text-amber">
                          R$ {item.product.price.toFixed(2).replace('.', ',')}
                        </span>
                        {item.product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            R$ {item.product.originalPrice.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="hidden sm:block text-right">
                      <p className="text-sm text-muted-foreground">Subtotal</p>
                      <p className="font-medium">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card p-6 rounded-lg shadow-card sticky top-24">
                  <h2 className="font-serif text-xl mb-4">Resumo do Pedido</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frete</span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Grátis</span>
                      ) : (
                        <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
                      )}
                    </div>
                    {subtotal < 200 && (
                      <p className="text-xs text-muted-foreground">
                        Frete grátis em compras acima de R$ 200,00
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span className="text-amber">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>

                  <Button asChild className="w-full mt-6" size="lg">
                    <Link to="/checkout">
                      Finalizar Compra
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full mt-3">
                    <Link to="/produtos">
                      Continuar Comprando
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
