import { Layout } from "@/components/layout/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-center mb-2">
          Política de Privacidade
        </h1>
        <p className="text-muted-foreground text-center mb-10">
          Última atualização: Fevereiro de 2026
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="font-serif text-xl font-semibold mb-3">1. Informações que Coletamos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Coletamos informações que você nos fornece diretamente, como nome, e-mail, endereço de entrega e dados de pagamento ao realizar uma compra. Também coletamos dados de navegação automaticamente, como endereço IP e cookies, para melhorar sua experiência.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-3">2. Uso das Informações</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos suas informações para processar pedidos, enviar atualizações sobre entregas, oferecer suporte ao cliente e, com seu consentimento, enviar comunicações de marketing sobre novos produtos e promoções.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-3">3. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Não vendemos suas informações pessoais. Compartilhamos dados apenas com parceiros essenciais para a operação, como processadores de pagamento (Stripe) e transportadoras, sempre com proteções adequadas de segurança.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-3">4. Segurança</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Os pagamentos são processados de forma segura via Stripe e não armazenamos dados de cartão de crédito.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-3">5. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem direito a acessar, corrigir, excluir ou portar seus dados pessoais. Para exercer qualquer um desses direitos, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@flare.com.br" className="text-primary hover:underline">
                contato@flare.com.br
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-3">6. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para entender como os visitantes interagem com a plataforma. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-3">7. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para dúvidas sobre esta política ou sobre o tratamento dos seus dados, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@flare.com.br" className="text-primary hover:underline">
                contato@flare.com.br
              </a>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
