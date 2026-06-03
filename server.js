import express from 'express';
import fetch from 'node-fetch';
const app = express();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyBcW_IUoSLp40QgEbF48X_YWn_RhVTWvwY';
app.use((req, res, next) => { res.header('Access-Control-Allow-Origin', '*'); next(); });
const cuisineMap = {'fish & chips':'fish chips','cafe':'cafe','bakery':'bakery','pub food':'pub bar','burgers':'burger','pizza':'pizza','takeaway':'takeaway','italian':'italian pasta','japanese':'japanese sushi','sushi':'sushi','chinese':'chinese','indian':'indian curry','thai':'thai','mexican':'mexican','korean':'korean','mediterranean':'mediterranean','american':'american steak','french':'french','vietnamese':'vietnamese','seafood':'seafood fish','vegetarian':'vegetarian vegan','turkish':'turkish kebab','greek':'greek'};
app.get('/api/places', async (req, res) => { const { lat, lng, radius, cuisine } = req.query; const kw = cuisine && cuisine !== 'Any' ? '&keyword=' + encodeURIComponent(cuisineMap[cuisine.toLowerCase()] || cuisine) : ''; const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=' + (radius || 2000) + '&type=restaurant' + kw + '&key=' + GOOGLE_API_KEY; try { const r = await fetch(url); const data = await r.json(); res.json(data); } catch(e) { res.status(500).json({ error: e.message }); } });
app.get('/api/place-details', async (req, res) => { const { place_id } = req.query; const url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&fields=name,website,formatted_phone_number,opening_hours,price_level,rating,user_ratings_total,photos&key=' + GOOGLE_API_KEY; try { const r = await fetch(url); const data = await r.json(); res.json(data); } catch(e) { res.status(500).json({ error: e.message }); } });
app.get('/api/photo', async (req, res) => {
  const { ref } = req.query;
  const url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + ref + '&key=' + GOOGLE_API_KEY;
  try {
    const r = await fetch(url);
    const buffer = await r.buffer();
    res.set('Content-Type', r.headers.get('content-type'));
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/geocode', async (req, res) => {
  const { q } = req.query;
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(q + ', New Zealand') + '&key=' + GOOGLE_API_KEY + '&components=country:NZ';
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/autocomplete', async (req, res) => {
  const { q, lat, lng } = req.query;
  const location = lat && lng ? `&location=${lat},${lng}&radius=50000` : '';
  const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + encodeURIComponent(q) + '&components=country:nz&types=geocode' + location + '&key=' + GOOGLE_API_KEY;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001; app.listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));