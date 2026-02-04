import { type NetworkCluster, getRegionById, getClustersByRegion } from './networkData';

interface InfoPanelProps {
  cluster: NetworkCluster | null;
  onClose: () => void;
}

export function InfoPanel({ cluster, onClose }: InfoPanelProps) {
  if (!cluster) return null;
  
  const region = getRegionById(cluster.region);
  const regionClusters = getClustersByRegion(cluster.region);
  const otherClusters = regionClusters.filter(c => c.id !== cluster.id).slice(0, 4);
  
  return (
    <div className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-auto bg-white/95 backdrop-blur-sm border border-charcoal/10 shadow-xl text-charcoal z-20 animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-charcoal/10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              <span className="text-xs text-charcoal/50 uppercase tracking-wide font-mono">Online</span>
            </div>
            <h3 className="text-xl font-medium text-charcoal">{cluster.name}</h3>
            <p className="text-sm text-charcoal/60">{region?.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-charcoal/5 transition-colors rounded"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5 text-charcoal/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="p-4 border-b border-charcoal/10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-medium text-charcoal">{cluster.nodes.toLocaleString()}</p>
            <p className="text-xs text-charcoal/50 font-mono">Active Nodes</p>
          </div>
          <div>
            <p className="text-2xl font-medium text-success">{cluster.growth}</p>
            <p className="text-xs text-charcoal/50 font-mono">Growth (YoY)</p>
          </div>
        </div>
        
        {cluster.recentActivity && (
          <div className="mt-4 p-3 bg-cream border border-charcoal/10">
            <p className="text-xs text-charcoal/50 uppercase tracking-wide mb-1 font-mono">Recent Activity</p>
            <p className="text-sm text-charcoal/80">{cluster.recentActivity}</p>
          </div>
        )}
      </div>
      
      {/* Region summary */}
      {region && (
        <div className="p-4 border-b border-charcoal/10">
          <p className="text-xs text-charcoal/50 uppercase tracking-wide mb-2 font-mono">Region Overview</p>
          <p className="text-sm text-charcoal/70 mb-3">{region.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="font-medium text-charcoal">{region.totalNodes.toLocaleString()}</span>
              <span className="text-charcoal/50 ml-1">nodes</span>
            </div>
            <div>
              <span className="font-medium text-charcoal">{region.totalCountries}</span>
              <span className="text-charcoal/50 ml-1">countries</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Other clusters in region */}
      {otherClusters.length > 0 && (
        <div className="p-4">
          <p className="text-xs text-charcoal/50 uppercase tracking-wide mb-3 font-mono">Nearby Hubs</p>
          <div className="space-y-2">
            {otherClusters.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-charcoal/5 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span className="text-sm text-charcoal/80">{c.name}</span>
                </div>
                <span className="text-xs text-charcoal/50 font-mono">{c.nodes} nodes</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="p-4 bg-cream">
        <a 
          href={`/en/impact/case-studies?region=${cluster.region}`}
          className="block w-full py-2 px-4 text-center text-sm font-medium bg-primary text-white hover:bg-primary-light rounded-lg transition-colors"
        >
          View Case Studies
        </a>
      </div>
    </div>
  );
}

// Simpler tooltip for hover state
interface TooltipProps {
  cluster: NetworkCluster;
  position: { x: number; y: number };
}

export function ClusterTooltip({ cluster, position }: TooltipProps) {
  return (
    <div 
      className="absolute pointer-events-none z-30 bg-white/95 backdrop-blur-sm border border-charcoal/10 shadow-lg text-charcoal px-3 py-2 text-sm"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)',
      }}
    >
      <p className="font-medium">{cluster.name}</p>
      <p className="text-xs text-charcoal/60 font-mono">{cluster.nodes} nodes • {cluster.growth}</p>
    </div>
  );
}
