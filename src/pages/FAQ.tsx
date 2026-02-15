import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quais materiais são usados nas velas?",
    a: "Nossas velas são feitas com cera de soja 100% natural, pavios de algodão ecológico e óleos essenciais puros. Não utilizamos parafina, corantes artificiais ou fragrâncias sintéticas.",
  },
  {
    q: "Qual o tempo de queima das velas?",
    a: "O tempo de queima varia de acordo com o tamanho da vela. Nossas velas pequenas duram aproximadamente 20 horas, as médias cerca de 40 horas e as grandes até 60 horas.",
  },
  {
    q: "Como devo cuidar da minha vela?",
    a: "Apare o pavio para aproximadamente 5mm antes de cada uso. Na primeira queima, deixe a vela acesa até que toda a superfície derreta uniformemente. Evite correntes de ar e nunca deixe a vela acesa sem supervisão.",
  },
  {
    q: "Vocês fazem entregas para todo o Brasil?",
    a: "Sim! Realizamos entregas para todos os estados brasileiros. O prazo e valor do frete variam conforme a região e são calculados automaticamente no checkout.",
  },
  {
    q: "Posso personalizar uma vela?",
    a: "Sim! Oferecemos opções de personalização para presentes e eventos. Entre em contato conosco pela página de Contato para solicitar um orçamento personalizado.",
  },
  {
    q: "As velas são veganas e cruelty-free?",
    a: "Sim, todas as nossas velas são 100% veganas e cruelty-free. Não realizamos testes em animais e não utilizamos nenhum ingrediente de origem animal.",
  },
  {
    q: "Qual a política de troca e devolução?",
    a: "Aceitamos trocas e devoluções em até 7 dias após o recebimento, desde que o produto esteja lacrado e em perfeitas condições. Consulte nossa página de Trocas e Devoluções para mais detalhes.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Aceitamos cartões de crédito (Visa, Mastercard, Elo, American Express), cartões de débito e PIX. O processamento é feito via Stripe, garantindo segurança total nas transações.",
  },
];

const FAQ = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-center mb-2">
          Perguntas Frequentes
        </h1>
        <p className="text-muted-foreground text-center mb-10">
          Tire suas dúvidas sobre nossos produtos e serviços
        </p>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
};

export default FAQ;
