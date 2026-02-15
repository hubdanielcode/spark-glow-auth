import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Flame, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/lib/auth';
import { toast } from 'sonner';
import { logError } from '@/lib/logger';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('E-mail inválido').max(255),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });
      toast.success('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
      navigate('/login');
    } catch (error: any) {
      logError('Signup', error);
      if (error.message?.includes('User already registered')) {
        toast.error('Este e-mail já está cadastrado');
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Decorative */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-amber overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-primary-foreground"
          >
            <motion.div
              className="w-32 h-40 mx-auto mb-8 bg-gradient-to-b from-cream/90 to-cream/70 rounded-lg relative"
              style={{ borderRadius: '10% 10% 50% 50% / 5% 5% 50% 50%' }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-wick" />
              <motion.div
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-6 h-10"
                animate={{ scale: [1, 1.1, 0.9, 1], opacity: [0.9, 1, 0.8, 0.9] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-full h-full bg-gradient-to-t from-amber via-gold-light to-transparent rounded-full blur-sm" />
              </motion.div>
            </motion.div>
            <h2 className="text-3xl font-serif mb-4">Bem-vindo à Flaré</h2>
            <p className="text-primary-foreground/80 max-w-sm mx-auto">
              Crie sua conta e descubra nossa coleção exclusiva de velas artesanais.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="absolute top-20 left-20 w-48 h-48 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mx-auto w-full max-w-sm lg:max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <Flame className="h-8 w-8 text-amber" />
            <span className="font-serif text-2xl font-medium">Flaré</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-display-sm font-serif mb-2">Criar conta</h1>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para se cadastrar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Seu nome"
                {...register('fullName')}
                className={errors.fullName ? 'border-destructive' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Ao criar uma conta, você concorda com nossos{' '}
              <Link to="/termos" className="text-amber hover:underline">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link to="/privacidade" className="text-amber hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-amber hover:underline font-medium">
                Fazer login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
