// Pre-computed dot positions for world continents
// Each dot is [lat, lng] - approximately 8000 dots for decent resolution

// Helper to check if a point is on land (simplified continent boundaries)
function isLand(lat: number, lng: number): boolean {
  // Africa
  if (lat >= -35 && lat <= 37 && lng >= -18 && lng <= 52) {
    // Rough Africa shape
    if (lat > 20 && lng < -5) return false; // Cut out Atlantic
    if (lat < -20 && lng > 40) return false; // Cut out Indian Ocean
    return true;
  }
  
  // Europe
  if (lat >= 36 && lat <= 71 && lng >= -10 && lng <= 60) {
    if (lat < 42 && lng > 30) return false; // Mediterranean/Black Sea area
    return true;
  }
  
  // Asia (main)
  if (lat >= 5 && lat <= 77 && lng >= 60 && lng <= 180) {
    if (lat < 20 && lng < 95) return false; // Indian Ocean
    return true;
  }
  
  // Southeast Asia / Indonesia
  if (lat >= -11 && lat <= 20 && lng >= 95 && lng <= 140) {
    return true;
  }
  
  // Australia
  if (lat >= -45 && lat <= -10 && lng >= 112 && lng <= 154) {
    return true;
  }
  
  // North America
  if (lat >= 15 && lat <= 72 && lng >= -170 && lng <= -50) {
    if (lat < 25 && lng > -100) return false; // Gulf of Mexico
    return true;
  }
  
  // Central America
  if (lat >= 7 && lat <= 23 && lng >= -92 && lng <= -77) {
    return true;
  }
  
  // South America
  if (lat >= -56 && lat <= 13 && lng >= -82 && lng <= -34) {
    if (lat > 5 && lng < -70) return false; // Pacific
    return true;
  }
  
  // Greenland
  if (lat >= 59 && lat <= 84 && lng >= -74 && lng <= -10) {
    return true;
  }
  
  // Japan
  if (lat >= 30 && lat <= 46 && lng >= 129 && lng <= 146) {
    return true;
  }
  
  // New Zealand
  if (lat >= -47 && lat <= -34 && lng >= 166 && lng <= 179) {
    return true;
  }
  
  // UK/Ireland
  if (lat >= 50 && lat <= 59 && lng >= -11 && lng <= 2) {
    return true;
  }
  
  // Madagascar
  if (lat >= -26 && lat <= -12 && lng >= 43 && lng <= 51) {
    return true;
  }
  
  // Philippines
  if (lat >= 5 && lat <= 20 && lng >= 117 && lng <= 127) {
    return true;
  }
  
  return false;
}

// Generate dots with slight randomization for organic feel
export function generateWorldDots(density: number = 2.5): [number, number][] {
  const dots: [number, number][] = [];
  
  for (let lat = -60; lat <= 75; lat += density) {
    // Adjust longitude step based on latitude (less dots near poles)
    const lngStep = density / Math.cos((lat * Math.PI) / 180);
    
    for (let lng = -180; lng <= 180; lng += Math.max(lngStep, density)) {
      if (isLand(lat, lng)) {
        // Add slight randomization for organic look
        const jitterLat = lat + (Math.random() - 0.5) * density * 0.5;
        const jitterLng = lng + (Math.random() - 0.5) * density * 0.5;
        dots.push([jitterLat, jitterLng]);
      }
    }
  }
  
  return dots;
}

// Pre-generated dots at standard density (call once, cache result)
let cachedDots: [number, number][] | null = null;

export function getWorldDots(): [number, number][] {
  if (!cachedDots) {
    cachedDots = generateWorldDots(2.8); // ~6000-8000 dots
  }
  return cachedDots;
}

// Convert lat/lng to 3D position on sphere
export function latLngToVector3(
  lat: number, 
  lng: number, 
  radius: number
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return [x, y, z];
}

// Get arc points for curved connection between two points
export function getArcPoints(
  start: [number, number],
  end: [number, number],
  radius: number,
  segments: number = 50
): [number, number, number][] {
  const points: [number, number, number][] = [];
  
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    
    // Interpolate lat/lng
    const lat = lat1 + (lat2 - lat1) * t;
    const lng = lng1 + (lng2 - lng1) * t;
    
    // Calculate arc height (higher in the middle)
    const arcHeight = Math.sin(t * Math.PI) * 0.3;
    
    const point = latLngToVector3(lat, lng, radius + arcHeight);
    points.push(point);
  }
  
  return points;
}
