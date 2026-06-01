import express from 'express';
import fetch from 'node-fetch';

const app = express();
const GOOGLE_API_KEY = 'AIzaSyBcW_IUoSLp40QgEbF48X_YWn_RhVTWvwY';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Search nearby restaurants
app.get('/api/places', async (req, res) => {
  const { lat, lng, radius, cuisine } = req.query;
  let url;
  if (cuisine && cuisine !== 'Any') {
    const searchQuery = cuisine.toLowerCase() === "fish & chips" ? "fish and chip shop" : cuisine + " restaurant";
    url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&location=${lat},${lng}&radius=${radius || 5000}&key=${GOOGLE_API_KEY}`;
  } else {
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius || 2000}&type=restaurant&key=${GOOGLE_API_KEY}`;
  }
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Get place details (website, phone, hours)
app.get('/api/place-details', async (req, res) => {
  const { place_id } = req.query;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,website,formatted_phone_number,opening_hours,price_level,rating,user_ratings_total&key=${GOOGLE_API_KEY}`;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('Google Places proxy running on http://localhost:3001'));
