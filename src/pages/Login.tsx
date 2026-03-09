import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import logoImg from "@/assets/logo-loja.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth";
import { toast } from "sonner";
import { logError } from "@/lib/logger";

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255, "E-mail deve ter no máximo 255 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(128, "Senha deve ter no máximo 128 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn({ email: data.email, password: data.password });
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      logError("Login", error);
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("E-mail ou senha incorretos");
      } else if (error.message?.includes("Email not confirmed")) {
        toast.error("Por favor, confirme seu e-mail antes de fazer login");
      } else {
        toast.error("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-background">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mx-auto w-full max-w-sm lg:max-w-md"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 mb-8 group"
          >
            <img
              src={logoImg}
              alt="Flaré"
              className="h-8 w-8 object-contain"
            />
            <span className="font-serif text-2xl font-medium">Flaré</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-display-sm font-serif mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground">
              Entre com sua conta para continuar
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                maxLength={255}
                placeholder="seu@email.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  to="/esqueci-senha"
                  className="text-sm text-amber hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                to="/cadastro"
                className="text-amber hover:underline font-medium"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right - Decorative */}
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
              style={{ borderRadius: "10% 10% 50% 50% / 5% 5% 50% 50%" }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-wick" />
              <motion.div
                className="absolute -top-[3.55rem] left-[3.20rem] -translate-x-1/2 w-6 h-10"
                animate={{
                  scale: [1, 1.1, 0.9, 1],
                  opacity: [0.9, 1, 0.8, 0.9],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-full h-full bg-gradient-to-t from-amber via-gold-light to-transparent rounded-full blur-sm" />
              </motion.div>
            </motion.div>
            <h2 className="text-3xl text-muted-foreground font-serif mb-4">
              Momentos especiais
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Acesse sua conta e continue explorando nossa coleção de velas
              artesanais.
            </p>
          </motion.div>
        </div>

        {/* Decorative blurs */}
        <motion.div
          className="absolute top-20 right-20 w-48 h-48 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
    </div>
  );
}
