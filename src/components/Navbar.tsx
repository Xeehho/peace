import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, X, HeartHandshake } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/timeline', label: '时间线' },
  { to: '/insights', label: '数据洞察' },
  { to: '/about', label: '关于' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { resetToGlobal } = useAppStore();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-archive-border/60 bg-archive-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-6">
        <Link
          to="/"
          onClick={resetToGlobal}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Globe className="h-5 w-5 text-archive-terracotta" />
          <span className="font-serif text-lg font-semibold tracking-tight text-archive-ink">
            和平纪年
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={link.to === '/' ? resetToGlobal : undefined}
              className={`text-sm transition-colors ${
                isActive(link.to)
                  ? 'font-medium text-archive-terracotta'
                  : 'text-archive-muted hover:text-archive-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/#cta"
            className="flex items-center gap-1.5 rounded-full border border-archive-terracotta px-4 py-1.5 text-sm text-archive-terracotta transition-colors hover:bg-archive-terracotta hover:text-white"
          >
            <HeartHandshake className="h-3.5 w-3.5" />
            行动呼吁
          </a>
        </div>

        <button
          className="rounded p-2 text-archive-ink md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-archive-border/60 bg-archive-cream px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => {
                  setMenuOpen(false);
                  if (link.to === '/') resetToGlobal();
                }}
                className={`text-sm ${
                  isActive(link.to) ? 'font-medium text-archive-terracotta' : 'text-archive-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/#cta"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 text-sm text-archive-terracotta"
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              行动呼吁
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
