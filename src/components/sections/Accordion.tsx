import { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
  tags?: string[];
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className = '' }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={`divide-y divide-border ${className}`}>
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
}

interface AccordionRowProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionRow({ item, isOpen, onToggle }: AccordionRowProps) {
  return (
    <div className="py-6">
      <button
        onClick={onToggle}
        className="w-full text-left flex items-center justify-between gap-4 group"
        aria-expanded={isOpen}
      >
        <h3 
          className={`font-display text-2xl md:text-3xl transition-colors duration-300 ${
            isOpen ? 'text-charcoal' : 'text-charcoal/40 group-hover:text-charcoal'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-premium)' }}
        >
          {item.title}
        </h3>
        <span 
          className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
          style={{ transitionTimingFunction: 'var(--ease-premium)' }}
        >
          +
        </span>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-premium)' }}
      >
        <p className="text-charcoal/70 mb-4">{item.content}</p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs uppercase tracking-wider px-3 py-1 bg-cream rounded-full"
              >
                [{tag}]
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
