import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/lib/logger';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId },
        });

        if (error) throw error;

        if (data.success) {
          setStatus('success');
          setEmail(data.customer_email);
        } else {
          setStatus('error');
        }
      } catch (error) {
        logError('CheckoutSuccess.verifyPayment', error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Verificando pagamento...</p>
        </div>
      </Layout>
    );
  }

  if (status === 'error') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-display-sm font-serif mb-4">Erro no Pagamento</h1>
            <p className="text-muted-foreground mb-8">
              Não foi possível confirmar seu pagamento. Por favor, tente novamente ou entre em contato conosco.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/checkout')}>
                Tentar Novamente
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Voltar à Loja
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-display-sm font-serif mb-4">Pagamento Confirmado!</h1>
          <p className="text-muted-foreground mb-2">
            Seu pedido foi processado com sucesso.
          </p>
          {email && (
            <p className="text-sm text-muted-foreground mb-8">
              Um e-mail de confirmação foi enviado para <span className="font-medium">{email}</span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/meus-pedidos')}>
              Ver Meus Pedidos
            </Button>
            <Button variant="outline" onClick={() => navigate('/produtos')}>
              Continuar Comprando
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
