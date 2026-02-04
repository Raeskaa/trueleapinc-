import { Mono } from '../ui/Typography';

const footerLinks = {
  platform: [
    { label: 'The Stack', href: '/platform/stack' },
    { label: 'Infrastructure', href: '/platform/infrastructure' },
    { label: 'Digital Systems', href: '/platform/digital-systems' },
    { label: 'Edge AI', href: '/platform/edge-ai' },
  ],
  company: [
    { label: 'Mission', href: '/company/mission' },
    { label: 'Leadership', href: '/company/leadership' },
    { label: 'Careers', href: '/company/careers' },
    { label: 'Partners', href: '/company/partners' },
  ],
  resources: [
    { label: 'Trust Center', href: '/resources/trust-center' },
    { label: 'Newsroom', href: '/resources/newsroom' },
    { label: 'Documentation', href: '/resources/docs' },
  ],
};

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/company/trueleap' },
  { label: 'Twitter', href: 'https://twitter.com/trueleap' },
];

interface FooterProps {
  lang?: string;
}

export function Footer({ lang = 'en' }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-charcoal text-white pt-32 pb-8">
      {/* Curved top */}
      <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden -translate-y-full">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-40 bg-charcoal rounded-t-[5rem]" />
      </div>

      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Quote */}
        <blockquote className="font-display text-4xl md:text-5xl lg:text-6xl italic text-center max-w-4xl mx-auto mb-20 leading-tight">
          "Connectivity is not a luxury. It is the foundation of opportunity."
        </blockquote>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <Mono className="text-white/60 mb-4 block">Platform</Mono>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <a 
                    href={`/${lang}${link.href}`}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Mono className="text-white/60 mb-4 block">Company</Mono>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a 
                    href={`/${lang}${link.href}`}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Mono className="text-white/60 mb-4 block">Resources</Mono>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a 
                    href={`/${lang}${link.href}`}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Mono className="text-white/60 mb-4 block">Connect</Mono>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a 
                  href="mailto:hello@trueleapinc.com"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  hello@trueleapinc.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Mono className="text-white/40">
            {year} TrueLeap Inc. All rights reserved.
          </Mono>
          <div className="flex gap-6">
            <a href={`/${lang}/privacy`} className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Privacy
            </a>
            <a href={`/${lang}/terms`} className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
