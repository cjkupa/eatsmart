import express from 'express';
import fetch from 'node-fetch';

const app = express();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://eatsmart.co.nz,http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

if (!GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY environment variable');
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.includes('eatsmart.co.nz') || origin.includes('localhost')) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const cuisineMap = {
  'fish & chips': 'fish chips',
  cafe: 'cafe',
  bakery: 'bakery',
  'pub food': 'pub bar',
  burgers: 'burger',
  pizza: 'pizza',
  takeaway: 'takeaway',
  italian: 'italian pasta',
  japanese: 'japanese sushi',
  sushi: 'sushi',
  chinese: 'chinese',
  indian: 'indian curry',
  thai: 'thai',
  mexican: 'mexican',
  korean: 'korean',
  mediterranean: 'mediterranean',
  american: 'american steak',
  french: 'french',
  vietnamese: 'vietnamese',
  seafood: 'seafood fish',
  vegetarian: 'vegetarian vegan',
  turkish: 'turkish kebab',
  greek: 'greek'
};

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

app.get('/api/places', async (req, res) => {
  const { lat, lng, radius, cuisine } = req.query;
  if (!lat || !lng) return sendError(res, 400, 'Missing lat or lng');

  const keyword = cuisine && cuisine !== 'Any'
    ? '&keyword=' + encodeURIComponent(cuisineMap[String(cuisine).toLowerCase()] || cuisine)
    : '';
  const safeRadius = Math.min(Number(radius) || 2000, 10000);
  const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
    encodeURIComponent(lat + ',' + lng) +
    '&radius=' + safeRadius +
    '&type=restaurant' +
    keyword +
    '&key=' + GOOGLE_API_KEY;

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    sendError(res, 500, e.message);
  }
});

app.get('/api/place-details', async (req, res) => {
  const { place_id } = req.query;
  if (!place_id) return sendError(res, 400, 'Missing place_id');

  const url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' +
    encodeURIComponent(place_id) +
    '&fields=name,website,formatted_phone_number,opening_hours,price_level,rating,user_ratings_total,photos' +
    '&key=' + GOOGLE_API_KEY;

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    sendError(res, 500, e.message);
  }
});

app.get('/api/photo', async (req, res) => {
  const { ref } = req.query;
  if (!ref) return sendError(res, 400, 'Missing photo ref');

  const url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' +
    encodeURIComponent(ref) +
    '&key=' + GOOGLE_API_KEY;

  try {
    const r = await fetch(url);
    const arrayBuffer = await r.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.set('Content-Type', r.headers.get('content-type') || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (e) {
    sendError(res, 500, e.message);
  }
});

app.get('/api/geocode', async (req, res) => {
  const { q, place_id } = req.query;
  if (!q && !place_id) return sendError(res, 400, 'Missing query or place_id');

  const url = place_id
    ? 'https://maps.googleapis.com/maps/api/geocode/json?place_id=' +
      encodeURIComponent(place_id) +
      '&key=' + GOOGLE_API_KEY
    : 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      encodeURIComponent(q + ', New Zealand') +
      '&key=' + GOOGLE_API_KEY +
      '&components=country:NZ';

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    sendError(res, 500, e.message);
  }
});

app.get('/api/autocomplete', async (req, res) => {
  const { q, lat, lng } = req.query;
  if (!q) return sendError(res, 400, 'Missing query');

  const location = lat && lng ? `&location=${encodeURIComponent(`${lat},${lng}`)}&radius=50000` : '';
  const base = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
    encodeURIComponent(q) + '&components=country:nz' + location + '&key=' + GOOGLE_API_KEY;

  try {
    // Two calls: establishments (KFC, cafes) + addresses (suburbs, streets), then merge.
    const [estRes, geoRes] = await Promise.all([
      fetch(base + '&types=establishment').then(r => r.json()).catch(() => ({ predictions: [] })),
      fetch(base + '&types=geocode').then(r => r.json()).catch(() => ({ predictions: [] })),
    ]);
    const est = estRes.predictions || [];
    const geo = geoRes.predictions || [];
    // Interleave: addresses first (suburbs are the common case), then businesses, dedup by place_id.
    const seen = new Set();
    const merged = [];
    [...geo, ...est].forEach(p => {
      if (p.place_id && !seen.has(p.place_id)) { seen.add(p.place_id); merged.push(p); }
    });
    res.json({ predictions: merged, status: merged.length ? 'OK' : 'ZERO_RESULTS' });
  } catch (e) {
    sendError(res, 500, e.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));
