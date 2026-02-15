import { Layout } from "@/components/layout/Layout";
import { Truck, Clock, MapPin, Package } from "lucide-react";

const sections = [
  {
    icon: MapPin,
    title: "Área de Cobertura",
    content:
      "Realizamos entregas para todos os estados brasileiros. O prazo e valor do frete são calculados automaticamente no checkout com base no seu CEP.",
  },
  {
    icon: Clock,
    title: "Prazos de Entrega",
    content:
      "Após a confirmação do pagamento, o pedido é preparado em até 3 dias úteis. O prazo de entrega varia de 5 a 15 dias úteis, dependendo da região. Regiões Sul e Sudeste costumam receber em até 7 dias úteis.",
  },
  {
    icon: Truck,
    title: "Formas de Envio",
    content:
      "Trabalhamos com transportadoras parceiras para garantir a segurança dos produtos. Todas as entregas possuem código de rastreamento, que é enviado por e-mail assim que o pedido for despachado.",
  },
  {
    icon: Package,
    title: "Embalagem",
    content:
      "Nossas velas são cuidadosamente embaladas com materiais sustentáveis que garantem proteção durante o transporte. Cada pedido é preparado com carinho e inclui um cartão de agradecimento.",
  },
];

const DeliveryPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-center mb-2">
          Política de Entrega
        </h1>
        <p className="text-muted-foreground text-center mb-10">
          Saiba como funciona o envio dos nossos produtos
        </p>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold mb-2">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-muted/50 border">
          <h3 className="font-serif text-lg font-semibold mb-2">Frete Grátis</h3>
          <p className="text-muted-foreground text-sm">
            Oferecemos frete grátis para compras acima de R$ 200,00 para todo o Brasil. Aproveite!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DeliveryPolicy;
