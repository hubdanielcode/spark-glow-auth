import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Minus, Plus, ArrowLeft, Clock, Weight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const { data: relatedProducts } = useProducts({ limit: 4 });
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
      toast.success(`${quantity}x ${product.name} adicionado ao carrinho`);
    }
  };

  const discount = product?.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="h-20 bg-muted rounded" />
              <div className="h-12 bg-muted rounded w-1/3" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-serif mb-4">Produto não encontrado</h1>
          <Button asChild>
            <Link to="/produtos">Voltar para produtos</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const related = relatedProducts?.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-cream py-4">
        <div className="container mx-auto px-4">
          <Link
            to="/produtos"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para produtos
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-cream">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-32 h-40 bg-gradient-to-b from-amber/20 to-amber/40 rounded-lg relative candle-glow" />
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <Badge variant="destructive">-{discount}%</Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-amber text-amber-foreground">Destaque</Badge>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {product.category && (
                <Link
                  to={`/categoria/${product.category.slug}`}
                  className="text-sm text-amber hover:underline uppercase tracking-wider"
                >
                  {product.category.name}
                </Link>
              )}

              <h1 className="text-display-sm md:text-display-md font-serif">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-medium text-amber">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                {product.burnTime && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tempo de queima</p>
                      <p className="font-medium">{product.burnTime}</p>
                    </div>
                  </div>
                )}
                {product.weight && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center">
                      <Weight className="h-5 w-5 text-amber" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p className="font-medium">{product.weight}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Scent Notes */}
              {product.scentNotes && product.scentNotes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-amber" />
                    <span className="font-medium">Notas de fragrância</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.scentNotes.map((note) => (
                      <Badge key={note} variant="secondary">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div>
                {product.stock > 0 ? (
                  <p className="text-sm text-green-600">
                    ✓ Em estoque ({product.stock} disponíveis)
                  </p>
                ) : (
                  <p className="text-sm text-destructive">Fora de estoque</p>
                )}
              </div>

              {/* Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1"
                  disabled={product.stock === 0}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>

                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related && related.length > 0 && (
        <section className="py-12 bg-cream">
          <div className="container mx-auto px-4">
            <h2 className="text-display-sm font-serif mb-8 text-center">
              Você também pode gostar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  originalPrice={p.originalPrice || undefined}
                  imageUrl={p.imageUrl || undefined}
                  slug={p.slug}
                  category={p.category?.name}
                  burnTime={p.burnTime || undefined}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
