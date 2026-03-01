import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Flame, ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const forgotSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      setEmailSent(true);
      toast.success("E-mail de recuperação enviado!");
    } catch {
      toast.error("Erro ao enviar e-mail. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <Flame className="h-8 w-8 text-amber" />
          <span className="font-serif text-2xl font-medium">Flaré</span>
        </Link>

        {emailSent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-amber" />
            </div>
            <h1 className="text-2xl font-serif font-medium">Verifique seu e-mail</h1>
            <p className="text-muted-foreground">
              Enviamos um link de recuperação de senha para o seu e-mail. 
              Verifique sua caixa de entrada e spam.
            </p>
            <Link to="/login">
              <Button variant="outline" className="mt-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-serif font-medium mb-2">
                Esqueceu sua senha?
              </h1>
              <p className="text-muted-foreground">
                Informe seu e-mail e enviaremos um link para redefinir sua senha.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar link de recuperação"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-amber hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Voltar ao login
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
