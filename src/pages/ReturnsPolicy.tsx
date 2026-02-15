import { Layout } from "@/components/layout/Layout";
import { RotateCcw, AlertCircle, CheckCircle, Mail } from "lucide-react";

const ReturnsPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-center mb-2">
          Trocas e Devoluções
        </h1>
        <p className="text-muted-foreground text-center mb-10">
          Conheça nossa política de trocas e devoluções
        </p>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-3">
              <RotateCcw className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-semibold">Direito de Arrependimento</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Conforme o Código de Defesa do Consumidor (Art. 49), você tem até <strong>7 dias corridos</strong> após o recebimento do produto para solicitar a devolução, sem necessidade de justificativa. O produto deve estar lacrado e em perfeitas condições.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-semibold">Condições para Troca</h2>
            </div>
            <ul className="text-muted-foreground space-y-2 list-disc list-inside">
              <li>O produto deve estar na embalagem original, sem sinais de uso</li>
              <li>Acompanhar nota fiscal ou comprovante de compra</li>
              <li>Solicitação feita dentro do prazo de 7 dias após recebimento</li>
              <li>Produtos danificados no transporte devem ser reportados em até 48 horas</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-semibold">Produtos Não Elegíveis</h2>
            </div>
            <ul className="text-muted-foreground space-y-2 list-disc list-inside">
              <li>Velas já utilizadas ou com lacre violado</li>
              <li>Produtos personalizados sob encomenda</li>
              <li>Itens sem embalagem original</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-semibold">Como Solicitar</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Para solicitar uma troca ou devolução, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@flare.com.br" className="text-primary hover:underline">
                contato@flare.com.br
              </a>{" "}
              informando o número do pedido e o motivo da solicitação. Nossa equipe responderá em até 2 dias úteis.
            </p>
          </section>

          <div className="p-6 rounded-2xl bg-muted/50 border">
            <h3 className="font-serif text-lg font-semibold mb-2">Reembolso</h3>
            <p className="text-muted-foreground text-sm">
              Após a aprovação da devolução e recebimento do produto, o reembolso será processado em até 10 dias úteis, utilizando o mesmo método de pagamento da compra original.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnsPolicy;
