import { useState } from 'react';
import { Button } from '../ui/Button';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    label: 'Platform',
    href: '/platform',
    children: [
      { label: 'The Trueleap Stack', href: '/platform/stack' },
      { label: 'Physical Infrastructure', href: '/platform/infrastructure' },
      { label: 'Digital Systems', href: '/platform/digital-systems' },
      { label: 'Edge AI Engine', href: '/platform/edge-ai' },
    ],
  },
  {
    label: 'Solutions',
    href: '/solutions',
    children: [
      { label: 'Governments', href: '/solutions/governments' },
      { label: 'Education', href: '/solutions/education' },
      { label: 'NGOs', href: '/solutions/ngos' },
      { label: 'Enterprise', href: '/solutions/enterprise' },
      { label: 'Digital Sovereignty', href: '/solutions/digital-sovereignty' },
      { label: 'Workforce Readiness', href: '/solutions/workforce-readiness' },
      { label: 'Rural Connectivity', href: '/solutions/rural-connectivity' },
    ],
  },
  {
    label: 'Global Impact',
    href: '/impact',
    children: [
      { label: 'Live Network Map', href: '/impact/network-map' },
      { label: 'Impact Data', href: '/impact/metrics' },
      { label: 'Case Studies', href: '/impact/case-studies' },
      { label: 'The Last Mile', href: '/impact/last-mile' },
    ],
  },
  {
    label: 'Company',
    href: '/company',
    children: [
      { label: 'Mission & Vision', href: '/company/mission' },
      { label: 'Leadership', href: '/company/leadership' },
      { label: 'Partners', href: '/company/partners' },
      { label: 'Careers', href: '/company/careers' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Trust Center', href: '/resources/trust-center' },
      { label: 'Newsroom', href: '/resources/newsroom' },
      { label: 'Documentation', href: '/resources/docs' },
    ],
  },
];

interface HeaderProps {
  lang?: string;
}

export function Header({ lang = 'en' }: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 mix-blend-difference">
      <nav className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href={`/${lang}`} className="font-display text-2xl italic text-white">
          TrueLeap
        </a>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navigation.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={`/${lang}${item.href}`}
                className="font-mono text-xs uppercase tracking-[0.3em] text-white py-2 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" 
                  style={{ transitionTimingFunction: 'var(--ease-premium)' }} 
                />
              </a>

              {/* Dropdown */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-0 pt-2 mix-blend-normal">
                  <ul className="bg-white text-charcoal rounded-lg shadow-xl py-2 min-w-[200px]">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={`/${lang}${child.href}`}
                          className="block px-4 py-2 text-sm hover:bg-cream transition-colors"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden lg:block mix-blend-normal">
          <Button variant="primary" size="sm" showStatus>
            System Online
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-charcoal mix-blend-normal z-40 overflow-y-auto">
          <ul className="px-6 py-8 space-y-6">
            {navigation.map((item) => (
              <li key={item.label}>
                <a
                  href={`/${lang}${item.href}`}
                  className="font-display text-2xl text-white block mb-3"
                >
                  {item.label}
                </a>
                {item.children && (
                  <ul className="pl-4 space-y-2">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={`/${lang}${child.href}`}
                          className="text-white/70 hover:text-white transition-colors"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
