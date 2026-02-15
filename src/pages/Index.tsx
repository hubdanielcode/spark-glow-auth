import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { useProducts, useCategories } from '@/hooks/useProducts';

export default function Index() {
  const { data: featuredProducts, isLoading: productsLoading } = useProducts({ featured: true, limit: 4 });
  const { data: categories } = useCategories();

  const features = [
    { icon: Sparkles, title: "100% Artesanal", desc: "Feitas à mão com ingredientes naturais" },
    { icon: Truck, title: "Entrega Rápida", desc: "Enviamos para todo o Brasil" },
    { icon: Shield, title: "Qualidade Premium", desc: "Garantia de satisfação" },
    { icon: Heart, title: "Feito com Amor", desc: "Cada vela é única e especial" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 right-20 w-72 h-72 rounded-full bg-amber/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="luxury-badge mb-6"
              >
                ✨ Coleção Inverno 2026
              </motion.span>
              
              <h1 className="text-display-lg md:text-display-xl font-serif mb-6 leading-tight">
                Ilumine seus{' '}
                <span className="text-gradient">momentos</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Velas artesanais feitas com ingredientes naturais para transformar 
                sua casa em um refúgio de paz e bem-estar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="btn-shine text-base px-8">
                  <Link to="/produtos">
                    Explorar Coleção
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8">
                  <Link to="/sobre">
                    Nossa História
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50">
                {[
                  { value: "5000+", label: "Clientes Felizes" },
                  { value: "50+", label: "Fragrâncias" },
                  { value: "100%", label: "Natural" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center lg:text-left"
                  >
                    <p className="text-2xl md:text-3xl font-serif font-medium text-amber">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image/Candle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center"
            >
              <div className="relative">
                {/* Glow Effect */}
                <motion.div
                  className="absolute -inset-8 bg-gradient-radial from-amber/20 via-transparent to-transparent rounded-full blur-2xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Candle Placeholder */}
                <div className="relative w-64 h-80 md:w-80 md:h-96 bg-gradient-to-b from-cream to-cream-dark rounded-2xl shadow-luxury-lg flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="w-24 h-32 mx-auto bg-gradient-to-b from-amber-light to-amber rounded-lg relative"
                      style={{ borderRadius: '10% 10% 50% 50% / 5% 5% 50% 50%' }}
                    >
                      {/* Wick */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-wick" />
                      {/* Flame */}
                      <motion.div
                        className="absolute -top-10 left-1/2 -translate-x-1/2 w-4 h-8"
                        animate={{ scale: [1, 1.1, 0.9, 1], opacity: [0.9, 1, 0.8, 0.9] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="w-full h-full bg-gradient-to-t from-amber via-gold-light to-transparent rounded-full blur-sm" />
                      </motion.div>
                    </motion.div>
                    <p className="mt-6 font-serif text-lg text-foreground/80">Flaré</p>
                    <p className="text-sm text-muted-foreground">Lavanda Provence</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-cream-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-amber/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-amber" />
                </div>
                <h3 className="font-serif text-lg font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="luxury-badge mb-4">Seleção Especial</span>
            <h2 className="text-display-sm md:text-display-md font-serif mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra nossas velas mais amadas, cuidadosamente selecionadas para 
              proporcionar momentos únicos de relaxamento e bem-estar.
            </p>
          </motion.div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-cream rounded-lg animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-5 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice || undefined}
                  imageUrl={product.imageUrl || undefined}
                  slug={product.slug}
                  category={product.category?.name}
                  isFeatured={product.isFeatured}
                  burnTime={product.burnTime || undefined}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/produtos">
                Ver Todos os Produtos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-display-sm md:text-display-md font-serif mb-4">
              Explore por Categoria
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Encontre a vela perfeita para cada ocasião e ambiente.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories?.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/categoria/${category.slug}`}
                  className="group block relative aspect-[4/5] rounded-lg overflow-hidden bg-gradient-to-b from-amber/10 to-bronze/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                    <h3 className="font-serif text-xl md:text-2xl text-cream font-medium mb-1 group-hover:text-amber transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-cream/70 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-amber opacity-90" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        </motion.div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-display-sm md:text-display-md font-serif text-primary-foreground mb-4">
              Pronto para iluminar sua casa?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Cadastre-se agora e ganhe 10% de desconto na sua primeira compra.
            </p>
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="text-base px-8"
            >
              <Link to="/cadastro">
                Criar Minha Conta
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
