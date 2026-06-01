import express from 'express';
import fetch from 'node-fetch';
const app = express();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyBcW_IUoSLp40QgEbF48X_YWn_RhVTWvwY';
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
const cuisineMap = {
  'fish & chips': 'fish chips',
  'cafe': 'cafe coffee',
  'bakery': 'bakery',
  'pub food': 'pub bar',
  'burgers': 'burger',
  'pizza': 'pizza',
  'takeaway': 'takeaway',
  'italian': 'italian pasta',
  'japanese': 'japanese sushi ramen',
  'sushi': 'sushi',
  'chinese': 'chinese',
  'indian': 'indian curry',
  'thai': 'thai',
  'mexican': 'mexican',
  'korean': 'korean',
  'mediterranean': 'mediterranean greek',
  'american': 'american burger steak',
  'french': 'french',
  'vietnamese': 'vietnamese pho',
  'seafood': 'seafood fish',
  'vegetarian': 'vegetarian vegan',
  'turkish': 'turkish kebab',
  'greek': 'greek',
};
app.get('/api/places', async (req, res) => {
  const { lat, lng, radius, cuisine } = req.query;
  const keyword = cuisine && cuisine !== 'Any' ? cuisineMap[cuisine.toLowerCase()] || cuisine : '';
  const kw = keyword ? '&keyword=' + encodeURIComponent(keyword) : '';
  const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=' + (radius || 2000) + '&type=restaurant' + kw + '&key=' + GOOGLE_API_KEY;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
app.get('/api/place-details', async (req, res) => {
  const { place_id } = req.query;
  const url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&fields=name,website,formatted_phone_number,opening_hours,price_level,rating,user_ratings_total&key=' + GOOGLE_API_KEY;
  try {
    const r = await fetch(url);
    const d
cat > /tmp/server_new.js << 'SERVEREOF'
import express from 'express';
import fetch from 'node-fetch';
const app = express();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyBcW_IUoSLp40QgEbF48X_YWn_RhVTWvwY';
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
const cuisineMap = {
  'fish & chips': 'fish chips',
  'cafe': 'cafe coffee',
  'bakery': 'bakery',
  'pub food': 'pub bar',
  'burgers': 'burger',
  'pizza': 'pizza',
  'takeaway': 'takeaway',
  'italian': 'italian pasta',
  'japanese': 'japanese sushi ramen',
  'sushi': 'sushi',
  'chinese': 'chinese',
  'indian': 'indian curry',
  'thai': 'thai',
  'mexican': 'mexican',
  'korean': 'korean',
  'mediterranean': 'mediterranean greek',
  'american': 'american burger steak',
  'french': 'french',
  'vietnamese': 'vietnamese pho',
  'seafood': 'seafood fish',
  'vegetarian': 'vegetarian vegan',
  'turkish': 'turkish kebab',
  'greek': 'greek',
};
app.get('/api/places', async (req, res) => {
  const { lat, lng, radius, cuisine } = req.query;
  const keyword = cuisine && cuisine !== 'Any' ? cuisineMap[cuisine.toLowerCase()] || cuisine : '';
  const kw = keyword ? '&keyword=' + encodeURIComponent(keyword) : '';
  const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=' + (radius || 2000) + '&type=restaurant' + kw + '&key=' + GOOGLE_API_KEY;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
app.get('/api/place-details', async (req, res) => {
  const { place_id } = req.query;
  const url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&fields=name,website,formatted_phone_number,opening_hours,price_level,rating,user_ratings_total&key=' + GOOGLE_API_KEY;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log('Google Places proxy running on port ' + PORT));
