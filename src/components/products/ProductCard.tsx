import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  slug: string;
  category?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  burnTime?: string;
  className?: string;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  slug,
  category,
  isNew,
  isFeatured,
  burnTime,
  className,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        "group relative bg-card rounded-xl overflow-hidden transition-all duration-500",
        "shadow-card hover:shadow-luxury-lg",
        "border border-border/30 hover:border-amber/30",
        className
      )}
    >
      <Link to={`/produto/${slug}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-cream">
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-24 bg-gradient-to-b from-amber/20 to-amber/40 rounded-lg relative candle-glow" />
            </div>
          )}

          {/* Elegant Overlay on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {discount > 0 && (
              <Badge variant="destructive" className="text-xs font-medium shadow-md">
                -{discount}%
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-amber text-amber-foreground text-xs font-medium shadow-md">
                Novo
              </Badge>
            )}
            {isFeatured && (
              <Badge variant="secondary" className="text-xs font-medium shadow-md backdrop-blur-sm">
                Destaque
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1 }}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
          >
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background border border-border/50"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Add to Cart Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 z-10"
          >
            <Button
              onClick={handleAddToCart}
              className="w-full gap-2 shadow-xl bg-amber hover:bg-amber-dark text-amber-foreground font-medium"
              size="sm"
            >
              <ShoppingBag className="h-4 w-4" />
              Adicionar ao Carrinho
            </Button>
          </motion.div>

          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 bg-gradient-to-b from-card to-card/80">
          {category && (
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 font-medium">
              {category}
            </p>
          )}
          
          <h3 className="font-serif text-lg font-medium line-clamp-1 group-hover:text-amber transition-colors duration-300">
            {name}
          </h3>

          {burnTime && (
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-amber" />
              {burnTime} de queima
            </p>
          )}

          <div className="flex items-center gap-2.5 mt-4">
            <span className="font-semibold text-lg text-amber">
              R$ {price.toFixed(2).replace('.', ',')}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
