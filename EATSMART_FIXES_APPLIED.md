# EatSmart production fixes applied

Updated fixes in this package:

1. Added Google place_id geocoding support in `server.js`.
2. Fixed partial street search so autocomplete suggestions can resolve by place_id.
3. Fixed duplicated city text in geocode calls, for example stopping `victori hamilton Hamilton` style requests.
4. Hid filters by default so the search box is the main entry point.
5. Added Tablelog-style filter behaviour: filters open when the search field is selected.
6. Added selected filter chips directly under the search field.
7. Added city, cuisine, result count, budget, and open-now filter chips into the search panel.
8. Added open-now filtering.
9. Fixed nearest sorting by carrying lat/lng through restaurant formatting.
10. Kept the previous security fixes: no hardcoded Google key, `.env` ignored, `/api/photo` compatible with node-fetch v3.

After copying this over your repo, run:

```bash
npm install
npm run build
git add .
git commit -m "Improve EatSmart production search and filters"
git push origin main
```

Railway still needs these service variables:

```env
GOOGLE_API_KEY=your_real_rotated_google_key
ALLOWED_ORIGINS=https://eatsmart.co.nz,http://localhost:5173
```
