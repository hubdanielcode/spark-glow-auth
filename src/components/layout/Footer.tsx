import { Link } from 'react-router-dom';
import { Flame, Instagram, Facebook, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-cream-dark border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Flame className="h-7 w-7 text-amber" />
              <span className="font-serif text-xl font-medium">Flaré</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Velas artesanais feitas com amor e ingredientes naturais. 
              Transforme sua casa em um refúgio de paz e bem-estar.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-amber transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-amber transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-amber transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/produtos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categorias
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Ajuda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link to="/entrega" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Entrega
                </Link>
              </li>
              <li>
                <Link to="/trocas" className="text-muted-foreground hover:text-foreground transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Receba novidades e ofertas exclusivas.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="seu@email.com"
                className="bg-background"
              />
              <Button type="submit" className="w-full">
                Inscrever-se
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Flaré. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
