/**
 * Esonutra — Real Astrological Calculation Module
 * Uses astronomy-engine (VSOP87-based) for accurate ephemeris calculations.
 * 
 * Functions:
 *   getZodiacInfo() — Returns sun sign from real ecliptic longitude
 *   getAscendantInfo() — Returns rising sign from actual ascendant calculation
 *   geocodeLocation() — Converts city text to lat/lng via Nominatim
 *   calculateChart() — Returns complete chart result object
 */

import { 
  MakeTime, 
  SunPosition, 
  SiderealTime, 
  e_tilt,
  GeoMoon,
  Ecliptic
} from 'astronomy-engine';

// ── Zodiac sign data ──

export const ZODIAC_SIGNS = [
  { name: 'Aries',        startAngle: 0,   gate: 'Head & Cerebral Gate',          element: 'Fire',  color: '#f87171' },
  { name: 'Taurus',       startAngle: 30,  gate: 'Throat & Vocal Gate',           element: 'Earth', color: '#fbbf24' },
  { name: 'Gemini',       startAngle: 60,  gate: 'Shoulders & Lung Gate',         element: 'Air',   color: '#34d399' },
  { name: 'Cancer',       startAngle: 90,  gate: 'Stomach & Breast Gate',         element: 'Water', color: '#60a5fa' },
  { name: 'Leo',          startAngle: 120, gate: 'Heart & Solar Gate',            element: 'Fire',  color: '#fb923c' },
  { name: 'Virgo',        startAngle: 150, gate: 'Spleen & Digestive Gate',       element: 'Earth', color: '#ca8a04' },
  { name: 'Libra',        startAngle: 180, gate: 'Kidney & Balance Gate',         element: 'Air',   color: '#f472b6' },
  { name: 'Scorpio',      startAngle: 210, gate: 'Reproductive & Regenerative Gate', element: 'Water', color: '#a855f7' },
  { name: 'Sagittarius',  startAngle: 240, gate: 'Thighs & Locomotor Gate',       element: 'Fire',  color: '#f43f5e' },
  { name: 'Capricorn',    startAngle: 270, gate: 'Bones & Structural Gate',       element: 'Earth', color: '#94a3b8' },
  { name: 'Aquarius',     startAngle: 300, gate: 'Ankles & Circulatory Gate',     element: 'Air',   color: '#818cf8' },
  { name: 'Pisces',       startAngle: 330, gate: 'Feet & Lymphatic Gate',         element: 'Water', color: '#22d3ee' }
];

export const GATE_IMBALANCES = {
  'Head & Cerebral Gate': 'Prone to systemic heat and vascular pressure. Needs cooling, anti-inflammatory bitter leaf catalysts in the Catabolic Morning, and strict avoidance of high-histamine foods before solar midday.',
  'Throat & Vocal Gate': 'Prone to lymphatic stagnation and metabolic dampness. Requires dry warmth, warm spicy broths (ginger, clove, cardamom) in the Hybrid Midday, and early evening anabolic sealing to restrict mucous formation.',
  'Shoulders & Lung Gate': 'Prone to nervous system hyper-conductivity and respiratory dryness. Demands lubricating, mucilaginous root elements, high-density mineral infusions, and rich adaptogenic fats (ghee, sesame oil) during the anabolic evening.',
  'Stomach & Breast Gate': 'Prone to enzymatic cooling, low hydrochloric acidity, and digestive stasis. Needs thermal ignition, highly cooked root stews, sour digestive catalysts (raw apple cider vinegar) in the morning, and warming furnace pastes.',
  'Heart & Solar Gate': 'Prone to arterial heat, energetic exhaustion, and high metabolic burn. Sourced with cooling chlorophylls, premium raw olive oils, light easily-assimilated proteins, and soothing mineral-dense nighttime sealing.',
  'Spleen & Digestive Gate': 'Prone to cold digestive insufficiency and chronic nutrient malabsorption. Treats this spleen gate as the core correction layer: requires dry warmth, strict cooked-only dietary rhythm (no cold raw salads), and sour/bitter catalysts to ignite digestive fire.',
  'Kidney & Balance Gate': 'Prone to electrolyte filtration fatigue and adrenal depletion. Sourced by mineralized herbal tea matrices, rich clean fats to support renal thermal warmth, and early evening anabolic protein loading.',
  'Reproductive & Regenerative Gate': 'Prone to pelvic heat congestion and fluid-element sluggishness. Needs deep anti-inflammatory roots (turmeric), bitter lymphatic clearing agents in the morning, and clean light-steamed leafy diets.',
  'Thighs & Locomotor Gate': 'Prone to hepatic heat and cellular muscle tissue breakdown. Demands amino acid rich broths, clean sulfur compounds (alliums), and cooling, mineral-dense nighttime sealing (skullcap, chamomile).',
  'Bones & Structural Gate': 'Prone to structural coldness, dry joint matrix, and slow calcium synthesis. Demands deep anabolic collagen/bone broths, warming digestive oils, and Saturnian bitter evening infusions to stimulate marrow health.',
  'Ankles & Circulatory Gate': 'Prone to peripheral vascular stagnation and nervous system static charge. Demands vasodilating warming herbs (cayenne, ginger), magnesium-dense leafy matrices, and strict non-interactive overnight gut sealing.',
  'Feet & Lymphatic Gate': 'Prone to systemic damp fluid accumulation and cellular toxic retention. Needs diuretic bitter infusions, drying grains (buckwheat, millet), thermal metabolic ignition, and early morning catabolic fasting.'
};

// ── Utility: convert ecliptic longitude (0-360) to zodiac sign index ──

function eclipticLongitudeToSignIndex(elonDeg) {
  let lon = elonDeg % 360;
  if (lon < 0) lon += 360;
  return Math.floor(lon / 30) % 12;
}

// ── Build UTC Date from local date, time, and timezone ──

function getTimezoneOffsetMinutes(dateStr, timeStr, timezone) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  
  // Create a Date in UTC
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  
  try {
    // Use Intl to get the timezone offset
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hourCycle: 'h23',
      timeZoneName: 'longOffset'
    });
    
    const parts = formatter.formatToParts(utcDate);
    const tzNamePart = parts.find(p => p.type === 'timeZoneName');
    
    if (tzNamePart && tzNamePart.value) {
      const match = tzNamePart.value.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      if (match) {
        const sign = match[1] === '+' ? 1 : -1;
        const hours = parseInt(match[2], 10);
        const mins = match[3] ? parseInt(match[3], 10) : 0;
        return sign * (hours * 60 + mins);
      }
    }
  } catch (e) {
    // Fall through
  }
  
  // Fallback: hardcoded offsets for standard time (not DST)
  const stdOffsets = {
    'Pacific/Auckland': 12 * 60,
    'America/New_York': -5 * 60,
    'America/Chicago': -6 * 60,
    'America/Denver': -7 * 60,
    'America/Los_Angeles': -8 * 60,
    'Europe/London': 0,
    'Europe/Paris': 60,
    'Asia/Tokyo': 9 * 60,
    'UTC': 0
  };
  
  return stdOffsets[timezone] !== undefined ? stdOffsets[timezone] : 0;
}

function buildUtcDate(dateStr, timeStr, timezone) {
  if (!dateStr || !timeStr) return null;
  
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  
  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) return null;
  
  const offsetMinutes = getTimezoneOffsetMinutes(dateStr, timeStr, timezone);
  const utcTimestamp = Date.UTC(year, month - 1, day, hour, minute, 0) - offsetMinutes * 60 * 1000;
  return new Date(utcTimestamp);
}

// ── Sun sign from real ecliptic longitude ──

export function getZodiacInfo(dateStr, timeStr, timezone) {
  let utcDate = null;

  if (dateStr && timeStr && timezone) {
    utcDate = buildUtcDate(dateStr, timeStr, timezone);
  }

  // Fallback: try noon UTC on the given date
  if (!utcDate || isNaN(utcDate.getTime())) {
    if (dateStr) {
      utcDate = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00Z'));
    }
  }

  if (!utcDate || isNaN(utcDate.getTime())) {
    utcDate = new Date();
  }

  try {
    const eq = SunPosition(utcDate);
    const idx = eclipticLongitudeToSignIndex(eq.elon);
    return { ...ZODIAC_SIGNS[idx], eclipticLongitude: eq.elon };
  } catch (e) {
    console.warn('SunPosition calculation failed:', e);
    return { ...ZODIAC_SIGNS[5], eclipticLongitude: 150 };
  }
}

// ── Ascendant (Rising Sign) ──

export function getAscendantInfo(dateStr, timeStr, timezone, latitude, longitude) {
  const defaultAsc = { ...ZODIAC_SIGNS[0], eclipticLongitude: 0 };
  let utcDate = null;

  if (dateStr && timeStr && timezone) {
    utcDate = buildUtcDate(dateStr, timeStr, timezone);
  }

  if (!utcDate || isNaN(utcDate.getTime())) {
    if (dateStr) {
      utcDate = new Date(dateStr + 'T12:00:00Z');
    }
  }

  if (!utcDate || isNaN(utcDate.getTime())) return defaultAsc;

  const lat = (latitude !== null && latitude !== undefined && !isNaN(latitude))
    ? latitude : -36.8485;
  const lng = (longitude !== null && longitude !== undefined && !isNaN(longitude))
    ? longitude : 174.7633;

  try {
    const astroTime = MakeTime(utcDate);
    const tilt = e_tilt(astroTime);
    const obliquity = tilt.tobl;

    const gstDeg = SiderealTime(utcDate);

    let lstDeg = gstDeg + lng;
    lstDeg = lstDeg % 360;
    if (lstDeg < 0) lstDeg += 360;

    const lstRad = lstDeg * Math.PI / 180;
    const oblRad = obliquity * Math.PI / 180;
    const latRad = lat * Math.PI / 180;

    const sinObl = Math.sin(oblRad);
    const cosObl = Math.cos(oblRad);
    const tanLat = Math.tan(latRad);
    const sinLst = Math.sin(lstRad);
    const cosLst = Math.cos(lstRad);

    const y = -cosLst;
    const x = sinObl * tanLat + cosObl * sinLst;

    let ascLonDeg = Math.atan2(y, x) * 180 / Math.PI;
    ascLonDeg = ascLonDeg % 360;
    if (ascLonDeg < 0) ascLonDeg += 360;

    const idx = eclipticLongitudeToSignIndex(ascLonDeg);
    return { ...ZODIAC_SIGNS[idx], eclipticLongitude: ascLonDeg };
  } catch (e) {
    console.warn('Ascendant calculation failed:', e);
    return defaultAsc;
  }
}

// ── Moon sign calculation ──

export function getMoonSignInfo(dateStr, timeStr, timezone) {
  const defaultResult = { ...ZODIAC_SIGNS[3], eclipticLongitude: 90 };
  let utcDate = null;

  if (dateStr && timeStr && timezone) {
    utcDate = buildUtcDate(dateStr, timeStr, timezone);
  }

  if (!utcDate || isNaN(utcDate.getTime())) {
    if (dateStr) {
      utcDate = new Date(dateStr + 'T12:00:00Z');
    }
  }

  if (!utcDate || isNaN(utcDate.getTime())) return defaultResult;

  try {
    const moonVec = GeoMoon(utcDate);
    const ecl = Ecliptic(moonVec);
    const idx = eclipticLongitudeToSignIndex(ecl.elon);
    return { ...ZODIAC_SIGNS[idx], eclipticLongitude: ecl.elon };
  } catch (e) {
    console.warn('Moon sign calculation failed:', e);
    return defaultResult;
  }
}

// ── Geocoding: convert location text to coordinates ──

export async function geocodeLocation(locationText) {
  if (!locationText || !locationText.trim()) return null;

  const query = encodeURIComponent(locationText.trim());
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Esonutra/1.0'
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name
    };
  } catch (e) {
    console.warn('Geocoding failed:', e);
    return null;
  }
}

// ── Complete chart calculation ──

export function calculateChart(formData) {
  const { birthDate, birthTime, birthTimezone, latitude, longitude } = formData;

  const sunSignInfo = getZodiacInfo(birthDate, birthTime, birthTimezone);
  const ascendantSignInfo = getAscendantInfo(
    birthDate, birthTime, birthTimezone, 
    parseFloat(latitude), parseFloat(longitude)
  );

  const bodyGate = sunSignInfo.gate;
  const elementalExcess = sunSignInfo.element;
  const correctiveAction = GATE_IMBALANCES[bodyGate] || GATE_IMBALANCES['Spleen & Digestive Gate'];

  return {
    sunSign: sunSignInfo,
    ascendantSign: ascendantSignInfo,
    bodyGate,
    elementalExcess,
    correctiveAction
  };
}

// ── Timezone options for form ──

export const TIMEZONE_OPTIONS = [
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT - UTC+12/13)' },
  { value: 'America/New_York', label: 'Eastern Time (EST/EDT - UTC-5/4)' },
  { value: 'America/Chicago', label: 'Central Time (CST/CDT - UTC-6/5)' },
  { value: 'America/Denver', label: 'Mountain Time (MST/MDT - UTC-7/6)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT - UTC-8/7)' },
  { value: 'Europe/London', label: 'London (GMT/BST - UTC+0/1)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST - UTC+1/2)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST - UTC+9)' },
  { value: 'UTC', label: 'UTC / Greenwich Mean' }
];
