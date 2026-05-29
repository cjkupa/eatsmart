import { useEffect } from "react";
import { useState, useCallback, useRef } from "react";
import { getMealSuggestion } from "./mealData.js";




const NZ_CITIES = {
  "Auckland": ["Albany","Avondale","Balmoral","Beachlands","Birkenhead","Blockhouse Bay","Botany Downs","Browns Bay","Clevedon","Devonport","East Tamaki","Eden Terrace","Ellerslie","Epsom","Flat Bush","Forrest Hill","Freemans Bay","Glen Eden","Glen Innes","Glendowie","Glenfield","Grey Lynn","Half Moon Bay","Henderson","Herne Bay","Hillsborough","Howick","Kingsland","Kohimarama","Lynfield","Manukau","Manurewa","Massey","Mission Bay","Morningside","Mount Albert","Mount Eden","Mount Roskill","Mount Wellington","Newmarket","Newton","New Lynn","Northcote","Onehunga","Orewa","Pakuranga","Panmure","Papakura","Parnell","Papatoetoe","Penrose","Point Chevalier","Ponsonby","Pukekohe","Remuera","Royal Oak","Sandringham","Silverdale","St Heliers","St Johns","St Lukes","Takapuna","Titirangi","Wairau Valley","Warkworth","Waterview","Wellsford","Westmere","Whangaparaoa"],
  "Wellington": ["Aro Valley","Berhampore","Brooklyn","Churton Park","Crofton Downs","Glenside","Hataitai","Highbury","Houghton Bay","Island Bay","Johnsonville","Karori","Kelburn","Kilbirnie","Khandallah","Lambton","Lyall Bay","Miramar","Mornington","Mount Cook","Mount Victoria","Newlands","Newtown","Ngaio","Northland","Oriental Bay","Owhiro Bay","Petone","Porirua","Roseneath","Seatoun","Strathmore Park","Tawa","Te Aro","Thorndon","Upper Hutt","Wadestown","Waterloo","Wilton","Woodridge"],
  "Christchurch": ["Addington","Aranui","Avonhead","Beckenham","Belfast","Bishopdale","Bryndwr","Burnside","Cashmere","Cathedral Square","Christchurch Central","Edgeware","Ferrymead","Fendalton","Halswell","Harewood","Heathcote","Hillmorton","Hornby","Ilam","Islington","Linwood","Lyttelton","Merivale","New Brighton","Northcote","Papanui","Parklands","Phillipstown","Prebbleton","Redcliffs","Riccarton","Rolleston","Russley","Shirley","Sockburn","Spreydon","St Albans","St Martins","Sumner","Sydenham","Templeton","Upper Riccarton","Waltham","Woolston"],
  "Hamilton": ["Beerescourt","Chartwell","Claudelands","Dinsdale","Fairfield","Flagstaff","Frankton","Hamilton Central","Hamilton East","Hamilton Lake","Hillcrest","Huntington","Melville","Nawton","Peacocke","Rototuna","Saint Andrews","Silverdale","Southgate","Temple View","Te Rapa","Whitiora"],
  "Tauranga": ["Arataki","Bethlehem","Brookfield","Gate Pa","Greerton","Hairini","Judea","Katikati","Maungatapu","Mount Maunganui","Ohauiti","Otumoetai","Papamoa","Pyes Pa","Tauranga Central","Te Puke","Welcome Bay"],
  "Dunedin": ["Andersons Bay","Brockville","Caversham","Corstorphine","Dunedin Central","East Taieri","Forbury","Green Island","Halfway Bush","Kaikorai","Liberton","Maori Hill","Mornington","Mosgiel","Musselburgh","North East Valley","Otago Peninsula","Pine Hill","Port Chalmers","Ravensbourne","Roslyn","Saint Clair","Saint Kilda","Shiel Hill","South Dunedin","Tainui","Wakari"],
  "Napier": ["Ahuriri","Bay View","Bluff Hill","Greenmeadows","Hospital Hill","Maraenui","Marewa","Meeanee","Napier Central","Napier Hill","Onekawa","Pirimai","Taradale","Tamatea","Te Awa"],
  "Hastings": ["Akina","Camberley","Clive","Flaxmere","Frimley","Hastings Central","Havelock North","Irongate","Karamu","Mahora","Mangateretere","Mayfair","Omahu","Parklands","Raureka","Southampton","Te Awanga","Tomoana","Whakatu","Windsor Park"],
  "New Plymouth": ["Bell Block","Blagdon","Brooklands","Fernbrook","Fitzroy","Frankleigh Park","Glen Avon","Highlands Park","Hurdon","Marfell","Merrilands","Moturoa","New Plymouth Central","Oakura","Okato","Spotswood","St Leonards","Vogeltown","Waitara","Westown"],
  "Palmerston North": ["Aokautere","Awapuni","Bunnythorpe","Cloverlea","Hokowhitu","Kelvin Grove","Longburn","Milson","Palmerston North Central","Roslyn","Takaro","Terrace End","West End"],
  "Nelson": ["Atawhai","Bishopdale","Brook","Enner Glynn","Motueka","Nayland","Nelson Central","Richmond","Stoke","Tahunanui","The Wood","Toi Toi","Washington Valley"],
  "Rotorua": ["Fairy Springs","Fenton Park","Glenholme","Hannahs Bay","Holdens Bay","Koutu","Lynmore","Ngapuna","Ohinemutu","Rotorua Central","Springfield","Sunnyvale","Utuhina","Victoria"],
  "Invercargill": ["Appleby","Avenal","Bluff","Georgetown","Gladstone","Grasmere","Hawthorndale","Invercargill Central","Kew","Newfield","North Invercargill","Otatara","Richmond","Strathern","Waikiwi","Windsor"],
  "Whanganui": ["Aramoho","Castlecliff","Gonville","Kai Iwi","Marybank","Putiki","Springvale","St Johns Hill","Whanganui Central","Whanganui East"],
  "Gisborne": ["Elgin","Gisborne Central","Kaiti","Lytton","Mangapapa","Outer Kaiti","Riverdale","Tamarau","Whataupoko"],
  "Whangarei": ["Abbey Caves","Avenues","Flanshaw","Glenbervie","Kamo","Maunu","Morningside","Onerahi","Otangarei","Tikipunga","Whangarei Central","Whangarei Heads","Woodhill"],
};

const CUISINES = ["Any","Fish & Chips","NZ Modern","Cafe","Bakery","Pub Food","Burgers","Pizza","Takeaway","Italian","Japanese","Sushi","Chinese","Indian","Thai","Mexican","Korean","Mediterranean","American","French","Vietnamese","Middle Eastern","Seafood","Vegetarian","Turkish","Greek"];
const CUISINE_EMOJI = {"italian":"🍝","japanese":"🍣","chinese":"🥢","indian":"🍛","thai":"🌶️","mexican":"🌮","korean":"🍱","mediterranean":"🥗","american":"🍔","french":"🥐","vietnamese":"🍜","seafood":"🐟","vegetarian":"🥦","cafe":"☕","pizza":"🍕","burger":"🍔","default":"🍽️"};

function getCuisineEmoji(cuisine) {
  if (!cuisine) return CUISINE_EMOJI.default;
  const key = cuisine.toLowerCase();
  for (const [k, v] of Object.entries(CUISINE_EMOJI)) { if (key.includes(k)) return v; }
  return CUISINE_EMOJI.default;
}

async function geocodeSuburb(suburb, city) {
  const queries = [suburb + ", " + city + ", New Zealand", suburb + ", New Zealand", city + ", New Zealand"];
  for (const q of queries) {
    const url = "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(q) + "&format=json&limit=3&countrycodes=nz&addressdetails=1";
    try {
      const res = await fetch(url, { headers: { "Accept-Language": "en", "User-Agent": "EatSmartNZ/1.0" } });
      const data = await res.json();
      if (data && data.length > 0) {
        const best = data.find(d => d.display_name.toLowerCase().includes(city.toLowerCase())) || data[0];
        return { lat: parseFloat(best.lat), lon: parseFloat(best.lon) };
      }
    } catch (e) {}
  }
  return null;
}

async function searchRestaurants(lat, lon, radiusMeters) {
  const url = `https://eatsmart-production-7bcf.up.railway.app/api/places?lat=${lat}&lng=${lon}&radius=${radiusMeters}`;
  const res = await fetch(url);
  const data = await res.json();
  const places = data.results || [];
  // Fetch details for each place to get website/phone
  const detailed = await Promise.all(places.map(async (place) => {
    try {
      const dr = await fetch(`https://eatsmart-production-7bcf.up.railway.app/api/place-details?place_id=${place.place_id}`);
      const dd = await dr.json();
      const d = dd.result || {};
      return { ...place, website: d.website || null, formatted_phone_number: d.formatted_phone_number || null, opening_hours: d.opening_hours || null };
    } catch(e) { return place; }
  }));
  return detailed;
}

function formatRestaurant(place, index) {
  const name = place.name || "Unnamed Restaurant";
  const types = place.types || [];
  const cuisine = types.length > 0 ? types[0].replace(/_/g, " ") : "restaurant";
  const addr = place.vicinity || null;
  const website = place.website || null;
  const phone = place.formatted_phone_number || null;
  const rating = place.rating ? `⭐ ${place.rating}` : null;
  const isOpen = place.opening_hours ? (place.opening_hours.open_now ? "✅ Open now" : "❌ Closed") : null;
  const tagsList = [rating, isOpen].filter(Boolean);
  return { id: place.place_id || index, name, emoji: getCuisineEmoji(cuisine), cuisine, amenity: "", address: addr || null, phone, website, tags: tagsList, isOpen };
}

export default function EatSmart() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const cities = Object.keys(NZ_CITIES);
  const [budget, setBudget] = useState(30);
  const [city, setCity] = useState("Napier");
  const [suburb, setSuburb] = useState("Ahuriri");
  const [cuisine, setCuisine] = useState("Any");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [saved, setSaved] = useState({});
  const [locating, setLocating] = useState(false);
  const [typeMode, setTypeMode] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [typeInput, setTypeInput] = useState("");
  const [searchRadius, setSearchRadius] = useState(800);

  function handleCityChange(newCity) { setCity(newCity); setSuburb(NZ_CITIES[newCity][0]); setSearched(false); setResults([]); setError(null); }

  function handleLocate() {
    setLocating(true);
    if (!navigator.geolocation) { alert("Location not supported on this device."); setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch("https://nominatim.openstreetmap.org/reverse?lat=" + pos.coords.latitude + "&lon=" + pos.coords.longitude + "&format=json&countrycodes=nz&addressdetails=1");
        const data = await res.json();
        const addr = data.address || {};
        const detectedCity = addr.city || addr.town || addr.village || addr.county || "";
        const matchedCity = cities.find(c => c.toLowerCase() === detectedCity.toLowerCase()) || null;
        if (matchedCity) {
          const detectedSuburb = addr.suburb || addr.neighbourhood || addr.hamlet || addr.village || "";
          const matchedSuburb = NZ_CITIES[matchedCity].find(s => s.toLowerCase() === detectedSuburb.toLowerCase()) || NZ_CITIES[matchedCity][0];
          setCity(matchedCity);
          setSuburb(matchedSuburb);
          setSearched(false);
          setResults([]);
        } else {
          alert("Could not detect your NZ city. Please select manually.");
        }
      } catch(e) { alert("Location lookup failed. Please select manually."); }
      setLocating(false);
    }, (err) => { alert("Location access denied. Please allow location access and try again."); setLocating(false); });
  }

  const handleSearch = useCallback(async () => {
    setLoading(true); setError(null); setSearched(true); setResults([]);
    try {
      const coords = await geocodeSuburb(suburb, city);
      if (!coords) { setError("Couldn't find " + suburb + ", " + city + ". Try a nearby suburb."); setLoading(false); return; }
      const radii = [800, 1500, 2500];
      let spots = []; let usedRadius = 800;
      for (const r of radii) {
        const elements = await searchRestaurants(coords.lat, coords.lon, r);
        spots = elements.map((el, i) => formatRestaurant(el, i));
        if (spots.length > 0) { usedRadius = r; break; }
      }
      setSearchRadius(usedRadius);
      setResults(spots.slice(0, 20));
    } catch(e) { setError("Something went wrong. Is the backend server running on port 3001?"); }
    setLoading(false);
  }, [suburb, city, cuisine]);

  function toggleSave(id) { setSaved(prev => ({ ...prev, [id]: !prev[id] })); }
  const suburbs = NZ_CITIES[city] || [];

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div style={S.logo}><span style={S.logoEat}>Eat</span><span style={S.logoSmart}>Smart</span><span style={S.logoIcon}>🍽️</span></div>
        <p style={S.tagline}>Find great food near you — on any budget</p>
        <div style={S.wave} />
      </header>
      <div style={S.card}>
        <div style={S.row}>
          <button style={{...S.locateBtn, opacity: locating ? 0.7 : 1}} onClick={handleLocate}>
            <span>📍</span><span style={{color:"#c0392b",fontWeight:600}}>{locating ? "Locating…" : "Use my location"}</span>
          </button>
          <button style={{...S.typeBtn, background: typeMode ? "#fef2f2" : "#fff", color: typeMode ? "#c0392b" : "#999", borderColor: typeMode ? "#c0392b" : "#e0e0e0"}} onClick={() => setTypeMode(t => !t)}>✏️ Type it</button>
        </div>
        {typeMode && (
          <div style={{display:"flex",gap:8}}>
            <input
              style={{flex:1,border:"1.5px solid #c0392b",borderRadius:12,padding:"13px 14px",fontSize:15,fontFamily:"inherit",outline:"none"}}
              placeholder="e.g. Taradale, Napier or just a suburb..."
              value={typeInput}
              onChange={e => setTypeInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && typeInput.trim()) {
                  const parts = typeInput.split(",").map(p => p.trim());
                  const typedSuburb = parts[0];
                  const typedCity = parts[1] || "";
                  const matchedCity = cities.find(c => c.toLowerCase() === typedCity.toLowerCase()) || cities.find(c => NZ_CITIES[c].some(s => s.toLowerCase() === typedSuburb.toLowerCase())) || city;
                  const matchedSuburb = NZ_CITIES[matchedCity].find(s => s.toLowerCase() === typedSuburb.toLowerCase()) || typedSuburb;
                  setCity(matchedCity);
                  setSuburb(matchedSuburb);
                  setTypeMode(false);
                  setTypeInput("");
                }
              }}
            />
            <button
              style={{background:"#c0392b",color:"#fff",border:"none",borderRadius:12,padding:"13px 18px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
              onClick={() => {
                if (typeInput.trim()) {
                  const parts = typeInput.split(",").map(p => p.trim());
                  const typedSuburb = parts[0];
                  const typedCity = parts[1] || "";
                  const matchedCity = cities.find(c => c.toLowerCase() === typedCity.toLowerCase()) || cities.find(c => NZ_CITIES[c].some(s => s.toLowerCase() === typedSuburb.toLowerCase())) || city;
                  const matchedSuburb = NZ_CITIES[matchedCity].find(s => s.toLowerCase() === typedSuburb.toLowerCase()) || typedSuburb;
                  setCity(matchedCity);
                  setSuburb(matchedSuburb);
                  setTypeMode(false);
                  setTypeInput("");
                }
              }}
            >Go</button>
          </div>
        )}
        <div style={S.row}>
          <div style={S.selectWrap}><select style={S.select} value={city} onChange={e => handleCityChange(e.target.value)}>{cities.map(c => <option key={c}>{c}</option>)}</select><span style={S.chevron}>▾</span></div>
          <div style={S.selectWrap}><select style={S.select} value={suburb} onChange={e => { setSuburb(e.target.value); setSearched(false); }}>{suburbs.map(s => <option key={s}>{s}</option>)}</select><span style={S.chevron}>▾</span></div>
        </div>
        <div style={S.row}>
          <div style={S.budgetWrap}><span style={{color:"#c0392b",fontWeight:700,fontSize:18}}>$</span><input type="number" value={budget} min={5} max={200} onChange={e => setBudget(Number(e.target.value))} style={S.budgetInput} /></div>
          <div style={S.selectWrap}><select style={S.select} value={cuisine} onChange={e => setCuisine(e.target.value)}>{CUISINES.map(c => <option key={c}>{c}</option>)}</select><span style={S.chevron}>▾</span></div>
        </div>
        <button style={{...S.cta, opacity: loading ? 0.7 : 1}} onClick={handleSearch} disabled={loading}>{loading ? "Searching…" : "Find somewhere to eat →"}</button>
      </div>
      {!searched && (
        <div style={{textAlign:"center",padding:"40px 32px 20px"}}>
          <div style={{fontSize:72,marginBottom:16}}>🍽️</div>
          <div style={{fontWeight:800,fontSize:22,color:"#1a1a1a",marginBottom:8}}>What are you hungry for?</div>
          <div style={{fontSize:14,color:"#aaa",lineHeight:1.6}}>Set your budget, pick your suburb,<br/>and find great food nearby.</div>
          <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:20,flexWrap:"wrap"}}>
            {["🐟 Fish & Chips","☕ Cafe","🍔 Burgers","🍕 Pizza","🍛 Indian"].map(c => (
              <span key={c} style={{background:"#fff",border:"1.5px solid #ede8e3",borderRadius:20,padding:"8px 16px",fontSize:13,fontWeight:500,color:"#555",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>{c}</span>
            ))}
          </div>
        </div>
      )}
      {searched && (
        <div style={S.results}>
          {loading && <div style={S.loadingWrap}><div style={S.spinner}/><p style={S.loadingText}>Finding restaurants in {suburb}, {city}…</p></div>}
          {error && <div style={S.errorBox}>⚠️ {error}</div>}
          {!loading && !error && results.length === 0 && <div style={S.emptyBox}>😕 No restaurants found near {suburb}. Try a nearby suburb.</div>}
          {!loading && results.length > 0 && <>
            <div style={S.resultsHeader}><span style={S.resultsCount}><strong>{results.length} spots</strong> near you</span><span style={S.resultsLocation}>📍 {suburb}, {city}</span></div>
            <div style={S.radiusBadge}>🔍 Searching within {searchRadius >= 1000 ? (searchRadius/1000).toFixed(1)+"km" : searchRadius+"m"} of {suburb}</div>
          </>}
          {!loading && results.map(spot => (
            <div key={spot.id} style={S.spotCard}>
              <div style={S.spotTop}>
                <div style={S.spotLeft}>
                  <span style={S.spotEmoji}>{spot.emoji}</span>
                  <div>
                    <div style={S.spotName}>{spot.name}</div>
                    <div style={S.spotMeta}>{spot.cuisine.charAt(0).toUpperCase() + spot.cuisine.slice(1)}</div>
                    {(() => { const meal = getMealSuggestion(spot.cuisine, budget); return meal.canAfford ? (
    <div style={{marginTop:8,background:"#eafaf1",border:"1px solid #a9dfbf",borderRadius:12,padding:"8px 12px"}}>
      <div style={{fontWeight:700,fontSize:14,color:"#27ae60"}}>{meal.emoji} {meal.dish}</div>
      <div style={{fontSize:12,color:"#888",marginTop:2}}>Typical price: {meal.typical}</div>
    </div>
  ) : (
    <div style={{marginTop:8,background:"#fff3f3",border:"1px solid #f5c6c6",borderRadius:12,padding:"8px 12px"}}>
      <div style={{fontWeight:700,fontSize:14,color:"#c0392b"}}>⚠️ Tight budget here</div>
      <div style={{fontSize:12,color:"#888",marginTop:2}}>Expect to pay {meal.typical}</div>
    </div>
  ); })()}
                  </div>
                </div>
                <div style={S.spotPriceCol}><span style={{background:"#c0392b",color:"#fff",borderRadius:12,padding:"6px 14px",fontWeight:900,fontSize:22,letterSpacing:-0.5}}>${budget}</span><span style={S.perPerson}>your budget</span></div>
              </div>
              {spot.address && <p style={S.spotDesc}>📍 {spot.address}</p>}
              {spot.tags.length > 0 && <div style={S.tagRow}>{spot.tags.map(t => <span key={t} style={S.tag}>{t}</span>)}</div>}
              <div style={S.actionRow}>
                {spot.website ? <a href={spot.website} target="_blank" rel="noopener noreferrer" style={{...S.openBtn,textDecoration:"none",textAlign:"center"}}>🌐 Website</a> : spot.phone ? <a href={"tel:"+spot.phone} style={{...S.openBtn,textDecoration:"none",textAlign:"center"}}>📞 {spot.phone}</a> : <button style={S.openBtn}>👍 Still open?</button>}
                <button style={{...S.saveBtn, background: saved[spot.id] ? "#fde8e8" : "#fef2f2"}} onClick={() => toggleSave(spot.id)}>{saved[spot.id] ? "🩷 Saved" : "🤍 Save"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Bottom Nav */}
      <nav style={S.bottomNav}>
        {[
          { id: "search", emoji: "🔍", label: "Search" },
          { id: "nearby", emoji: "📍", label: "Near Me" },
          { id: "saved", emoji: "❤️", label: "Saved" },
          { id: "map", emoji: "🗺️", label: "Map" },
        ].map(tab => (
          <button
            key={tab.id}
            style={{...S.navBtn, ...(activeTab === tab.id ? S.navBtnActive : {})}}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{fontSize:22}}>{tab.emoji}</span>
            <span style={{fontSize:11,marginTop:2,fontWeight: activeTab === tab.id ? 700 : 400}}>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Saved Tab */}
      {activeTab === "saved" && (
        <div style={{...S.results, paddingTop:16}}>
          <div style={{fontWeight:700,fontSize:18,color:"#1a1a1a",marginBottom:16}}>❤️ Saved Places</div>
          {Object.keys(saved).filter(id => saved[id]).length === 0
            ? <div style={S.emptyBox}>No saved places yet — heart a restaurant to save it!</div>
            : results.filter(r => saved[r.id]).map(spot => (
              <div key={spot.id} style={S.spotCard}>
                <div style={S.spotTop}>
                  <div style={S.spotLeft}>
                    <span style={S.spotEmoji}>{spot.emoji}</span>
                    <div>
                      <div style={S.spotName}>{spot.name}</div>
                      <div style={S.spotMeta}>{spot.cuisine}</div>
                    </div>
                  </div>
                  <button style={{...S.saveBtn, background:"#fde8e8"}} onClick={() => toggleSave(spot.id)}>🩷 Saved</button>
                </div>
                {spot.address && <p style={S.spotDesc}>📍 {spot.address}</p>}
                <div style={S.actionRow}>
                  {spot.website
                    ? <a href={spot.website} target="_blank" rel="noopener noreferrer" style={{...S.openBtn,textDecoration:"none",textAlign:"center"}}>🌐 Visit Website</a>
                    : spot.phone
                    ? <a href={"tel:"+spot.phone} style={{...S.openBtn,textDecoration:"none",textAlign:"center"}}>📞 Call</a>
                    : <button style={S.openBtn}>👍 Looks good?</button>}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Open Now Tab */}
      {activeTab === "opennow" && (
        <div style={{...S.results, paddingTop:16}}>
          <div style={{fontWeight:700,fontSize:18,color:"#1a1a1a",marginBottom:4}}>🕐 Open Right Now</div>
          <div style={{fontSize:13,color:"#888",marginBottom:16}}>Showing places currently open near {suburb}, {city}</div>
          {!searched || results.length === 0
            ? <div style={S.emptyBox}>Do a search first, then come back here to see what is open!</div>
            : results.filter(r => r.isOpen && r.isOpen.includes("Open")).length === 0
            ? <div style={S.emptyBox}>😕 No open places found in your last search. Try a different suburb!</div>
            : results.filter(r => r.isOpen && r.isOpen.includes("Open")).map(spot => (
              <div key={spot.id} style={S.spotCard}>
                <div style={S.spotTop}>
                  <div style={S.spotLeft}>
                    <span style={S.spotEmoji}>{spot.emoji}</span>
                    <div>
                      <div style={S.spotName}>{spot.name}</div>
                      <div style={S.spotMeta}>{spot.cuisine}</div>
                      <span style={{...S.badge, background:"#eafaf1", color:"#27ae60"}}>✅ Open now</span>
                    </div>
                  </div>
                  <button style={{...S.saveBtn, background: saved[spot.id] ? "#fde8e8" : "#fef2f2"}} onClick={() => toggleSave(spot.id)}>{saved[spot.id] ? "🩷" : "🤍"}</button>
                </div>
                {spot.address && <p style={S.spotDesc}>📍 {spot.address}</p>}
                {(() => { const meal = getMealSuggestion(spot.cuisine, budget); return meal.canAfford ? (
                  <div style={{marginTop:8,background:"#eafaf1",border:"1px solid #a9dfbf",borderRadius:12,padding:"8px 12px",marginBottom:10}}>
                    <div style={{fontWeight:700,fontSize:14,color:"#27ae60"}}>{meal.emoji} {meal.dish}</div>
                    <div style={{fontSize:12,color:"#888",marginTop:2}}>Typical price: {meal.typical}</div>
                  </div>
                ) : (
                  <div style={{marginTop:8,background:"#fff3f3",border:"1px solid #f5c6c6",borderRadius:12,padding:"8px 12px",marginBottom:10}}>
                    <div style={{fontWeight:700,fontSize:14,color:"#c0392b"}}>⚠️ Tight budget here</div>
                    <div style={{fontSize:12,color:"#888",marginTop:2}}>Expect to pay {meal.typical}</div>
                  </div>
                ); })()}
                <div style={S.actionRow}>
                  {spot.website
                    ? <a href={spot.website} target="_blank" rel="noopener noreferrer" style={{...S.openBtn,textDecoration:"none",textAlign:"center"}}>🌐 Visit Website</a>
                    : spot.phone
                    ? <a href={"tel:"+spot.phone} style={{...S.openBtn,textDecoration:"none",textAlign:"center"}}>📞 Call</a>
                    : <button style={S.openBtn}>👍 Looks good?</button>}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Map Tab */}
      {activeTab === "map" && (
        <div style={{paddingTop:16,paddingBottom:100}}>
          <div style={{fontWeight:700,fontSize:18,color:"#1a1a1a",marginBottom:4,padding:"0 16px"}}>🗺️ Map View</div>
          <div style={{fontSize:13,color:"#888",marginBottom:12,padding:"0 16px"}}>
            {results.length > 0 ? `${results.length} spots near ${suburb}, ${city}` : "Do a search first to see results on the map"}
          </div>
          {results.length === 0
            ? <div style={{...S.emptyBox,margin:"0 16px"}}>🔍 Search for restaurants first, then view them here on the map!</div>
            : <iframe
                title="EatSmart Map"
                width="100%"
                height="480"
                style={{border:"none",borderRadius:0}}
                src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBcW_IUoSLp40QgEbF48X_YWn_RhVTWvwY&q=restaurants+near+${encodeURIComponent(suburb+", "+city+", New Zealand")}&zoom=14`}
              />
          }
          {results.length > 0 && (
            <div style={{padding:"16px 16px 0"}}>
              <div style={{fontWeight:600,fontSize:15,color:"#333",marginBottom:10}}>📍 Your results</div>
              {results.map(spot => (
                <div key={spot.id} style={{display:"flex",alignItems:"center",gap:10,background:"#fff",borderRadius:12,padding:"10px 14px",marginBottom:8,boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
                  <span style={{fontSize:24}}>{spot.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14,color:"#1a1a1a"}}>{spot.name}</div>
                    <div style={{fontSize:12,color:"#888"}}>{spot.address || spot.cuisine}</div>
                  </div>
                  {spot.isOpen && <span style={{fontSize:11,fontWeight:600,color: spot.isOpen.includes("Open") ? "#27ae60" : "#c0392b",background: spot.isOpen.includes("Open") ? "#eafaf1" : "#fff3f3",borderRadius:8,padding:"3px 8px"}}>{spot.isOpen}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const S = {
  page:{fontFamily:"'Poppins',sans-serif",background:"#faf9f7",minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:100},
  header:{background:"linear-gradient(135deg, #e83a2a 0%, #c0392b 60%, #a93226 100%)",padding:"28px 24px 48px",position:"relative",overflow:"hidden"},
  logo:{display:"flex",alignItems:"center",gap:2,marginBottom:6},
  logoEat:{fontWeight:900,fontSize:36,color:"#fff",letterSpacing:-1.5},
  logoSmart:{fontWeight:900,fontSize:36,color:"#ffd97d",letterSpacing:-1.5},
  logoIcon:{fontSize:28,marginLeft:6},
  tagline:{color:"rgba(255,255,255,0.88)",fontSize:14,margin:0},
  wave:{position:"absolute",bottom:-2,left:0,right:0,height:36,background:"#faf9f7",borderRadius:"50% 50% 0 0 / 100% 100% 0 0"},
  card:{background:"#fff",borderRadius:24,margin:"0 16px",padding:"22px 18px",boxShadow:"0 8px 32px rgba(200,50,40,0.10)",marginTop:-18,position:"relative",zIndex:2,display:"flex",flexDirection:"column",gap:12},
  row:{display:"flex",gap:10},
  locateBtn:{flex:1,display:"flex",alignItems:"center",gap:8,background:"#fff5f4",border:"1.5px solid #ffd5d0",borderRadius:14,padding:"14px 16px",cursor:"pointer",fontSize:15},
  typeBtn:{background:"#fff",border:"1.5px solid #ede8e3",borderRadius:14,padding:"14px 18px",cursor:"pointer",fontSize:15,color:"#999",fontFamily:"inherit"},
  selectWrap:{flex:1,position:"relative"},
  select:{width:"100%",appearance:"none",border:"1.5px solid #ede8e3",borderRadius:14,padding:"13px 36px 13px 14px",fontSize:15,background:"#fff",fontFamily:"inherit",cursor:"pointer",color:"#222",outline:"none"},
  chevron:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"#aaa",fontSize:14},
  budgetWrap:{flex:1,display:"flex",alignItems:"center",border:"1.5px solid #ede8e3",borderRadius:14,padding:"0 14px",gap:4,background:"#fff"},
  budgetInput:{border:"none",outline:"none",fontSize:22,fontWeight:700,width:"100%",fontFamily:"inherit",color:"#222",background:"transparent"},
  cta:{background:"linear-gradient(135deg, #e83a2a, #c0392b)",color:"#fff",border:"none",borderRadius:16,padding:"18px",fontSize:17,fontWeight:700,fontFamily:"inherit",cursor:"pointer",letterSpacing:0.3,boxShadow:"0 4px 16px rgba(200,50,40,0.3)"},
  results:{padding:"24px 16px 0"},
  loadingWrap:{display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 0"},
  spinner:{width:36,height:36,border:"3px solid #f0e0de",borderTop:"3px solid #c0392b",borderRadius:"50%",animation:"spin 0.8s linear infinite"},
  loadingText:{marginTop:14,color:"#888",fontSize:14},
  errorBox:{background:"#fff3f3",border:"1px solid #f5c6c6",borderRadius:12,padding:"16px",color:"#c0392b",fontSize:14,marginBottom:12},
  emptyBox:{background:"#fff",borderRadius:16,padding:"28px 24px",textAlign:"center",color:"#aaa",fontSize:15,border:"1.5px dashed #ede8e3"},
  resultsHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8},
  resultsCount:{fontSize:17,color:"#222"},
  resultsLocation:{fontSize:13,color:"#888"},
  radiusBadge:{fontSize:12,color:"#aaa",marginBottom:16,paddingLeft:2},
  bottomNav:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid #f0ebe6",display:"flex",justifyContent:"space-around",padding:"8px 0 20px",zIndex:100,boxShadow:"0 -4px 20px rgba(200,50,40,0.08)"},
  navBtn:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",background:"none",border:"none",cursor:"pointer",color:"#aaa",fontFamily:"inherit",padding:"4px 0"},
  navBtnActive:{color:"#e83a2a"},
  spotCard:{background:"#fff",borderRadius:24,padding:"18px 16px",marginBottom:14,boxShadow:"0 4px 16px rgba(0,0,0,0.07)",borderLeft:"4px solid #e83a2a"},
  spotTop:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12},
  spotLeft:{display:"flex",gap:10,alignItems:"flex-start"},
  spotEmoji:{fontSize:32,lineHeight:1},
  spotName:{fontWeight:700,fontSize:17,color:"#1a1a1a"},
  spotMeta:{fontSize:13,color:"#888",marginTop:2},
  badge:{display:"inline-block",marginTop:6,background:"#eafaf1",color:"#27ae60",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600,border:"1px solid #a9dfbf"},
  spotPriceCol:{display:"flex",flexDirection:"column",alignItems:"center"},
  dollarSign:{color:"#c0392b",fontWeight:700,fontSize:26,lineHeight:1},
  perPerson:{fontSize:11,color:"#aaa",marginTop:2},
  spotDesc:{fontSize:13,color:"#777",margin:"0 0 10px"},
  dishRow:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fdf6ee",borderRadius:10,padding:"10px 14px",marginBottom:12},
  dishLabel:{fontWeight:600,fontSize:14,color:"#333"},
  tagRow:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14},
  tag:{background:"#f2f2f2",borderRadius:20,padding:"5px 12px",fontSize:12,color:"#555",fontWeight:500},
  actionRow:{display:"flex",gap:10},
  openBtn:{flex:1,background:"#f0faf4",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:600,color:"#27ae60",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"},
  saveBtn:{flex:1,border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:600,color:"#e83a2a",cursor:"pointer",fontFamily:"inherit"},
};

const styleEl = document.createElement("style");
styleEl.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
document.head.appendChild(styleEl);
