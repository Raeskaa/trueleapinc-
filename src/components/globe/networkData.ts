// Network cluster data, connections, and region definitions

export interface NetworkCluster {
  id: string;
  name: string;
  lat: number;
  lng: number;
  nodes: number;
  countries: number;
  growth: string;
  region: string;
  recentActivity?: string;
}

export interface NetworkConnection {
  from: string; // cluster id
  to: string;   // cluster id
  traffic: 'high' | 'medium' | 'low';
}

export interface RegionInfo {
  id: string;
  name: string;
  description: string;
  totalNodes: number;
  totalCountries: number;
  growth: string;
  clusters: string[]; // cluster ids
}

// Main hub clusters - ~60 locations representing node concentrations
export const networkClusters: NetworkCluster[] = [
  // Sub-Saharan Africa (highest concentration)
  { id: 'nairobi', name: 'Nairobi', lat: -1.3, lng: 36.8, nodes: 245, countries: 1, growth: '+42%', region: 'africa', recentActivity: '12 nodes added today' },
  { id: 'lagos', name: 'Lagos', lat: 6.5, lng: 3.4, nodes: 312, countries: 1, growth: '+38%', region: 'africa', recentActivity: '8 nodes added today' },
  { id: 'kigali', name: 'Kigali', lat: -1.9, lng: 30.1, nodes: 189, countries: 1, growth: '+56%', region: 'africa', recentActivity: '45 nodes added this week' },
  { id: 'accra', name: 'Accra', lat: 5.6, lng: -0.2, nodes: 156, countries: 1, growth: '+31%', region: 'africa' },
  { id: 'addis', name: 'Addis Ababa', lat: 9.0, lng: 38.7, nodes: 134, countries: 1, growth: '+28%', region: 'africa' },
  { id: 'dakar', name: 'Dakar', lat: 14.7, lng: -17.5, nodes: 98, countries: 1, growth: '+24%', region: 'africa' },
  { id: 'johannesburg', name: 'Johannesburg', lat: -26.2, lng: 28.0, nodes: 87, countries: 1, growth: '+19%', region: 'africa' },
  { id: 'capetown', name: 'Cape Town', lat: -33.9, lng: 18.4, nodes: 72, countries: 1, growth: '+22%', region: 'africa' },
  { id: 'dar', name: 'Dar es Salaam', lat: -6.8, lng: 39.3, nodes: 118, countries: 1, growth: '+35%', region: 'africa' },
  { id: 'kampala', name: 'Kampala', lat: 0.3, lng: 32.6, nodes: 145, countries: 1, growth: '+41%', region: 'africa' },
  { id: 'lusaka', name: 'Lusaka', lat: -15.4, lng: 28.3, nodes: 67, countries: 1, growth: '+27%', region: 'africa' },
  { id: 'maputo', name: 'Maputo', lat: -25.9, lng: 32.6, nodes: 54, countries: 1, growth: '+33%', region: 'africa' },
  
  // Southeast Asia
  { id: 'jakarta', name: 'Jakarta', lat: -6.2, lng: 106.8, nodes: 167, countries: 1, growth: '+34%', region: 'seasia', recentActivity: '23 nodes added this week' },
  { id: 'manila', name: 'Manila', lat: 14.6, lng: 121.0, nodes: 124, countries: 1, growth: '+29%', region: 'seasia' },
  { id: 'bangkok', name: 'Bangkok', lat: 13.8, lng: 100.5, nodes: 89, countries: 1, growth: '+21%', region: 'seasia' },
  { id: 'hanoi', name: 'Hanoi', lat: 21.0, lng: 105.9, nodes: 76, countries: 1, growth: '+26%', region: 'seasia' },
  { id: 'yangon', name: 'Yangon', lat: 16.9, lng: 96.2, nodes: 45, countries: 1, growth: '+38%', region: 'seasia' },
  { id: 'phnom', name: 'Phnom Penh', lat: 11.6, lng: 104.9, nodes: 38, countries: 1, growth: '+32%', region: 'seasia' },
  
  // South Asia
  { id: 'delhi', name: 'Delhi', lat: 28.6, lng: 77.2, nodes: 198, countries: 1, growth: '+48%', region: 'sasia', recentActivity: '120 nodes deployed in Bihar' },
  { id: 'mumbai', name: 'Mumbai', lat: 19.1, lng: 72.9, nodes: 156, countries: 1, growth: '+39%', region: 'sasia' },
  { id: 'dhaka', name: 'Dhaka', lat: 23.8, lng: 90.4, nodes: 134, countries: 1, growth: '+52%', region: 'sasia' },
  { id: 'colombo', name: 'Colombo', lat: 6.9, lng: 79.9, nodes: 67, countries: 1, growth: '+31%', region: 'sasia' },
  { id: 'kathmandu', name: 'Kathmandu', lat: 27.7, lng: 85.3, nodes: 45, countries: 1, growth: '+44%', region: 'sasia' },
  
  // Latin America
  { id: 'saopaulo', name: 'São Paulo', lat: -23.5, lng: -46.6, nodes: 78, countries: 1, growth: '+22%', region: 'latam' },
  { id: 'lima', name: 'Lima', lat: -12.0, lng: -77.0, nodes: 56, countries: 1, growth: '+28%', region: 'latam' },
  { id: 'bogota', name: 'Bogotá', lat: 4.7, lng: -74.1, nodes: 45, countries: 1, growth: '+31%', region: 'latam' },
  { id: 'mexico', name: 'Mexico City', lat: 19.4, lng: -99.1, nodes: 34, countries: 1, growth: '+19%', region: 'latam' },
  { id: 'buenosaires', name: 'Buenos Aires', lat: -34.6, lng: -58.4, nodes: 28, countries: 1, growth: '+17%', region: 'latam' },
  { id: 'guatemala', name: 'Guatemala City', lat: 14.6, lng: -90.5, nodes: 23, countries: 1, growth: '+26%', region: 'latam' },
  
  // Pacific Islands
  { id: 'suva', name: 'Suva', lat: -18.1, lng: 178.4, nodes: 34, countries: 1, growth: '+24%', region: 'pacific' },
  { id: 'portmoresby', name: 'Port Moresby', lat: -9.5, lng: 147.2, nodes: 28, countries: 1, growth: '+31%', region: 'pacific' },
  { id: 'honiara', name: 'Honiara', lat: -9.4, lng: 160.0, nodes: 18, countries: 1, growth: '+28%', region: 'pacific' },
  { id: 'apia', name: 'Apia', lat: -13.8, lng: -171.8, nodes: 12, countries: 1, growth: '+19%', region: 'pacific' },
  
  // Middle East / North Africa
  { id: 'cairo', name: 'Cairo', lat: 30.0, lng: 31.2, nodes: 45, countries: 1, growth: '+18%', region: 'mena' },
  { id: 'amman', name: 'Amman', lat: 31.9, lng: 35.9, nodes: 23, countries: 1, growth: '+22%', region: 'mena' },
  
  // Central Asia
  { id: 'tashkent', name: 'Tashkent', lat: 41.3, lng: 69.3, nodes: 34, countries: 1, growth: '+29%', region: 'casia' },
  { id: 'almaty', name: 'Almaty', lat: 43.2, lng: 76.9, nodes: 28, countries: 1, growth: '+24%', region: 'casia' },
];

// Connection arcs between major hubs
export const networkConnections: NetworkConnection[] = [
  // Africa internal
  { from: 'nairobi', to: 'kigali', traffic: 'high' },
  { from: 'nairobi', to: 'kampala', traffic: 'high' },
  { from: 'nairobi', to: 'dar', traffic: 'medium' },
  { from: 'lagos', to: 'accra', traffic: 'high' },
  { from: 'lagos', to: 'dakar', traffic: 'medium' },
  { from: 'kigali', to: 'kampala', traffic: 'high' },
  { from: 'johannesburg', to: 'capetown', traffic: 'medium' },
  { from: 'johannesburg', to: 'maputo', traffic: 'low' },
  { from: 'addis', to: 'nairobi', traffic: 'medium' },
  
  // Asia internal
  { from: 'delhi', to: 'mumbai', traffic: 'high' },
  { from: 'delhi', to: 'dhaka', traffic: 'high' },
  { from: 'delhi', to: 'kathmandu', traffic: 'medium' },
  { from: 'jakarta', to: 'manila', traffic: 'medium' },
  { from: 'bangkok', to: 'hanoi', traffic: 'medium' },
  { from: 'bangkok', to: 'yangon', traffic: 'low' },
  
  // Cross-regional
  { from: 'nairobi', to: 'delhi', traffic: 'medium' },
  { from: 'nairobi', to: 'jakarta', traffic: 'low' },
  { from: 'lagos', to: 'saopaulo', traffic: 'low' },
  { from: 'cairo', to: 'nairobi', traffic: 'low' },
  { from: 'jakarta', to: 'suva', traffic: 'low' },
  { from: 'manila', to: 'portmoresby', traffic: 'low' },
];

// Region summary data
export const regions: RegionInfo[] = [
  {
    id: 'africa',
    name: 'Sub-Saharan Africa',
    description: 'Our largest deployment region, serving rural communities across 23 countries with education, healthcare, and government services.',
    totalNodes: 1420,
    totalCountries: 23,
    growth: '+34%',
    clusters: ['nairobi', 'lagos', 'kigali', 'accra', 'addis', 'dakar', 'johannesburg', 'capetown', 'dar', 'kampala', 'lusaka', 'maputo'],
  },
  {
    id: 'seasia',
    name: 'Southeast Asia',
    description: 'Island nations and rural areas across Indonesia, Philippines, Vietnam, and Myanmar.',
    totalNodes: 512,
    totalCountries: 8,
    growth: '+28%',
    clusters: ['jakarta', 'manila', 'bangkok', 'hanoi', 'yangon', 'phnom'],
  },
  {
    id: 'sasia',
    name: 'South Asia',
    description: 'Rapid expansion in India, Bangladesh, Sri Lanka, and Nepal reaching remote villages.',
    totalNodes: 298,
    totalCountries: 4,
    growth: '+45%',
    clusters: ['delhi', 'mumbai', 'dhaka', 'colombo', 'kathmandu'],
  },
  {
    id: 'latam',
    name: 'Latin America',
    description: 'Growing presence in Brazil, Peru, Colombia, Mexico, and Central America.',
    totalNodes: 187,
    totalCountries: 7,
    growth: '+22%',
    clusters: ['saopaulo', 'lima', 'bogota', 'mexico', 'buenosaires', 'guatemala'],
  },
  {
    id: 'pacific',
    name: 'Pacific Islands',
    description: 'Connecting remote island communities across Fiji, Papua New Guinea, Solomon Islands, and Samoa.',
    totalNodes: 89,
    totalCountries: 5,
    growth: '+18%',
    clusters: ['suva', 'portmoresby', 'honiara', 'apia'],
  },
  {
    id: 'mena',
    name: 'Middle East & North Africa',
    description: 'Emerging deployments in Egypt and Jordan serving refugee communities and rural areas.',
    totalNodes: 68,
    totalCountries: 2,
    growth: '+20%',
    clusters: ['cairo', 'amman'],
  },
  {
    id: 'casia',
    name: 'Central Asia',
    description: 'New deployments in Uzbekistan and Kazakhstan.',
    totalNodes: 62,
    totalCountries: 2,
    growth: '+26%',
    clusters: ['tashkent', 'almaty'],
  },
];

// Get cluster by ID
export function getClusterById(id: string): NetworkCluster | undefined {
  return networkClusters.find(c => c.id === id);
}

// Get region by ID
export function getRegionById(id: string): RegionInfo | undefined {
  return regions.find(r => r.id === id);
}

// Get clusters for a region
export function getClustersByRegion(regionId: string): NetworkCluster[] {
  return networkClusters.filter(c => c.region === regionId);
}

// Calculate color intensity based on node count (for heat map effect)
export function getHeatIntensity(nodes: number): number {
  const maxNodes = 320; // roughly max cluster size
  return Math.min(nodes / maxNodes, 1);
}

// Get color for heat intensity (indigo gradient)
export function getHeatColor(intensity: number): string {
  // From light indigo to bright indigo
  const r = Math.round(67 + (99 - 67) * (1 - intensity));
  const g = Math.round(56 + (102 - 56) * (1 - intensity));
  const b = Math.round(202 + (241 - 202) * (1 - intensity));
  return `rgb(${r}, ${g}, ${b})`;
}
