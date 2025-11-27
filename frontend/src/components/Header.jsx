import { useState } from "react";
import { Menu, X } from "lucide-react";

const onOpenLogin = () => {
  
}

const onOpenRegister = () => {
  
}

export function Header({ onOpenLogin, onOpenRegister }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white">H</span>
            </div>
            <span className="text-primary">Seaside Hotel</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">
              Beranda
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              Tentang
            </a>
            <a href="#rooms" className="text-foreground hover:text-primary transition-colors">
              Kamar
            </a>
            <a href="#amenities" className="text-foreground hover:text-primary transition-colors">
              Fasilitas
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Kontak
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="text-primary border border-primary px-6 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Masuk
            </button>
            <button
              onClick={onOpenRegister}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Daftar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">
              Beranda
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              Tentang
            </a>
            <a href="#rooms" className="text-foreground hover:text-primary transition-colors">
              Kamar
            </a>
            <a href="#amenities" className="text-foreground hover:text-primary transition-colors">
              Fasilitas
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Kontak
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={onOpenLogin}
                className="text-primary border border-primary px-6 py-2 rounded-lg hover:bg-primary/10 transition-colors w-full"
              >
                Masuk
              </button>
              <button
                onClick={onOpenRegister}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors w-full"
              >
                Daftar
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}