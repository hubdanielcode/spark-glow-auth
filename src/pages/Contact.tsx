import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contato@flare.com.br',
    href: 'mailto:contato@flare.com.br',
  },
  {
    icon: Phone,
    label: 'Telefone',
    value: '(71) 99246-5937',
    href: 'tel:+5571992465937',
  },
  {
    icon: MapPin,
    label: 'Endereço',
    value: 'Salvador, BA - Brasil',
    href: null,
  },
  {
    icon: Clock,
    label: 'Horário',
    value: 'Seg - Sex: 9h às 18h',
    href: null,
  },
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Mensagem enviada com sucesso!', {
      description: 'Entraremos em contato em breve.',
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
            Entre em Contato
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tem alguma dúvida ou sugestão? Adoraríamos ouvir você. 
            Preencha o formulário abaixo ou use nossos canais de contato.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
              <h2 className="font-serif text-2xl font-medium mb-6">
                Envie sua Mensagem
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      required
                      className="form-input-luxury"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      required
                      className="form-input-luxury"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Sobre o que você quer falar?"
                    required
                    className="form-input-luxury"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escreva sua mensagem aqui..."
                    required
                    rows={5}
                    className="form-input-luxury resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gap-2 bg-amber hover:bg-amber-dark text-amber-foreground"
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-serif text-2xl font-medium mb-6">
                Informações de Contato
              </h2>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-cream/50 border border-border/30"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-amber" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="font-medium hover:text-amber transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber/10 to-bronze/10 border border-amber/20">
              <h3 className="font-serif text-xl font-medium mb-3">
                Perguntas Frequentes
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Antes de entrar em contato, confira se sua dúvida já foi respondida 
                em nossa seção de perguntas frequentes.
              </p>
              <Button variant="outline" size="sm" className="border-amber/30 hover:bg-amber/10">
                Ver FAQ
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
