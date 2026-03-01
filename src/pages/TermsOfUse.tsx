import { Layout } from "@/components/layout/Layout";

const TermsOfUse = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-neutral dark:prose-invert">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-center mb-2">
          Termos de Uso
        </h1>
        <p className="text-muted-foreground text-center mb-10 not-prose">
          Última atualização: Março de 2026
        </p>

        <section className="space-y-4 mb-8">
          <h2 className="font-serif text-xl font-semibold">1. Aceitação dos Termos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ao acessar e utilizar o site da Flaré, você concorda em cumprir e ficar vinculado a estes Termos de Uso. 
            Se você não concordar com qualquer parte destes termos, não deverá utilizar nosso site.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="font-serif text-xl font-semibold">2. Uso do Site</h2>
          <p className="text-muted-foreground leading-relaxed">
            Você se compromete a utilizar o site apenas para fins legais e de maneira que não infrinja os direitos 
            de terceiros. É proibido utilizar o site para transmitir material ilegal, ofensivo ou que viole a 
            propriedade intelectual da Flaré.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="font-serif text-xl font-semibold">3. Conta de Usuário</h2>
          <p className="text-muted-foreground leading-relaxed">
            Para realizar compras, é necessário criar uma conta. Você é responsável por manter a confidencialidade 
            de suas credenciais de acesso e por todas as atividades realizadas em sua conta. Notifique-nos 
            imediatamente caso suspeite de uso não autorizado.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="font-serif text-xl font-semibold">4. Produtos e Preços</h2>
          <p className="text-muted-foreground leading-relaxed">
            Todos os produtos são descritos com a maior precisão possível. No entanto, não garantimos que as 
            descrições ou preços estejam livres de erros. Reservamo-nos o direito de corrigir erros e alterar 
            preços a qualquer momento, sem aviso prévio.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="font-serif text-xl font-semibold">5. Pagamentos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Aceitamos pagamentos via cartões de crédito, débito e PIX, processados com segurança via Stripe. 
            Ao fornecer informações de pagamento, você declara que está autorizado a usar o meio de pagamento informado.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="font-serif text-xl font-semibold">6. Entrega</h2>
          <p className="text-muted-foreground leading-relaxed">
            Os prazos de entrega são estimativas e podem variar conforme a região. A Flaré não se responsabiliza 
            por atrasos causados por transportadoras ou situações de força maior. Consulte nossa{" "}
            <a href="/entrega" className="text-amber hover:underline">Política de Entrega</a> para mais detalhes.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="font-serif text-xl font-semibold">7. Trocas e Devoluções</h2>
          <p className="text-muted-foreground leading-relaxed">
            O consumidor tem o direito de arrependimento em até 7 dias corridos após o recebimento do produto, 
            conforme o Código de Defesa do Consumidor. Consulte nossa{" "}
            <a href="/trocas" className="text-amber hover:underline">Política de Trocas e Devoluções</a>.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="font-serif text-xl font-semibold">8. Propriedade Intelectual</h2>
          <p className="text-muted-foreground leading-relaxed">
            Todo o conteúdo do site, incluindo textos, imagens, logotipos e design, é de propriedade exclusiva 
            da Flaré e protegido pelas leis de direitos autorais. É proibida a reprodução sem autorização prévia.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="font-serif text-xl font-semibold">9. Limitação de Responsabilidade</h2>
          <p className="text-muted-foreground leading-relaxed">
            A Flaré não será responsável por danos indiretos, incidentais ou consequentes decorrentes do uso 
            ou impossibilidade de uso do site ou dos produtos adquiridos.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="font-serif text-xl font-semibold">10. Contato</h2>
          <p className="text-muted-foreground leading-relaxed">
            Para dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail{" "}
            <a href="mailto:flores.frondosas@gmail.com" className="text-amber hover:underline">
              flores.frondosas@gmail.com
            </a>{" "}
            ou pelo telefone (71) 99246-5937.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default TermsOfUse;
