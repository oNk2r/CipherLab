import React, { useState } from 'react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenWorkspace: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate, onOpenWorkspace }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'workspace', label: 'Workspace', target: 'interactive-suite' },
    { id: 'ciphers', label: 'Ciphers', target: 'ciphers-grid' },
    { id: 'tools', label: 'Tools', target: 'laboratory-tools' },
  ];

  const handleNavClick = (target: string, id: string) => {
    onNavigate(id);
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 pt-3 sm:pt-4">
      <div className="h-16 w-full max-w-7xl mx-auto bg-white/95 backdrop-blur-md border-[3px] border-[#111111] rounded-2xl px-4 sm:px-6 flex items-center justify-between shadow-[4px_4px_0px_#111111]">
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFE066] border-2 border-[#111111] flex items-center justify-center font-headline-lg font-bold text-base shadow-[2px_2px_0px_#111111] group-hover:rotate-6 transition-transform">
            CL
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-headline-lg text-xl sm:text-2xl tracking-tight text-[#111111] font-bold">
              CipherLab
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B8F28B] border border-[#111111] text-[11px] font-bold text-[#111111]">
              <span className="w-2 h-2 rounded-full bg-[#006A65] animate-pulse"></span>
              Client-Side
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.target, item.id)}
                className={`font-headline-sm text-sm uppercase px-3.5 py-1.5 rounded-xl border-2 transition-all cursor-pointer font-bold ${
                  isActive
                    ? 'bg-[#FFE066] text-[#111111] border-[#111111] shadow-[2px_2px_0px_#111111]'
                    : 'border-transparent text-[#4C4736] hover:text-[#111111] hover:bg-[#F0EDEC] hover:border-[#111111]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action CTA & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="header-workspace-btn"
            onClick={onOpenWorkspace}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#111111] bg-[#111111] text-[#FFE066] font-headline-sm text-xs uppercase font-bold shadow-[2px_2px_0px_#FFE066] hover:bg-[#FFE066] hover:text-[#111111] hover:border-[#111111] transition-all cursor-pointer"
          >
            <span>Open Studio</span>
            <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-xl border-2 border-[#111111] bg-[#F0EDEC] text-[#111111] active:translate-y-0.5"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto bg-white border-[3px] border-[#111111] rounded-2xl p-4 shadow-[6px_6px_0px_#111111] flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.target, item.id)}
              className="text-left font-headline-sm text-sm uppercase px-3 py-2.5 rounded-xl border-2 border-[#111111] bg-[#FFF8EE] hover:bg-[#FFE066] font-bold text-[#111111]"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenWorkspace();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 rounded-xl border-2 border-[#111111] bg-[#111111] text-[#FFE066] font-bold text-xs uppercase text-center mt-1"
          >
            Open Studio ↓
          </button>
        </div>
      )}
    </header>
  );
};
