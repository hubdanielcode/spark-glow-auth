import { motion } from 'framer-motion';
import { Heart, Leaf, Award } from 'lucide-react';
import logoImg from '@/assets/logo.png';
import { Layout } from '@/components/layout/Layout';

const values = [
  {
    icon: Heart,
    title: 'Artesanal',
    description: 'Cada vela é cuidadosamente feita à mão com atenção aos mínimos detalhes.',
  },
  {
    icon: Leaf,
    title: 'Sustentável',
    description: 'Utilizamos cera de soja 100% natural e pavios de algodão livre de metais.',
  },
  {
    icon: Heart,
    title: 'Com Amor',
    description: 'Colocamos paixão em cada etapa, desde a escolha das fragrâncias até a embalagem.',
  },
  {
    icon: Award,
    title: 'Qualidade Premium',
    description: 'Selecionamos apenas os melhores ingredientes para garantir uma experiência única.',
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-serif text-4xl md:text-6xl font-medium mb-6">
              Nossa História
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A Flaré nasceu de uma paixão por transformar momentos simples em experiências 
              memoráveis. Acreditamos que a luz de uma vela tem o poder de criar atmosferas 
              únicas e despertar emoções.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-cream"
            >
              <img
                src="https://images.unsplash.com/photo-1602607536788-c7d5ef6c4ff6?w=800"
                alt="Processo artesanal de fabricação"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="luxury-badge mb-4">Nossa Missão</span>
              <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">
                Iluminando Momentos Especiais
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Fundada em 2020, a Flaré começou como um pequeno ateliê caseiro, 
                  onde cada vela era criada com amor e dedicação. O que começou como 
                  um hobby rapidamente se transformou em uma missão: levar luz, 
                  fragrância e conforto para lares em todo o Brasil.
                </p>
                <p>
                  Hoje, mantemos o mesmo cuidado artesanal de nossos primeiros dias, 
                  mas com uma visão expandida. Cada vela Flaré é uma pequena obra de 
                  arte, feita para transformar qualquer ambiente em um refúgio de 
                  tranquilidade e beleza.
                </p>
                <p>
                  Nosso compromisso com a sustentabilidade guia cada decisão: desde 
                  a escolha de cera de soja renovável até embalagens recicláveis, 
                  acreditamos que luxo e responsabilidade ambiental caminham juntos.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
              Nossos Valores
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Os princípios que guiam cada vela que criamos
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-card shadow-card"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber/10 flex items-center justify-center">
                  <value.icon className="h-7 w-7 text-amber" />
                </div>
                <h3 className="font-serif text-xl font-medium mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
              Faça Parte da Nossa História
            </h2>
            <p className="text-muted-foreground mb-8">
              Descubra como uma simples vela pode transformar seu dia a dia
            </p>
            <a
              href="/produtos"
              className="inline-flex items-center gap-2 px-8 py-3 bg-amber text-amber-foreground rounded-full font-medium hover:bg-amber-dark transition-colors"
            >
              <img src={logoImg} alt="Flaré" className="h-5 w-5 object-contain" />
              Explorar Coleção
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
