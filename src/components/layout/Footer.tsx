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
    <footer className="relative bg-charcoal text-white pt-24 pb-8">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Quote */}
        <blockquote className="font-quote text-3xl md:text-4xl lg:text-5xl text-center max-w-3xl mx-auto mb-20 leading-tight">
          "Connectivity is not a luxury. It is the foundation of opportunity."
        </blockquote>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <Mono className="text-white/40 mb-4 block">Platform</Mono>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <a 
                    href={`/${lang}${link.href}`}
                    className="text-white/70 hover:text-white transition-colors"
                    style={{ transitionDuration: 'var(--duration-normal)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Mono className="text-white/40 mb-4 block">Company</Mono>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a 
                    href={`/${lang}${link.href}`}
                    className="text-white/70 hover:text-white transition-colors"
                    style={{ transitionDuration: 'var(--duration-normal)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Mono className="text-white/40 mb-4 block">Resources</Mono>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a 
                    href={`/${lang}${link.href}`}
                    className="text-white/70 hover:text-white transition-colors"
                    style={{ transitionDuration: 'var(--duration-normal)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Mono className="text-white/40 mb-4 block">Connect</Mono>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors"
                    style={{ transitionDuration: 'var(--duration-normal)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a 
                  href="mailto:hello@trueleapinc.com"
                  className="text-white/70 hover:text-white transition-colors"
                  style={{ transitionDuration: 'var(--duration-normal)' }}
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
            {year} TrueLeap Inc.
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
