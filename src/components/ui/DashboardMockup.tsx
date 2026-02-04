import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface DashboardMockupProps {
  className?: string;
}

export function DashboardMockup({ className = '' }: DashboardMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      hasAnimated.current = true;
      return;
    }

    const container = containerRef.current;
    
    // Initial state
    gsap.set(container, { opacity: 0, y: 40, scale: 0.95 });
    
    // Main entrance
    gsap.to(container, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      delay: 0.4,
      ease: 'expo.out',
    });

    // Animate internal elements
    const cards = container.querySelectorAll('.mock-card');
    const chartBars = container.querySelectorAll('.chart-bar');
    const dataPoints = container.querySelectorAll('.data-point');
    const pulsingDots = container.querySelectorAll('.pulse-dot');

    gsap.fromTo(cards, 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.8, ease: 'power2.out' }
    );

    gsap.fromTo(chartBars,
      { scaleY: 0, transformOrigin: 'bottom' },
      { scaleY: 1, duration: 0.8, stagger: 0.05, delay: 1.2, ease: 'power3.out' }
    );

    gsap.fromTo(dataPoints,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, delay: 1.5, ease: 'back.out(2)' }
    );

    // Continuous subtle pulse on status dots
    gsap.to(pulsingDots, {
      scale: 1.2,
      opacity: 0.6,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.3,
    });

    hasAnimated.current = true;
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
    >
      {/* Browser chrome */}
      <div className="bg-charcoal rounded-t-xl p-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white/10 rounded-md h-5 max-w-md mx-auto flex items-center px-3">
            <svg className="w-3 h-3 text-white/30 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-white/40 text-xs">app.trueleap.io/dashboard</span>
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="bg-paper border border-border border-t-0 rounded-b-xl overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-14 md:w-48 bg-white border-r border-border p-3 md:p-4 hidden sm:block">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">TL</span>
              </div>
              <span className="text-sm font-medium hidden md:block">TrueLeap</span>
            </div>
            <nav className="space-y-1">
              {['Overview', 'Network', 'Devices', 'Analytics', 'Settings'].map((item, i) => (
                <div 
                  key={item}
                  className={`px-2 py-1.5 rounded-lg text-xs ${i === 0 ? 'bg-primary-lighter text-primary font-medium' : 'text-muted'}`}
                >
                  <span className="hidden md:inline">{item}</span>
                  <span className="md:hidden w-4 h-4 block bg-current opacity-20 rounded"></span>
                </div>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 md:p-6 min-h-[300px] md:min-h-[400px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-medium text-ink">Network Overview</h3>
                <p className="text-xs text-muted">Real-time infrastructure status</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="pulse-dot w-2 h-2 bg-success rounded-full"></span>
                <span className="text-xs text-muted">All systems operational</span>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Active Nodes', value: '2,847', change: '+12%' },
                { label: 'Connected Users', value: '847K', change: '+8.3%' },
                { label: 'Data Synced', value: '2.4 TB', change: '+24%' },
                { label: 'Uptime', value: '99.97%', change: '' },
              ].map((stat, i) => (
                <div key={stat.label} className="mock-card bg-white p-3 rounded border border-border">
                  <p className="text-[10px] text-muted uppercase tracking-wide">{stat.label}</p>
                  <p className="text-lg md:text-xl font-medium text-ink mt-1">{stat.value}</p>
                  {stat.change && (
                    <p className="text-[10px] text-success">{stat.change}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Chart and map area */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Chart */}
              <div className="mock-card bg-white p-4 rounded border border-border">
                <p className="text-xs font-medium text-ink mb-4">Weekly Activity</p>
                <div className="flex items-end justify-between h-24 gap-2">
                  {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                    <div 
                      key={i} 
                      className="chart-bar flex-1 bg-primary/20 rounded-t"
                      style={{ height: `${height}%` }}
                    >
                      <div 
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${Math.random() * 30 + 60}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-muted">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Mini map */}
              <div className="mock-card bg-white p-4 rounded border border-border">
                <p className="text-xs font-medium text-ink mb-4">Active Regions</p>
                <div className="relative h-24 bg-paper rounded overflow-hidden">
                  {/* Simplified world map dots */}
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    {/* Africa */}
                    <circle cx="110" cy="55" r="3" className="data-point fill-primary"/>
                    <circle cx="105" cy="48" r="2" className="data-point fill-primary/60"/>
                    <circle cx="115" cy="60" r="2.5" className="data-point fill-primary"/>
                    
                    {/* Asia */}
                    <circle cx="145" cy="42" r="4" className="data-point fill-primary"/>
                    <circle cx="155" cy="50" r="2.5" className="data-point fill-primary/70"/>
                    <circle cx="165" cy="55" r="3" className="data-point fill-primary"/>
                    
                    {/* South America */}
                    <circle cx="65" cy="65" r="2.5" className="data-point fill-primary/70"/>
                    <circle cx="60" cy="55" r="2" className="data-point fill-primary/50"/>
                    
                    {/* Pacific */}
                    <circle cx="180" cy="65" r="2" className="data-point fill-primary/60"/>
                    
                    {/* Pulsing rings */}
                    <circle cx="145" cy="42" r="6" className="pulse-dot fill-none stroke-primary/30" strokeWidth="1"/>
                    <circle cx="110" cy="55" r="5" className="pulse-dot fill-none stroke-primary/30" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <div className="mock-card absolute -right-2 md:right-4 top-24 bg-white p-3 rounded-lg border border-border shadow-lg max-w-[180px] hidden md:block">
        <div className="flex items-start gap-2">
          <span className="pulse-dot w-2 h-2 bg-success rounded-full mt-1 flex-shrink-0"></span>
          <div>
            <p className="text-[10px] font-medium text-ink">New node online</p>
            <p className="text-[9px] text-muted">Rwanda · Kigali Region</p>
          </div>
        </div>
      </div>
    </div>
  );
}
