import { useState, useCallback, useEffect, useRef } from "react";
import { getFeatured } from "./featuredData.js";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://eatsmart-production-7bcf.up.railway.app").replace(/\/$/, "");

const NZ_CITIES = {
  "Kerikeri": ["Haruru","Kerikeri Central","Kaikohe","Kawakawa","Paihia","Russell","Waipapa","Waitangi"],
  "Dargaville": ["Dargaville Central","Awakino Point","Baylys Beach","Donnellys Crossing","Maropiu","Matakohe","Ruawai","Tinopai"],
  "Whangarei": ["Abbey Caves","Avenues","Flanshaw","Glenbervie","Kamo","Maunu","Morningside","Onerahi","Otangarei","Tikipunga","Whangarei Central","Whangarei Heads","Woodhill"],
  "Auckland": ["Albany","Avondale","Balmoral","Beachlands","Birkenhead","Blockhouse Bay","Botany Downs","Browns Bay","Clevedon","Devonport","East Tamaki","Eden Terrace","Ellerslie","Epsom","Flat Bush","Forrest Hill","Freemans Bay","Glen Eden","Glen Innes","Glendowie","Glenfield","Grey Lynn","Half Moon Bay","Henderson","Herne Bay","Hillsborough","Hobsonville","Howick","Kingsland","Kohimarama","Kumeu","Lynfield","Manukau","Manurewa","Massey","Mission Bay","Morningside","Mount Albert","Mount Eden","Mount Roskill","Mount Wellington","Newmarket","Newton","New Lynn","Northcote","Onehunga","Orewa","Pakuranga","Panmure","Papakura","Parnell","Papatoetoe","Penrose","Point Chevalier","Ponsonby","Pukekohe","Remuera","Royal Oak","Sandringham","Silverdale","St Heliers","St Johns","St Lukes","Takanini","Takapuna","Titirangi","Wairau Valley","Warkworth","Waterview","Wellsford","Westgate","Westmere","Whangaparaoa"],
  "Pukekohe": ["Bombay","Buckland","Karaka","Paerata","Patumahoe","Pukekohe Central","Tuakau","Waiuku"],
  "Manukau": ["Botany Downs","Clover Park","East Tamaki","Flat Bush","Goodwood Heights","Highland Park","Howick","Mangere","Mangere Bridge","Mangere East","Manukau Central","Manurewa","Otara","Papatoetoe","Randwick Park","Takanini","Wiri"],
  "Waitakere": ["Avondale","Glen Eden","Glendene","Henderson","Hobsonville","Kelston","Kumeu","Massey","New Lynn","Ranui","Sunnyvale","Swanson","Te Atatu North","Te Atatu Peninsula","Titirangi","West Harbour","Westgate","Whenuapai"],
  "North Shore": ["Albany","Bayswater","Beach Haven","Belmont","Birkdale","Birkenhead","Browns Bay","Castor Bay","Devonport","Forrest Hill","Glenfield","Hillcrest","Long Bay","Mairangi Bay","Milford","Murrays Bay","Northcote","Northcote Point","Pinehill","Rothesay Bay","Takapuna","Torbay","Totara Vale","Unsworth Heights","Windsor Park"],
  "Papakura": ["Drury","Karaka","Opaheke","Pahurehure","Papakura Central","Red Hill","Takanini","Taupiri"],
  "Hamilton": ["Beerescourt","Chartwell","Claudelands","Dinsdale","Fairfield","Flagstaff","Frankton","Hamilton Central","Hamilton East","Hamilton Lake","Hillcrest","Huntington","Melville","Nawton","Peacocke","Rototuna","Saint Andrews","Silverdale","Southgate","Temple View","Te Rapa","Whitiora"],
  "Cambridge": ["Cambridge Central","Leamington","Ohaupo","Te Awamutu","Karapiro","Pukerimu"],
  "Morrinsville": ["Morrinsville Central","Matamata","Paeroa","Te Aroha","Waihi","Ngatea"],
  "Thames": ["Thames Central","Coromandel","Hahei","Pauanui","Tairua","Tauranga Eastern","Whangamata","Whitianga"],
  "Tauranga": ["Arataki","Bethlehem","Brookfield","Gate Pa","Greerton","Hairini","Judea","Katikati","Maungatapu","Mount Maunganui","Ohauiti","Otumoetai","Papamoa","Pyes Pa","Tauranga Central","Te Puke","Welcome Bay"],
  "Rotorua": ["Fairy Springs","Fenton Park","Glenholme","Hannahs Bay","Holdens Bay","Koutu","Lynmore","Ngapuna","Ohinemutu","Rotorua Central","Springfield","Sunnyvale","Utuhina","Victoria"],
  "Taupo": ["Acacia Bay","Broadlands","Hilltop","Kinloch","Lake Terrace","Mangakino","Nukuhau","Rangatira Park","Richmond Heights","Taupo Central","Tauhara","Turangi","Wairakei","Waitahanui"],
  "Whakatane": ["Coastlands","Edgecumbe","Kawerau","Murupara","Ohope","Opotiki","Whakatane Central"],
  "Gisborne": ["Elgin","Gisborne Central","Kaiti","Lytton","Mangapapa","Outer Kaiti","Riverdale","Tamarau","Whataupoko"],
  "Napier": ["Ahuriri","Bay View","Bluff Hill","Greenmeadows","Hospital Hill","Maraenui","Marewa","Meeanee","Napier Central","Napier Hill","Onekawa","Pirimai","Taradale","Tamatea","Te Awa"],
  "Hastings": ["Akina","Camberley","Clive","Flaxmere","Frimley","Hastings Central","Havelock North","Irongate","Karamu","Mahora","Mangateretere","Mayfair","Omahu","Parklands","Raureka","Southampton","Te Awanga","Tomoana","Whakatu","Windsor Park"],
  "Wairoa": ["Wairoa Central","Frasertown","Mahia","Nuhaka","Tuai"],
  "New Plymouth": ["Bell Block","Blagdon","Brooklands","Fernbrook","Fitzroy","Frankleigh Park","Glen Avon","Highlands Park","Hurdon","Marfell","Merrilands","Moturoa","New Plymouth Central","Oakura","Okato","Spotswood","St Leonards","Vogeltown","Waitara","Westown"],
  "Stratford": ["Stratford Central","Eltham","Hawera","Manaia","Opunake","Patea"],
  "Whanganui": ["Aramoho","Castlecliff","Gonville","Kai Iwi","Marybank","Putiki","Springvale","St Johns Hill","Whanganui Central","Whanganui East"],
  "Palmerston North": ["Aokautere","Awapuni","Bunnythorpe","Cloverlea","Hokowhitu","Kelvin Grove","Longburn","Milson","Palmerston North Central","Roslyn","Takaro","Terrace End","West End"],
  "Levin": ["Kimberley","Levin Central","Ohau","Otaki","Shannon","Tokomaru","Waitarere Beach"],
  "Masterton": ["Colombo","Kuripuni","Lansdowne","Masterton Central","Opaki","Solway","Te Ore Ore","Tararua"],
  "Wellington": ["Aro Valley","Berhampore","Brooklyn","Churton Park","Crofton Downs","Glenside","Hataitai","Highbury","Houghton Bay","Island Bay","Johnsonville","Karori","Kelburn","Kilbirnie","Khandallah","Lambton","Lyall Bay","Miramar","Mornington","Mount Cook","Mount Victoria","Newlands","Newtown","Ngaio","Northland","Oriental Bay","Owhiro Bay","Petone","Porirua","Roseneath","Seatoun","Strathmore Park","Tawa","Te Aro","Thorndon","Upper Hutt","Wadestown","Waterloo","Wilton","Woodridge"],
  "Nelson": ["Atawhai","Bishopdale","Brook","Enner Glynn","Motueka","Nayland","Nelson Central","Richmond","Stoke","Tahunanui","The Wood","Toi Toi","Washington Valley"],
  "Blenheim": ["Awatere Valley","Blenheim Central","Grovetown","Mayfield","Omaka","Rapaura","Renwick","Spring Creek","Springlands","Witherlea","Woodbourne"],
  "Kaikoura": ["Kaikoura Central","Hapuku","Peketa","South Bay"],
  "Greymouth": ["Greymouth Central","Hokitika","Kumara","Moana","Runanga","Westport"],
  "Christchurch": ["Addington","Aranui","Avonhead","Beckenham","Belfast","Bishopdale","Bryndwr","Burnside","Cashmere","Cathedral Square","Christchurch Central","Edgeware","Ferrymead","Fendalton","Halswell","Harewood","Heathcote","Hillmorton","Hornby","Ilam","Islington","Linwood","Lyttelton","Merivale","New Brighton","Northcote","Papanui","Parklands","Phillipstown","Prebbleton","Rangiora","Redcliffs","Riccarton","Rolleston","Russley","Shirley","Sockburn","Spreydon","St Albans","St Martins","Sumner","Sydenham","Templeton","Upper Riccarton","Waltham","Woolston"],
  "Timaru": ["Gleniti","Highfield","Kingsdown","Marchwiel","Parkside","Seaview","Smithfield","Timaru Central","Waimataitai","Watlington"],
  "Ashburton": ["Ashburton Central","Allenton","Hampstead","Huntingdon","Methven","Rakaia","Tinwald"],
  "Oamaru": ["Oamaru Central","Enfield","Hampden","Kakanui","Ngapara","Palmerston","Weston"],
  "Dunedin": ["Andersons Bay","Brockville","Caversham","Corstorphine","Dunedin Central","East Taieri","Forbury","Green Island","Halfway Bush","Kaikorai","Liberton","Maori Hill","Mornington","Mosgiel","Musselburgh","North East Valley","Otago Peninsula","Pine Hill","Port Chalmers","Ravensbourne","Roslyn","Saint Clair","Saint Kilda","Shiel Hill","South Dunedin","Tainui","Wakari"],
  "Queenstown": ["Arrowtown","Arthurs Point","Closeburn","Dalefield","Fernhill","Frankton","Glenorchy","Hanley's Farm","Jack's Point","Lake Hayes","Lake Hayes Estate","Queenstown Central","Remarkables Park","Sunshine Bay","Wanaka"],
  "Gore": ["Charlton","Gore Central","Knapdale","Lorneville","Mataura","Pukerau","Riversdale","Waikaka"],
  "Invercargill": ["Appleby","Avenal","Bluff","Georgetown","Gladstone","Grasmere","Hawthorndale","Invercargill Central","Kew","Newfield","North Invercargill","Otatara","Richmond","Strathern","Waikiwi","Windsor"],
};

const CUISINES = ["Any","Fish & Chips","NZ Modern","Cafe","Bakery","Pub Food","Burgers","Pizza","Takeaway","Italian","Japanese","Sushi","Chinese","Indian","Thai","Mexican","Korean","Mediterranean","American","French","Vietnamese","Middle Eastern","Seafood","Vegetarian","Turkish","Greek"];
const CUISINE_EMOJI = {"italian":"🍝","japanese":"🍣","chinese":"🥢","indian":"🍛","thai":"🌶️","mexican":"🌮","korean":"🍱","mediterranean":"🥗","american":"🍔","french":"🥐","vietnamese":"🍜","seafood":"🐟","vegetarian":"🥦","cafe":"☕","pizza":"🍕","burger":"🍔","default":"🍽️"};

// 🔥 TRENDING — curated list of spots popping on TikTok/Insta/YouTube.
// Edit this list to keep it current. Matching is by name (case-insensitive, partial).
const TRENDING = [
  "Fang'd",
  "Daily Bread",
  "Gilmours",
  "Pici",
  "Bell\u00e9 Studio",
  "Honeybones",
  "Apero",
  "Lilian",
  "Kol",
  "Amano",
  "Cassia",
  "Hello Beasty",
  "Gochu",
  "Saan",
  "Inca",
];
function isTrending(name) {
  if (!name) return false;
  const n = name.toLowerCase();
  return TRENDING.some(t => n.includes(t.toLowerCase()) || t.toLowerCase().includes(n));
}

function getCuisineEmoji(cuisine) {
  if (!cuisine) return CUISINE_EMOJI.default;
  const key = cuisine.toLowerCase();
  for (const [k, v] of Object.entries(CUISINE_EMOJI)) { if (key.includes(k)) return v; }
  return CUISINE_EMOJI.default;
}

async function geocodeSuburb(suburb, city) {
  if (suburb === "All Suburbs") {
    const results = await geocodeAddress(city, "");
    if (results.length > 0) return { lat: results[0].lat, lon: results[0].lon };
    return null;
  }
  const results = await geocodeAddress(suburb.charAt(0).toUpperCase() + suburb.slice(1) + " " + city, city);
  if (results.length > 0) return { lat: results[0].lat, lon: results[0].lon };
  return null;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function searchRestaurants(lat, lon, radiusMeters, cuisineType) {
  const url = `${API_BASE_URL}/api/places?lat=${lat}&lng=${lon}&radius=${radiusMeters}&cuisine=${encodeURIComponent(cuisineType || "Any")}`;
  const res = await fetch(url);
  const data = await res.json();
  const places = data.results || [];
  const detailed = await Promise.all(places.map(async (place) => {
    try {
      const dr = await fetch(`${API_BASE_URL}/api/place-details?place_id=${encodeURIComponent(place.place_id)}`);
      const dd = await dr.json();
      const d = dd.result || {};
      return { ...place, website: d.website || null, formatted_phone_number: d.formatted_phone_number || null, opening_hours: d.opening_hours || null };
    } catch(e) { return place; }
  }));
  return detailed;
}

function formatRestaurant(place, index) {
  const types = place.types || [];
  const excludedTypes = ["lodging","motel","hotel","motor_lodge","rv_park","campground","real_estate_agency","car_rental","gas_station","convenience_store","grocery_or_supermarket","supermarket","pharmacy","bank","atm","hospital","doctor","dentist"];
  const excludedNameWords = ["motor lodge","motor inn","holiday park","caravan","accommodation","countdown","new world","pak n save","4 square","petrol","z energy","bp station","mobil"];
  const nameLower = (place.name || "").toLowerCase();
  if (types.some(t => excludedTypes.includes(t)) && !types.includes("restaurant")) return null;
  if (types.includes("bakery") && !types.includes("restaurant")) return null;
  if (types.includes("store") && !types.includes("restaurant") && !types.includes("food")) return null;
  if (excludedNameWords.some(w => nameLower.includes(w))) return null;

  const name = place.name || "Unnamed Restaurant";
  const cmap={"meal_delivery":"Takeaway","meal_takeaway":"Takeaway","fast_food_restaurant":"Fast Food","american_restaurant":"American","chinese_restaurant":"Chinese","indian_restaurant":"Indian","italian_restaurant":"Italian","japanese_restaurant":"Japanese","korean_restaurant":"Korean","mexican_restaurant":"Mexican","thai_restaurant":"Thai","vietnamese_restaurant":"Vietnamese","french_restaurant":"French","mediterranean_restaurant":"Mediterranean","seafood_restaurant":"Seafood","steak_house":"Steakhouse","sushi_restaurant":"Sushi","pizza_restaurant":"Pizza","hamburger_restaurant":"Burgers","cafe":"Cafe","bakery":"Bakery","bar":"Bar","restaurant":"Restaurant"};
  const ct=types.find(t=>cmap[t]);
  const cuisine=ct?cmap[ct]:types.length>0?types[0].replace(/_/g," "):"Restaurant";
  const addr = place.formatted_address || place.vicinity || null;
  const website = place.website || null;
  const phone = place.formatted_phone_number || null;
  const rating = place.rating || null;
  const ratingCount = place.user_ratings_total || null;
  const priceLevel = (place.price_level !== undefined && place.price_level !== null) ? place.price_level : null;
  const isOpen = place.opening_hours ? (place.opening_hours.open_now ? "✅ Open now" : "❌ Closed") : null;
  const photoRef = place.photoRef || place.photos?.[0]?.photo_reference || null;
  const lat = place.geometry?.location?.lat ?? null;
  const lng = place.geometry?.location?.lng ?? null;
  return { id: place.place_id || index, name, emoji: getCuisineEmoji(cuisine), cuisine, address: addr || null, phone, website, tags: [isOpen].filter(Boolean), isOpen, rating, ratingCount, priceLevel, rawTypes: types, photoRef, lat, lng };
}

function getDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  const d = R*c;
  return d < 1 ? Math.round(d*1000) + 'm' : d.toFixed(1) + 'km';
}

function searchLocations(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];
  for (const [city, suburbs] of Object.entries(NZ_CITIES)) {
    if (city.toLowerCase().includes(q)) {
      results.push({ label: city + " (All Suburbs)", city, suburb: "All Suburbs" });
    }
    for (const suburb of suburbs) {
      if (suburb.toLowerCase().includes(q)) {
        results.push({ label: suburb + ", " + city, city, suburb });
      }
    }
    if (results.length >= 8) break;
  }
  return results.slice(0, 8);
}

function formatGeocodeResults(data, fallbackCity = "") {
  if (!data.results || data.results.length === 0) return [];
  return data.results.slice(0, 5).map(r => ({
    label: r.formatted_address.replace(", New Zealand", ""),
    lat: r.geometry.location.lat,
    lon: r.geometry.location.lng,
    suburb: r.address_components.find(c => c.types.includes("sublocality") || c.types.includes("neighborhood"))?.long_name || "",
    city: r.address_components.find(c => c.types.includes("locality"))?.long_name || fallbackCity,
    type: "street"
  }));
}

async function geocodeAddress(query, city = "") {
  try {
    const cleanQuery = String(query || "").trim();
    const cleanCity = String(city || "").trim();
    const queryHasCity = cleanCity && cleanQuery.toLowerCase().includes(cleanCity.toLowerCase());
    const searchQuery = queryHasCity || !cleanCity ? cleanQuery : `${cleanQuery} ${cleanCity}`;
    const res = await fetch(`${API_BASE_URL}/api/geocode?q=${encodeURIComponent(searchQuery)}`);
    const data = await res.json();
    return formatGeocodeResults(data, cleanCity);
  } catch(e) {}
  return [];
}

async function geocodePlace(placeId, fallbackCity = "") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/geocode?place_id=${encodeURIComponent(placeId)}`);
    const data = await res.json();
    return formatGeocodeResults(data, fallbackCity);
  } catch(e) {}
  return [];
}

function MapView({ spots, center, onPick }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;

    function ensureLeaflet() {
      return new Promise((resolve, reject) => {
        if (window.L) return resolve(window.L);
        // CSS (once)
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css"; link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }
        // Poll for window.L in case a script tag is already loading/loaded
        const existing = document.getElementById("leaflet-js");
        if (existing) {
          let tries = 0;
          const iv = setInterval(() => {
            if (window.L) { clearInterval(iv); resolve(window.L); }
            else if (++tries > 60) { clearInterval(iv); reject(new Error("leaflet timeout")); }
          }, 100);
          return;
        }
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => resolve(window.L);
        script.onerror = () => {
          // Fallback CDN
          const alt = document.createElement("script");
          alt.src = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js";
          alt.onload = () => resolve(window.L);
          alt.onerror = () => reject(new Error("leaflet failed"));
          document.body.appendChild(alt);
        };
        document.body.appendChild(script);
      });
    }

    ensureLeaflet().then((L) => {
      if (cancelled || !containerRef.current) return;
      setStatus("ready");
      const validSpots = spots.filter(s => s.lat && s.lng);
      const c = center && center.lat ? [center.lat, center.lon || center.lng] : (validSpots[0] ? [validSpots[0].lat, validSpots[0].lng] : [-36.8485, 174.7633]);

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current).setView(c, 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap", maxZoom: 19,
        }).addTo(mapRef.current);
      } else {
        mapRef.current.setView(c, 14);
      }

      mapRef.current.eachLayer(layer => { if (layer instanceof L.Marker) mapRef.current.removeLayer(layer); });

      const bounds = [];
      validSpots.forEach((s) => {
        const marker = L.marker([s.lat, s.lng]).addTo(mapRef.current);
        const stars = s.rating ? ` ⭐${s.rating}` : "";
        marker.bindPopup(`<strong>${s.name}</strong>${stars}<br>${s.address || ""}`);
        if (onPick) marker.on("click", () => onPick(s));
        bounds.push([s.lat, s.lng]);
      });
      if (bounds.length > 1) { try { mapRef.current.fitBounds(bounds, { padding: [40, 40] }); } catch(e){} }
      setTimeout(() => { if (mapRef.current) mapRef.current.invalidateSize(); }, 120);
    }).catch(() => { if (!cancelled) setStatus("error"); });

    return () => { cancelled = true; };
  }, [spots, center, onPick]);

  useEffect(() => () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } }, []);

  return (
    <div style={{position:"relative",width:"100%",height:420,borderRadius:14,overflow:"hidden",border:"1.5px solid #ede8e3",background:"#eef2f3"}}>
      <div ref={containerRef} style={{width:"100%",height:"100%"}} />
      {status==="loading" && <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:14,fontWeight:600}}>Loading map…</div>}
      {status==="error" && <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:13,textAlign:"center",padding:20}}>Map couldn't load. Switch back to List view.</div>}
    </div>
  );
}

export default function EatSmart() {
  const cities = Object.keys(NZ_CITIES);
  const [city, setCity] = useState(() => localStorage.getItem("es_city") || "Auckland");
  const [suburb, setSuburb] = useState(() => localStorage.getItem("es_suburb") || "Remuera");
  const [cuisine, setCuisine] = useState("Any");
  const [priceFilter, setPriceFilter] = useState("Any");
  const [cuisineFilters, setCuisineFilters] = useState([]); const cuisineFilter = cuisineFilters[0] || "";  const setCuisineFilter = (v) => setCuisineFilters(v ? [v] : []);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [findTerm, setFindTerm] = useState("");
  const [nearMode, setNearMode] = useState(() => localStorage.getItem("es_nearmode") || "gps");
  const searchSeqRef = useRef(0);
  const findDebounceRef = useRef(null);
  const [searchFieldFocused, setSearchFieldFocused] = useState(false);
  const [findLoading, setFindLoading] = useState(false);
  const [findHighlight, setFindHighlight] = useState(-1);
  const [detectedArea, setDetectedArea] = useState(() => localStorage.getItem("es_detected") || "");
  const [showNearMenu, setShowNearMenu] = useState(false);
  const [findSuggestions, setFindSuggestions] = useState([]);
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [smartSearch, setSmartSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => { try { return JSON.parse(localStorage.getItem("es_recent") || "[]"); } catch(e) { return []; } });
  const [recentCollapsed, setRecentCollapsed] = useState(() => localStorage.getItem("es_recent_collapsed") === "1");
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem("es_saved") || "{}"); } catch(e) { return {}; } });
  const [locating, setLocating] = useState(false);
  const [searchRadius, setSearchRadius] = useState(800);
  const [typeMode, setTypeMode] = useState(false);
  const [locationSearch, setLocationSearch] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [citySearch, setCitySearch] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(() => !localStorage.getItem("es_install_dismissed"));
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [customCoords, setCustomCoords] = useState(null);
  const [streetSearching, setStreetSearching] = useState(false);
  const [searchCoords, setSearchCoords] = useState(null);
  const [typeInput, setTypeInput] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [priceModal, setPriceModal] = useState(null);
  const [contactModal, setContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [priceForm, setPriceForm] = useState({ dish: "", price: "", date: new Date().toISOString().split('T')[0] });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [resultLimit, setResultLimit] = useState(10);
  const [openNowOnly, setOpenNowOnly] = useState(false);

  const searchRef = useRef(null);
  const openNowRef = useRef(null);
  const savedRef = useRef(null);
  const topRatedRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.documentElement.style.overflowY = "scroll";
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    const ga = document.createElement('script');
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-06CLZN1L9N';
    ga.async = true;
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-06CLZN1L9N');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => window.emailjs.init('ADleKoFQQMlb9OHSw');
    document.head.appendChild(script);
  }, []);

  function handleCityChange(newCity) {
    setCity(newCity);
    setSuburb("All Suburbs");
    setCustomCoords(null);
    localStorage.setItem("es_city", newCity);
    localStorage.setItem("es_suburb", "All Suburbs");
    setSearched(false); setResults([]); setError(null);
  }

  function runSearch(termOverride) {
    const term = (termOverride !== undefined ? termOverride : findTerm).trim();
    // Use the typed term if present; otherwise fall back to the cuisine picked in Filters.
    const cuisines = term ? [term.split(",")[0].trim()] : (cuisineFilters.length > 0 ? cuisineFilters : []);
    setShowNearMenu(false);
    setFindSuggestions([]);
    if (nearMode === "gps") {
      // Search near the user's actual location
      setLocating(true);
      if (!navigator.geolocation) {
        setLocating(false); setCustomCoords(null);
        setCuisineFilters(cuisines); handleSearch(cuisines);
        return;
      }
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCustomCoords(c); setSuburb("Near me"); localStorage.setItem("es_suburb","Near me");
        // Reverse-geocode to show the actual suburb name
        try {
          const gr = await fetch(`${API_BASE_URL}/api/geocode?lat=${c.lat}&lng=${c.lon}`);
          const gd = await gr.json();
          const comp = gd.results && gd.results[0] && gd.results[0].address_components || [];
          const sub = comp.find(x=>x.types.includes("sublocality")||x.types.includes("neighborhood"))
                   || comp.find(x=>x.types.includes("locality"));
          if (sub) { setDetectedArea(sub.long_name); localStorage.setItem("es_detected", sub.long_name); }
        } catch(e) {}
        setCuisineFilters(cuisines); setLocating(false);
        handleSearch(cuisines, c);
      }, () => {
        setLocating(false); setCustomCoords(null);
        setCuisineFilters(cuisines); handleSearch(cuisines);
      });
    } else {
      // Search within the picked area (city/suburb already set)
      setCustomCoords(null);
      setCuisineFilters(cuisines);
      handleSearch(cuisines);
    }
  }

  function searchPlaceNearMe(term) {
    // Use just the brand/base name (strip any ", Suburb" so we find the nearest branch, not a specific far one)
    const brand = (term || "").split(",")[0].trim();
    setLocating(true);
    if (!navigator.geolocation) {
      // No GPS — fall back to current city as the search area
      setLocating(false);
      setSuburb("All Suburbs"); localStorage.setItem("es_suburb","All Suburbs");
      setPriceFilter("Any"); setCustomCoords(null); setCuisineFilters([brand]);
      handleSearch([brand]);
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      // Use the user's real location as the search center, ignore the selected city
      const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      setCustomCoords(c);
      setSuburb("Near me"); localStorage.setItem("es_suburb","Near me");
      setPriceFilter("Any"); setCuisineFilters([brand]);
      setLocating(false);
      handleSearch([brand], c);
    }, () => {
      // Denied — fall back to current city
      setLocating(false);
      setSuburb("All Suburbs"); localStorage.setItem("es_suburb","All Suburbs");
      setPriceFilter("Any"); setCustomCoords(null); setCuisineFilters([brand]);
      handleSearch([brand]);
    });
  }

  function handleLocate() {
    setLocating(true);
    if (!navigator.geolocation) { alert("Location not supported on this device."); setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch("https://nominatim.openstreetmap.org/reverse?lat=" + pos.coords.latitude + "&lon=" + pos.coords.longitude + "&format=json&countrycodes=nz&addressdetails=1");
        const data = await res.json();
        const addr = data.address || {};
        const rawCity = addr.city || addr.town || addr.village || addr.county || "";
        // Auckland has many council area names - map them all to Auckland

        const allFields = [addr.city, addr.town, addr.village, addr.county, addr.state_district, addr.municipality, addr.region].filter(Boolean).join(" ").toLowerCase();
        const isAuckland = allFields.includes("auckland") || ["albert-eden","waitemata","henderson-massey","whau","waitakere","upper harbour","kaipatiki","devonport","hibiscus","howick","manurewa","papakura","otara","mangere","maungakiekie","orakei","puketapapa"].some(a => allFields.includes(a));
        const detectedCity = isAuckland ? "Auckland" : (addr.city || addr.town || addr.village || addr.county || "");
        const matchedCity = cities.find(c => c.toLowerCase() === detectedCity.toLowerCase()) || null;
        if (matchedCity) {
          const detectedSuburb = addr.suburb || addr.neighbourhood || addr.hamlet || addr.village || "";
          const matchedSuburb = NZ_CITIES[matchedCity].find(s => s.toLowerCase() === detectedSuburb.toLowerCase()) || NZ_CITIES[matchedCity][0];
          setCity(matchedCity);
          setSuburb(matchedSuburb);
          localStorage.setItem("es_city", matchedCity);
          localStorage.setItem("es_suburb", matchedSuburb);
          setSearched(false);
          setResults([]);
        } else {
          alert("Could not detect your NZ city. Please select manually.");
        }
      } catch(e) { setError("Could not detect location. Please select your city and suburb manually."); }
      setLocating(false);
    }, () => { setError("📍 Location access was denied. On iPhone go to Settings → Privacy → Location Services → Safari → While Using. On Android go to Settings → Apps → Chrome → Permissions → Location."); setLocating(false); });
  }

  const handleSearch = useCallback(async (cuisineOverride, coordsOverride) => {
    const activeCuisines = Array.isArray(cuisineOverride) ? cuisineOverride : cuisineFilters;
    const reqId = ++searchSeqRef.current;
    setLoading(true); setError(null); setSearched(true); setResults([]);
    try {
      let coords = coordsOverride || customCoords;
      let resolvedLabel = suburb;
      const typedSearch = locationSearch && locationSearch.trim().length > 0 ? locationSearch.trim() : (suburb && suburb !== "All Suburbs" ? suburb : "");

      // Search box text wins. This lets partial searches like "victori" resolve via autocomplete.
      if (!coords && typedSearch.length > 0) {
        let streetResults = await geocodeAddress(typedSearch, city);

        if (streetResults.length === 0 && typedSearch.length > 2) {
          try {
            const autoRes = await fetch(`${API_BASE_URL}/api/autocomplete?q=${encodeURIComponent(typedSearch + " " + city)}`);
            const autoData = await autoRes.json();
            const first = (autoData.predictions || [])[0];
            if (first?.place_id) {
              streetResults = await geocodePlace(first.place_id, city);
              resolvedLabel = first.description.replace(', New Zealand', '');
              setLocationSearch(resolvedLabel);
            }
          } catch(e) {}
        }

        if (streetResults.length > 0) {
          const firstResult = streetResults[0];
          coords = { lat: firstResult.lat, lon: firstResult.lon };
          resolvedLabel = firstResult.suburb || typedSearch;
          if (firstResult.city && cities.includes(firstResult.city)) {
            setCity(firstResult.city);
            localStorage.setItem("es_city", firstResult.city);
          }
          setSuburb(resolvedLabel);
          localStorage.setItem("es_suburb", resolvedLabel);
        }
      }

      if (!coords) {
        coords = await geocodeSuburb(suburb, city);
      }

      if (!coords) {
        const fallbackQuery = suburb === "All Suburbs" ? city : suburb;
        const streetResults = await geocodeAddress(fallbackQuery, city);
        if (streetResults.length > 0) {
          coords = { lat: streetResults[0].lat, lon: streetResults[0].lon };
        }
      }

      if (!coords) {
        const displayQuery = typedSearch || suburb || city;
        setError('Could not find ' + displayQuery + '. Try selecting a suggestion or search a full street/suburb.');
        setLoading(false);
        return;
      }
      setSearchCoords(coords);
      const isStreetSearch = (typedSearch.length > 0 || resolvedLabel) && !Object.values(NZ_CITIES).flat().includes(resolvedLabel) && resolvedLabel !== "All Suburbs";
      const isNearMe = !!coordsOverride || (suburb === "Near me");
      // Near-me uses a tight progression so results stay in your neighbourhood
      const radii = isNearMe ? [2000, 3500, 6000] : suburb === "All Suburbs" ? [5000, 8000] : isStreetSearch ? [300, 600, 1000] : [1500, 2500, 4000];
      if (suburb === "All Suburbs") setResultLimit(20);
      let spots = []; let usedRadius = 800;
      for (const r of radii) {
        const selectedCuisine = activeCuisines.length > 0 ? activeCuisines[0] : (cuisine || "Any");
        const elements = await searchRestaurants(coords.lat, coords.lon, r, selectedCuisine); console.log("Elements:", elements.length, "radius:", r);
        let mapped = elements.map((el, i) => formatRestaurant(el, i)).filter(Boolean);
        // For near-me, hard-filter to within the radius (Google textsearch treats radius as a
        // loose bias, not a boundary, so without this it can return city-wide results).
        if (isNearMe) {
          mapped = mapped.filter(s => {
            if (!s.lat || !s.lng) return false;
            const dKm = haversineKm(coords.lat, coords.lon, s.lat, s.lng);
            return dKm <= (r / 1000) * 1.15; // small tolerance
          });
        }
        spots = mapped; console.log("Spots after filter:", spots.length);
        if (spots.length > 0) { usedRadius = r; break; }
      }
      setSearchRadius(usedRadius);
      // Cuisine + budget are now applied as client-side display filters (see displayResults),
      // so the search itself returns everything for the area. This keeps filters instant & consistent.
      const filteredTrending = trendingOnly ? spots.filter(s => isTrending(s.name)) : spots;
      const sorted = [...filteredTrending].sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "nearest") {
          const distA = a.lat && a.lng ? Math.pow(a.lat - coords.lat, 2) + Math.pow(a.lng - coords.lon, 2) : Number.MAX_SAFE_INTEGER;
          const distB = b.lat && b.lng ? Math.pow(b.lat - coords.lat, 2) + Math.pow(b.lng - coords.lon, 2) : Number.MAX_SAFE_INTEGER;
          return distA - distB;
        }
        return 0;
      });
      // Ignore this response if a newer search has started since (prevents stale results mixing in)
      if (reqId !== searchSeqRef.current) return;
      setResults(sorted.slice(0, 30));
      // If the results are clearly in a different city than selected (e.g. searched a
      // specific place by name that only exists elsewhere), switch the area to match.
      // Skipped in near-me/GPS mode — there the user's location is intentional.
      try {
        if (nearMode !== "gps" && !coordsOverride) {
        const cityCounts = {};
        for (const r of sorted.slice(0, 8)) {
          const a = (r.address || "").toLowerCase();
          if (!a) continue;
          let hit = cities.find(c => a.includes(c.toLowerCase()));
          if (!hit) {
            for (const [cn, subs] of Object.entries(NZ_CITIES)) { if (subs.some(s => a.includes(s.toLowerCase()))) { hit = cn; break; } }
          }
          if (hit) cityCounts[hit] = (cityCounts[hit] || 0) + 1;
        }
        const dominant = Object.entries(cityCounts).sort((a,b)=>b[1]-a[1])[0];
        // Only switch if a clear majority of results are in a single different city
        if (dominant && dominant[0] !== city && dominant[1] >= Math.min(3, sorted.length)) {
          setCity(dominant[0]); localStorage.setItem("es_city", dominant[0]);
          setSuburb("All Suburbs"); localStorage.setItem("es_suburb", "All Suburbs");
          setNearMode("area"); localStorage.setItem("es_nearmode", "area");
        }
        }
      } catch (e) {}
      // Save to recent searches (dedup, keep last 3)
      try {
        const entry = { city, suburb, cuisines: [...activeCuisines], price: priceFilter };
        const key = JSON.stringify(entry);
        setRecentSearches(prev => {
          const next = [entry, ...prev.filter(r => JSON.stringify(r) !== key)].slice(0, 3);
          localStorage.setItem("es_recent", JSON.stringify(next));
          return next;
        });
      } catch(e) {}
    } catch(e) { if (reqId === searchSeqRef.current) { setError("Error: " + e.message); } console.error(e); }
    if (reqId === searchSeqRef.current) setLoading(false);
  }, [suburb, city, customCoords, locationSearch, cuisine, sortBy, trendingOnly]);

  function toggleSave(id) { setSaved(prev => { const next = { ...prev, [id]: !prev[id] }; if (!next[id]) delete next[id]; localStorage.setItem("es_saved", JSON.stringify(next)); return next; }); }

  function applyRecent(r) {
    if (r.city && r.city !== city) handleCityChange(r.city);
    setSuburb(r.suburb); localStorage.setItem("es_suburb", r.suburb);
    setCuisineFilters(r.cuisines || []);
    setPriceFilter(r.price || "Any");
    setCustomCoords(null);
    setTimeout(() => handleSearch(r.cuisines || []), 50);
  }

  function openSuggestSpot() {
    setContactForm({ name: "", email: "", message: "Suggest a spot 🍴\n\nName of the place:\nArea/suburb:\nWhy it's good (optional):\n" });
    setContactModal(true);
    setActiveTab("contact");
  }

  async function handleContactSubmit() {
    if (!contactForm.message) return;
    setContactSubmitting(true);
    try {
      await window.emailjs.send('service_ew0ksvq', 'template_gmd0d4o', {
        from_name: contactForm.name || 'Anonymous',
        from_email: contactForm.email || 'No email provided',
        message: contactForm.message,
      });
      setContactSuccess(true);
      setTimeout(() => { setContactModal(false); setContactSuccess(false); setContactForm({ name: "", email: "", message: "" }); setActiveTab("search"); }, 2000);
    } catch(e) { alert("Failed to send. Please email us at eatsmartappnz@gmail.com"); }
    setContactSubmitting(false);
  }

  async function handlePriceSubmit() {
    if (!priceForm.dish || !priceForm.price) return;
    setSubmitting(true);
    try {
      await window.emailjs.send('service_ew0ksvq', 'template_wla193g', {
        restaurant_name: priceModal?.name || '',
        suburb_city: suburb + ', ' + city,
        dish: priceForm.dish,
        price: priceForm.price,
        date: priceForm.date,
      });
      setSubmitSuccess(true);
      setTimeout(() => { setPriceModal(null); setSubmitSuccess(false); setPriceForm({ dish: "", price: "", date: new Date().toISOString().split('T')[0] }); }, 2000);
    } catch(e) { alert("Failed to submit. Please try again."); }
    setSubmitting(false);
  }

  function handleTabPress(tabId) {
    if (tabId === "contact") {
      setContactModal(true);
      return;
    }
    if (tabId === "search") {
      // The Search tab intentionally starts a fresh search
      setActiveTab("search");
      setSearched(false);
      setResults([]);
      setError(null);
      window.scrollTo({top:0,behavior:"smooth"});
      setTimeout(() => setSearchFocused(true), 300);
    } else if (activeTab !== tabId) {
      // Switch into a view tab (Open Now / Saved) — keep results intact
      setActiveTab(tabId);
      window.scrollTo({top:0,behavior:"smooth"});
    } else {
      // Tapping the active tab again returns to the results view WITHOUT wiping results
      setActiveTab("search");
      window.scrollTo({top:0,behavior:"smooth"});
    }
  }

  const suburbs = NZ_CITIES[city] || [];
  const hasActiveFilters = cuisineFilters.length > 0 || priceFilter !== "Any" || openNowOnly;
  const showFilterPanel = searchFocused;
  const searchDisplay = locationSearch !== null ? locationSearch : (customCoords ? suburb : (suburb === "All Suburbs" ? city : suburb));
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "nearest" && searchCoords) {
      const distA = a.lat && a.lng ? Math.pow(a.lat - searchCoords.lat, 2) + Math.pow(a.lng - searchCoords.lon, 2) : 999;
      const distB = b.lat && b.lng ? Math.pow(b.lat - searchCoords.lat, 2) + Math.pow(b.lng - searchCoords.lon, 2) : 999;
      return distA - distB;
    }
    return 0;
  });
  const openSpots = sortedResults.filter(r => r.isOpen && r.isOpen.includes("Open"));
  // Client-side filters from the Filters panel (cuisine + budget) — applied instantly, no re-search.
  // Cuisine matching checks name + cuisine + types against keyword aliases, because Google's
  // type tags alone are unreliable (e.g. fish & chip shops are often just "meal_takeaway").
  const CUISINE_KEYWORDS = {
    "fish & chips": ["fish","chip","chippy","takeaway","seafood","battered"],
    "cafe": ["cafe","café","coffee","espresso","brunch","bakery"],
    "burgers": ["burger","grill","diner","patty"],
    "pizza": ["pizza","pizzeria","italian"],
    "indian": ["indian","curry","tandoor","masala","biryani"],
    "sushi": ["sushi","japanese","sashimi","ramen","bento"],
    "chinese": ["chinese","wok","dumpling","noodle","yum cha","dim sum"],
    "thai": ["thai","pad","tom yum"],
    "japanese": ["japanese","sushi","ramen","izakaya","teppan"],
    "korean": ["korean","bbq","kimchi","bibimbap"],
    "italian": ["italian","pizza","pasta","trattoria","ristorante"],
    "mexican": ["mexican","taco","burrito","cantina"],
    "vietnamese": ["vietnamese","pho","banh"],
    "mediterranean": ["mediterranean","greek","kebab","falafel","turkish"],
    "seafood": ["seafood","fish","oyster","prawn","crab"],
    "healthy": ["healthy","salad","poke","vegan","vegetarian","bowl"],
  };
  const displayResults = (() => {
    let list = sortedResults;
    if (cuisineFilters.length > 0) {
      list = list.filter(s => cuisineFilters.some(cf => {
        const key = cf.toLowerCase();
        const kws = CUISINE_KEYWORDS[key] || [key.replace(/ .*/,"")];
        const hay = `${(s.name||"").toLowerCase()} ${(s.cuisine||"").toLowerCase()} ${((s.rawTypes||[]).join(" ")).toLowerCase()}`;
        return kws.some(k => hay.includes(k));
      }));
    }
    if (priceFilter !== "Any") {
      const pLevel = ["$","$$","$$$","$$$$"].indexOf(priceFilter);
      list = list.filter(s => pLevel === 0 ? (s.priceLevel === 0 || s.priceLevel === null) : s.priceLevel === pLevel);
    }
    return list;
  })();
  const savedSpots = results.filter(r => saved[r.id]);
  // Derive the city the results are actually in.
  // First try matching a city name directly in the addresses; if none (vicinity often
  // returns just a suburb), map known suburbs back to their city via NZ_CITIES.
  const resultsCity = (() => {
    if (results.length === 0) return "";
    const counts = {};
    for (const r of results.slice(0, 8)) {
      const a = (r.address || "").toLowerCase();
      if (!a) continue;
      let matched = false;
      // direct city match
      for (const c of cities) {
        if (a.includes(c.toLowerCase())) { counts[c] = (counts[c]||0) + 1; matched = true; }
      }
      // suburb → city fallback
      if (!matched) {
        for (const [cityName, suburbs] of Object.entries(NZ_CITIES)) {
          if (suburbs.some(s => a.includes(s.toLowerCase()))) { counts[cityName] = (counts[cityName]||0) + 1; break; }
        }
      }
    }
    const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
    return top ? top[0] : "";
  })();
  const topRatedSpots = [...results].filter(r => r.rating).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, resultLimit);

  const SpotCard = ({ spot }) => {
    const featured = getFeatured(spot.name);
    const trending = isTrending(spot.name);
    const hero = featured || trending; // hero photo treatment for special spots
    const photo = spot.photoRef ? `${API_BASE_URL}/api/photo?ref=${encodeURIComponent(spot.photoRef)}` : null;
    const cuisineLabel = spot.cuisine.charAt(0).toUpperCase() + spot.cuisine.slice(1);
    const open = spot.isOpen && spot.isOpen.includes("Open");
    const mapsUrl = "https://www.google.com/maps/search/" + encodeURIComponent(spot.name + " " + (spot.address || ""));

    // shared info pills
    const Pills = ({ small }) => (
      <div style={{display:"flex",gap:5,marginTop:small?6:8,flexWrap:"wrap"}}>
        {spot.rating && <span style={{fontSize:small?11:12,fontWeight:700,padding:small?"3px 8px":"4px 10px",borderRadius:14,background:"#fff4e5",color:"#e67e22"}}>⭐ {spot.rating}{spot.ratingCount?` (${spot.ratingCount})`:""}</span>}
        <span style={{fontSize:small?11:12,fontWeight:700,padding:small?"3px 8px":"4px 10px",borderRadius:14,background:"#f4f1ee",color:"#666"}}>{cuisineLabel}</span>
        {(spot.priceLevel !== null && spot.priceLevel !== undefined) && <span style={{fontSize:small?11:12,fontWeight:700,padding:small?"3px 8px":"4px 10px",borderRadius:14,background:"#f4f1ee",color:"#666"}}>{"$".repeat(spot.priceLevel + 1)}</span>}
        {spot.isOpen && <span style={{fontSize:small?11:12,fontWeight:700,padding:small?"3px 8px":"4px 10px",borderRadius:14,background:open?"#e8f7ee":"#f0f0f0",color:open?"#27ae60":"#aaa"}}>{open?"● Open":"Closed"}</span>}
      </div>
    );

    const Actions = () => (
      <div style={{display:"flex",gap:6,marginTop:10}}>
        {spot.website
          ? <a href={spot.website} target="_blank" rel="noopener noreferrer" style={{flex:1,textAlign:"center",textDecoration:"none",fontSize:12,fontWeight:700,padding:"8px 0",borderRadius:10,background:"#f4f1ee",color:"#555"}}>Website</a>
          : spot.phone
          ? <a href={"tel:"+spot.phone} style={{flex:1,textAlign:"center",textDecoration:"none",fontSize:12,fontWeight:700,padding:"8px 0",borderRadius:10,background:"#f4f1ee",color:"#555"}}>Call</a>
          : <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{flex:1,textAlign:"center",textDecoration:"none",fontSize:12,fontWeight:700,padding:"8px 0",borderRadius:10,background:"#f4f1ee",color:"#555"}}>Details</a>}
        <button onClick={()=>{
          const shareUrl = "https://eatsmart.co.nz";
          const text = `${spot.name}${spot.rating?` ⭐${spot.rating}`:""} — found on EatSmart`;
          if (navigator.share) {
            navigator.share({ title: spot.name, text, url: shareUrl }).catch(()=>{});
          } else if (navigator.clipboard) {
            navigator.clipboard.writeText(`${text} ${shareUrl}`).then(()=>{ try{alert("Link copied to clipboard");}catch(e){} });
          }
        }} style={{flex:1,textAlign:"center",fontSize:12,fontWeight:700,padding:"8px 0",borderRadius:10,background:"#eef4ff",color:"#1a73e8",border:"none",cursor:"pointer",fontFamily:"inherit"}}>↗ Share</button>
        <button onClick={()=>toggleSave(spot.id)} style={{flexShrink:0,fontSize:14,fontWeight:700,padding:"8px 12px",borderRadius:10,background:saved[spot.id]?"#fde8e8":"#f7f3f0",color:saved[spot.id]?"#e83a2a":"#888",border:"none",cursor:"pointer",fontFamily:"inherit"}}>{saved[spot.id]?"🩷":"🤍"}</button>
      </div>
    );

    if (hero) {
      // ---- A: HERO PHOTO CARD (trending/featured) ----
      return (
        <div style={{background:"#fff",borderRadius:20,marginBottom:14,boxShadow:"0 4px 16px rgba(0,0,0,0.08)",overflow:"hidden"}}>
          <div style={{position:"relative"}}>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit",display:"block"}}>
            <div style={{height:150,position:"relative",background:"#fff0ed"}}>
              {photo
                ? <img src={photo} alt={spot.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={function(e){e.target.style.display="none";}} />
                : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:56}}>{spot.emoji||"🍽️"}</div>}
              <div style={{position:"absolute",top:10,left:10,display:"flex",gap:6}}>
                {trending && <span style={{background:"rgba(255,255,255,0.95)",color:"#e83a2a",fontSize:11,fontWeight:800,padding:"4px 9px",borderRadius:20,boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>🔥 Trending</span>}
                {featured && <span style={{background:"rgba(255,255,255,0.95)",color:"#b45309",fontSize:11,fontWeight:800,padding:"4px 9px",borderRadius:20,boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>⭐ Featured</span>}
              </div>
            </div>
          </a>
          <button onClick={()=>toggleSave(spot.id)} style={{position:"absolute",top:10,right:10,width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,0.95)",border:"none",fontSize:15,cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>{saved[spot.id]?"🩷":"🤍"}</button>
          </div>
          <div style={{padding:"12px 14px 14px"}}>
            <div style={{fontSize:18,fontWeight:800,color:"#1a1a1a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{spot.name}</div>
            <Pills />
            {featured && featured.signatureDish && <div style={{fontSize:12,color:"#a06000",marginTop:6,fontWeight:600}}>{featured.signatureDish}</div>}
            <Actions />
          </div>
        </div>
      );
    }

    // ---- B: REFINED HORIZONTAL CARD (default) ----
    return (
      <div style={{background:"#fff",borderRadius:18,padding:12,marginBottom:12,boxShadow:"0 3px 12px rgba(0,0,0,0.07)"}}>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit",display:"flex",gap:12,alignItems:"flex-start"}}>
          {photo
            ? <img src={photo} alt={spot.name} style={{width:92,height:92,objectFit:"cover",borderRadius:14,flexShrink:0,display:"block"}} onError={function(e){e.target.style.display="none";}} />
            : <div style={{width:92,height:92,borderRadius:14,background:"#fff0ed",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,flexShrink:0}}>{spot.emoji||"🍽️"}</div>}
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:16,fontWeight:800,color:"#1a1a1a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{spot.name}</div>
            <Pills small />
            {spot.address && <div style={{fontSize:11,color:"#aaa",marginTop:6,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>📍 {spot.address}</div>}
          </div>
        </a>
        <Actions />
      </div>
    );
  };

  return (
    <div style={S.page}>
      {/* SEARCH SECTION */}
      <div ref={searchRef}>
        <header style={S.header}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:2}}>
            <img src="/logo.png" alt="EatSmart" style={{width:36,height:36,borderRadius:9,boxShadow:"0 3px 9px rgba(0,0,0,0.25)"}} />
            <div><span style={S.logoEat}>Eat</span><span style={S.logoSmart}>Smart</span></div>
          </div>
          <p style={{color:"rgba(255,255,255,0.92)",fontSize:12,margin:"2px 0 0",textAlign:"center",fontWeight:500}}>Find great food near you</p>
          <div style={S.wave} />
        </header>
        <div style={S.card}>
          <div style={{background:"#fff",border:"2px solid",borderColor:searchFieldFocused?"#e83a2a":"#ede8e3",borderRadius:14,overflow:"hidden",position:"relative",boxShadow:searchFieldFocused?"0 4px 20px rgba(232,58,42,0.12)":"0 1px 3px rgba(0,0,0,0.04)",transition:"border-color 0.18s, box-shadow 0.18s"}}>
            {/* FIND field with inline search button */}
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 8px 8px 12px"}}>
              <span style={{fontSize:16,flexShrink:0}}>🔍</span>
              <input
                style={{flex:1,border:"none",outline:"none",fontSize:15,fontFamily:"inherit",color:"#222",background:"transparent",minWidth:0}}
                placeholder="Search food, a place, or dish…"
                value={findTerm}
                onChange={e => {
                  const val = e.target.value; setFindTerm(val); setFindHighlight(-1);
                  if (findDebounceRef.current) clearTimeout(findDebounceRef.current);
                  if (val.length <= 2) { setFindSuggestions([]); setFindLoading(false); return; }
                  setFindLoading(true);
                  // Debounce: wait until the user pauses typing before fetching (smooth, fewer calls)
                  findDebounceRef.current = setTimeout(async () => {
                    try {
                      const res = await fetch(API_BASE_URL + '/api/autocomplete?q=' + encodeURIComponent(val));
                      const data = await res.json();
                      const places = (data.predictions||[]).filter(p=>{
                        const t = p.types||[];
                        const foodTypes = ["restaurant","food","cafe","bar","meal_takeaway","meal_delivery","bakery"];
                        const nonFood = ["store","lodging","clothing_store","electronics_store","furniture_store","home_goods_store","hardware_store","car_dealer","car_repair","gym","bank","hospital","school","gas_station"];
                        const isFood = foodTypes.some(ft => t.includes(ft));
                        const isNonFood = nonFood.some(nf => t.includes(nf));
                        return isFood && !isNonFood;
                      }).slice(0,5).map(p=>({label:(p.structured_formatting&&p.structured_formatting.main_text)||p.description.replace(', New Zealand',''),term:(p.structured_formatting&&p.structured_formatting.main_text)||p.description}));
                      setFindSuggestions(places);
                    } catch(e) { setFindSuggestions([]); }
                    setFindLoading(false);
                  }, 250);
                }}
                onFocus={()=>setSearchFieldFocused(true)}
                onBlur={()=>setTimeout(()=>setSearchFieldFocused(false),150)}
                onKeyDown={e => {
                  const list = findSuggestions;
                  if (e.key==='ArrowDown' && list.length) { e.preventDefault(); setFindHighlight(h=>Math.min(h+1,list.length-1)); }
                  else if (e.key==='ArrowUp' && list.length) { e.preventDefault(); setFindHighlight(h=>Math.max(h-1,-1)); }
                  else if (e.key==='Enter') {
                    if (findHighlight>=0 && list[findHighlight]) { const s=list[findHighlight]; setFindTerm(s.label); setFindSuggestions([]); setFindHighlight(-1); runSearch(s.term); }
                    else runSearch();
                  } else if (e.key==='Escape') { setFindSuggestions([]); setFindHighlight(-1); }
                }}
              />
              {findTerm && (
                <button onClick={()=>{setFindTerm("");setFindSuggestions([]);setResults([]);setSearched(false);setCuisineFilters([]);}} aria-label="Clear search" style={{background:"#eee",border:"none",borderRadius:"50%",width:24,height:24,minWidth:24,cursor:"pointer",color:"#888",fontSize:15,fontWeight:700,fontFamily:"inherit",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,padding:0}}>×</button>
              )}
              <button onClick={()=>runSearch()} style={{background:"#e83a2a",border:"none",borderRadius:10,padding:"9px 16px",cursor:"pointer",color:"#fff",fontWeight:700,fontSize:14,fontFamily:"inherit",flexShrink:0}}>{loading||locating?"…":"Search"}</button>
            </div>
            {/* LOCATION — always inline, no popout. GPS toggle + type-an-area input */}
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 8px 8px 12px",borderTop:"1px solid #f2ede8"}}>
              <button onClick={()=>{setNearMode("gps");localStorage.setItem("es_nearmode","gps");setCustomCoords(null);setLocationSearch(null);setLocationSuggestions([]);setSuburb("Near me");localStorage.setItem("es_suburb","Near me");}} style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,background:nearMode==="gps"?"#fdecea":"#f4f1ee",color:nearMode==="gps"?"#e83a2a":"#666",border:"1.5px solid",borderColor:nearMode==="gps"?"#e83a2a":"transparent",borderRadius:18,padding:"7px 12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>📍 Near me</button>
              <div style={{flex:1,position:"relative",minWidth:0}}>
                <input
                  placeholder={nearMode==="area" && suburb && suburb!=="Near me" ? (suburb!=="All Suburbs"?suburb+", "+city:city) : "or type a suburb…"}
                  style={{width:"100%",border:"none",outline:"none",fontSize:14,padding:"8px 4px",fontFamily:"inherit",boxSizing:"border-box",background:"transparent",color:"#444",fontWeight:600}}
                  value={locationSearch || ""}
                  onChange={e => {
                    const val = e.target.value; setLocationSearch(val);
                    const q = val.toLowerCase();
                    if (q.length < 1) { setLocationSuggestions([]); return; }
                    const cityM = cities.filter(c=>c.toLowerCase().includes(q)).slice(0,3).map(c=>({label:c,city:c,suburb:"All Suburbs",type:"city"}));
                    const subM = [];
                    for (const [cn, subs] of Object.entries(NZ_CITIES)) {
                      for (const s of subs) { if (s.toLowerCase().includes(q)) subM.push({label:s+", "+cn,city:cn,suburb:s,type:"suburb"}); }
                    }
                    setLocationSuggestions([...subM.slice(0,6), ...cityM].slice(0,7));
                  }}
                />
                {locationSuggestions.length > 0 && (
                  <div style={{position:"absolute",top:38,left:0,right:0,background:"#fff",borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,0.14)",zIndex:130,maxHeight:240,overflowY:"auto"}}>
                    {locationSuggestions.map((s,i)=>(
                      <div key={i} onMouseDown={()=>{
                        setNearMode("area"); localStorage.setItem("es_nearmode","area"); setCustomCoords(null);
                        if(s.type==="city"){ handleCityChange(s.city); setSuburb("All Suburbs"); localStorage.setItem("es_suburb","All Suburbs"); }
                        else { if(s.city && s.city!==city) handleCityChange(s.city); setSuburb(s.suburb); localStorage.setItem("es_suburb",s.suburb); }
                        setLocationSearch(null); setLocationSuggestions([]);
                      }} style={{padding:"12px 14px",cursor:"pointer",borderBottom:"1px solid #f5f5f5",fontSize:15,color:"#333",display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:13}}>{s.type==="city"?"🏙":"📍"}</span> {s.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* FIND autocomplete dropdown — loading, recent-on-focus, match-bolding, keyboard nav */}
            {(findLoading || findSuggestions.length > 0 || (searchFieldFocused && findTerm.length===0 && recentSearches.length>0)) && (
              <div style={{position:"absolute",top:46,left:0,right:0,background:"#fff",borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,0.14)",zIndex:120,maxHeight:280,overflowY:"auto",margin:"0 8px"}}>
                {/* Loading */}
                {findLoading && findSuggestions.length===0 && (
                  <div style={{padding:"12px 14px",fontSize:14,color:"#aaa",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{width:14,height:14,border:"2px solid #eee",borderTopColor:"#e83a2a",borderRadius:"50%",display:"inline-block",animation:"spin 0.6s linear infinite"}}></span> Searching…
                  </div>
                )}
                {/* No results */}
                {!findLoading && findTerm.length>2 && findSuggestions.length===0 && (
                  <div style={{padding:"12px 14px",fontSize:14,color:"#aaa"}}>No spots found — press Search to look anyway</div>
                )}
                {/* Recent searches (empty + focused) */}
                {findTerm.length===0 && searchFieldFocused && recentSearches.length>0 && findSuggestions.length===0 && (
                  <>
                    <div style={{padding:"9px 14px 4px",fontSize:10,fontWeight:700,color:"#bbb",letterSpacing:0.5}}>RECENT</div>
                    {recentSearches.slice(0,4).map((r,i)=>{
                      const label = (r.cuisines&&r.cuisines[0]) ? r.cuisines[0] : (r.suburb&&r.suburb!=="All Suburbs"?r.suburb:r.city);
                      return <div key={i} onMouseDown={()=>{applyRecent(r);setSearchFieldFocused(false);}} style={{padding:"11px 14px",cursor:"pointer",borderBottom:"1px solid #f5f5f5",fontSize:14,color:"#444",display:"flex",alignItems:"center",gap:8}}>🕘 {label}</div>;
                    })}
                  </>
                )}
                {/* Suggestions with match-bolding + keyboard highlight */}
                {findSuggestions.map((s,i)=>{
                  const q = findTerm.trim();
                  const idx = q ? s.label.toLowerCase().indexOf(q.toLowerCase()) : -1;
                  const labelEl = idx>=0
                    ? <span>{s.label.slice(0,idx)}<b style={{color:"#1a1a1a"}}>{s.label.slice(idx,idx+q.length)}</b>{s.label.slice(idx+q.length)}</span>
                    : <span>{s.label}</span>;
                  return (
                    <div key={i} onMouseDown={()=>{setFindTerm(s.label);setFindSuggestions([]);setFindHighlight(-1);runSearch(s.term);}}
                      onMouseEnter={()=>setFindHighlight(i)}
                      style={{padding:"11px 14px",cursor:"pointer",borderBottom:"1px solid #f5f5f5",fontSize:14,color:"#555",display:"flex",alignItems:"center",gap:8,background:findHighlight===i?"#fdf3f1":"transparent"}}>
                      <span style={{flexShrink:0}}>🍴</span> {labelEl}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* HERO EMPTY STATE */}
      {!searched && (
        <div style={{padding:"24px 16px 20px"}}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <div style={{fontSize:52,marginBottom:8}}>🍴</div>
            <div style={{fontWeight:800,fontSize:22,color:"#1a1a1a",marginBottom:6,lineHeight:1.25}}>Find food that fits your budget</div>
            <div style={{fontSize:14,color:"#888"}}>Great spots near you — by area, budget and type.</div>
          </div>

          {/* Trust signals */}
          <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginBottom:22}}>
            {["🇳🇿 Built in NZ","✓ Free to use","✓ No signup"].map(t=>(
              <span key={t} style={{fontSize:11,fontWeight:700,color:"#777",background:"#f4f1ee",borderRadius:20,padding:"5px 11px"}}>{t}</span>
            ))}
          </div>

          {/* How it works */}
          <div style={{background:"#fff",border:"1.5px solid #f0ebe6",borderRadius:16,padding:"14px 16px",marginBottom:24,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#bbb",letterSpacing:0.5,marginBottom:10}}>HOW IT WORKS</div>
            <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
              {[{n:"1",t:"Pick your area",e:"📍"},{n:"2",t:"Set your budget",e:"💰"},{n:"3",t:"Find your food",e:"🍴"}].map(s=>(
                <div key={s.n} style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:22,marginBottom:4}}>{s.e}</div>
                  <div style={{fontSize:12,fontWeight:700,color:"#444",lineHeight:1.3}}>{s.t}</div>
                </div>
              ))}
            </div>
          </div>

          {recentSearches.length > 0 && (
            <div style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,paddingLeft:4}}>
                <button onClick={()=>{const v=!recentCollapsed;setRecentCollapsed(v);localStorage.setItem("es_recent_collapsed",v?"1":"0");}} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",padding:0}}>
                  <span style={{fontSize:11,color:"#bbb",fontWeight:700,letterSpacing:0.5}}>RECENT SEARCHES</span>
                  <span style={{fontSize:10,color:"#bbb",transform:recentCollapsed?"rotate(-90deg)":"none",transition:"transform 0.15s"}}>▼</span>
                </button>
                <button onClick={()=>{setRecentSearches([]);localStorage.setItem("es_recent","[]");}} style={{background:"none",border:"none",color:"#e83a2a",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",padding:"2px 4px"}}>Clear</button>
              </div>
              {!recentCollapsed && (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {recentSearches.map((r,i) => (
                  <button key={i} onClick={()=>applyRecent(r)} style={{display:"flex",alignItems:"center",gap:10,background:"#fff",border:"1.5px solid #f0ebe6",borderRadius:14,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",width:"100%",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                    <span style={{fontSize:20}}>🕘</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:14,color:"#1a1a1a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.suburb && r.suburb !== "All Suburbs" ? r.suburb : r.city}{r.suburb && r.suburb !== "All Suburbs" ? ", " + r.city : ""}</div>
                      <div style={{fontSize:12,color:"#999",marginTop:2}}>{[...(r.cuisines||[]), r.price !== "Any" ? r.price : null].filter(Boolean).join(" · ") || "All food"}</div>
                    </div>
                    <span style={{color:"#e83a2a",fontSize:18,fontWeight:700}}>→</span>
                  </button>
                ))}
              </div>
              )}
            </div>
          )}

          <div>
            <div style={{fontSize:11,color:"#bbb",fontWeight:700,letterSpacing:0.5,marginBottom:10,paddingLeft:4}}>QUICK PICKS</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
              {[{e:"🐟",l:"Fish & Chips"},{e:"☕",l:"Cafe"},{e:"🍔",l:"Burgers"},{e:"🍕",l:"Pizza"},{e:"🍛",l:"Indian"},{e:"🍣",l:"Sushi"},{e:"🍜",l:"Chinese"},{e:"🥗",l:"Healthy"}].map(c=>(
                <button key={c.l} onClick={()=>{setFindTerm(c.l);runSearch(c.l);}} style={{display:"flex",alignItems:"center",gap:10,background:"#fff",border:"1.5px solid #f0ebe6",borderRadius:14,padding:"14px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14,color:"#1a1a1a",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                  <span style={{fontSize:24}}>{c.e}</span> {c.l}
                </button>
              ))}
            </div>
          </div>

          {/* Suggest a spot — gets users involved + gathers local data */}
          <button onClick={openSuggestSpot} style={{width:"100%",marginTop:20,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#fff",border:"1.5px dashed #e0d8d0",borderRadius:14,padding:"14px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14,color:"#777"}}>
            ➕ Know a great spot? Suggest it
          </button>
        </div>
      )}

      {/* RESULTS */}
      {loading && <div style={{textAlign:"center",padding:"40px 20px",color:"#888"}}>Searching...</div>}
      {error && <div style={{margin:"16px",padding:"14px 16px",background:"#fff3f3",border:"1.5px solid #f5c6c6",borderRadius:14,color:"#e83a2a",fontSize:14}}>{error}</div>}
      {!loading && searched && results.length === 0 && !error && <div style={{textAlign:"center",padding:"40px 20px",color:"#888"}}>No restaurants found near {suburb}. Try a nearby suburb.</div>}
      {!loading && results.length > 0 && (
        <>
          {/* count line — quiet */}
          <div style={{padding:"12px 16px 8px"}}>
            <span style={{fontSize:15,color:"#1a1a1a",fontWeight:800}}>{displayResults.length} <span style={{fontWeight:400,color:"#888",fontSize:13}}>{displayResults.length === 1 ? "spot" : "spots"}</span>{resultsCity ? <span style={{fontWeight:400,color:"#aaa",fontSize:12}}> · {resultsCity}</span> : null}</span>
          </div>

          {/* single scrollable filter chip row — the whole control surface, one line */}
          <div style={{display:"flex",gap:8,overflowX:"auto",padding:"0 16px 12px",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
            {/* Map toggle */}
            <button onClick={()=>setViewMode(viewMode==="map"?"list":"map")} style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,background:viewMode==="map"?"#e83a2a":"#1a1a1a",color:"#fff",border:"none",borderRadius:20,padding:"8px 14px",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{viewMode==="map"?"☰ List":"🗺 Map"}</button>

            {/* Cuisine chip (native select styled as chip) */}
            <div style={{flexShrink:0,position:"relative"}}>
              <select value={cuisineFilters[0] || ""} onChange={e => { const val=e.target.value; setCuisineFilters(val?[val]:[]); if(searched){setFindTerm(val);runSearch(val);} }}
                style={{appearance:"none",WebkitAppearance:"none",border:"1.5px solid",borderColor:cuisineFilters[0]?"#e83a2a":"#e8e1da",background:cuisineFilters[0]?"#fdecea":"#fff",color:cuisineFilters[0]?"#e83a2a":"#555",borderRadius:20,padding:"8px 30px 8px 14px",fontSize:13,fontWeight:700,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap",backgroundImage:"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'><path d='M3 5l3 3 3-3' stroke='%23999' stroke-width='1.5' fill='none'/></svg>\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center"}}>
                <option value="">🍽 Cuisine</option>
                {["Fish & Chips","Cafe","Burgers","Pizza","Indian","Sushi","Chinese","Thai","Japanese","Korean","Italian","Mexican","Vietnamese","Mediterranean","Seafood","Healthy"].map(c=>(<option key={c} value={c}>{c}</option>))}
              </select>
              {cuisineFilters[0] && <button onClick={()=>{setCuisineFilters([]);if(searched){setFindTerm("");runSearch("");}}} style={{position:"absolute",right:-4,top:-4,width:18,height:18,borderRadius:"50%",background:"#e83a2a",color:"#fff",border:"2px solid #faf9f7",fontSize:10,fontWeight:700,cursor:"pointer",lineHeight:1,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>}
            </div>

            {/* Budget chip */}
            <div style={{flexShrink:0,position:"relative"}}>
              <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
                style={{appearance:"none",WebkitAppearance:"none",border:"1.5px solid",borderColor:priceFilter!=="Any"?"#e83a2a":"#e8e1da",background:priceFilter!=="Any"?"#fdecea":"#fff",color:priceFilter!=="Any"?"#e83a2a":"#555",borderRadius:20,padding:"8px 30px 8px 14px",fontSize:13,fontWeight:700,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap",backgroundImage:"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'><path d='M3 5l3 3 3-3' stroke='%23999' stroke-width='1.5' fill='none'/></svg>\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center"}}>
                <option value="Any">💰 Budget</option>
                <option value="$">$ · Under $15</option>
                <option value="$$">$$ · $15–35</option>
                <option value="$$$">$$$ · $35–60</option>
                <option value="$$$$">$$$$ · $60+</option>
              </select>
              {priceFilter!=="Any" && <button onClick={()=>setPriceFilter("Any")} style={{position:"absolute",right:-4,top:-4,width:18,height:18,borderRadius:"50%",background:"#e83a2a",color:"#fff",border:"2px solid #faf9f7",fontSize:10,fontWeight:700,cursor:"pointer",lineHeight:1,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>}
            </div>

            {/* Sort chip */}
            <div style={{flexShrink:0,position:"relative"}}>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                style={{appearance:"none",WebkitAppearance:"none",border:"1.5px solid #e8e1da",background:"#fff",color:"#555",borderRadius:20,padding:"8px 30px 8px 14px",fontSize:13,fontWeight:700,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap",backgroundImage:"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'><path d='M3 5l3 3 3-3' stroke='%23999' stroke-width='1.5' fill='none'/></svg>\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center"}}>
                <option value="rating">↕ Top rated</option>
                <option value="nearest">↕ Nearest</option>
              </select>
            </div>

            {/* Open now toggle */}
            <button onClick={()=>setOpenNowOnly(v=>!v)} style={{flexShrink:0,background:openNowOnly?"#fdecea":"#fff",color:openNowOnly?"#e83a2a":"#555",border:"1.5px solid",borderColor:openNowOnly?"#e83a2a":"#e8e1da",borderRadius:20,padding:"8px 14px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>● Open now</button>
          </div>

          {viewMode==="map" && (activeTab==="search"||activeTab==="results") && (
            <div style={{padding:"0 16px 16px"}}>
              <MapView spots={displayResults.slice(0, resultLimit)} center={customCoords} onPick={()=>{}} />
            </div>
          )}
          {showInstallPrompt && (
            <div style={{margin:"0 16px 12px",background:"#fff9ee",border:"1.5px solid #ffd97d",borderRadius:14,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#a06000"}}>Add to home screen</div>
                <div style={{fontSize:11,color:"#888",marginTop:2}}>Works like an app — no download needed!</div>
              </div>
              <button onClick={() => { setShowInstallPrompt(false); localStorage.setItem("es_install_dismissed","1"); }} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#aaa",padding:"4px"}}>x</button>
            </div>
          )}

          {(activeTab === "search" || activeTab === "results") && cuisineFilters.length > 0 && displayResults.length === 0 && results.length > 0 && (
            <div style={{textAlign:"center",padding:"24px 20px",color:"#888",fontSize:14}}>
              No {cuisineFilters[0]} in these results.{" "}
              <button onClick={()=>{const c=cuisineFilters[0];setFindTerm(c);runSearch(c);}} style={{background:"none",border:"none",color:"#e83a2a",fontWeight:700,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline",fontSize:14}}>Search {cuisineFilters[0]} nearby</button>
            </div>
          )}
          {activeTab === "opennow" && openSpots.length === 0 && <div style={{textAlign:"center",padding:"30px 20px",color:"#888"}}>No open restaurants found nearby right now.</div>}
          {activeTab === "saved" && savedSpots.length === 0 && <div style={{textAlign:"center",padding:"30px 20px",color:"#888"}}>No saved spots yet — tap the Save button on any restaurant!</div>}
          {(activeTab === "search" || activeTab === "results") && openNowOnly && sortedResults.filter(r => r.isOpen && r.isOpen.includes("Open")).length === 0 && results.length > 0 && (
            <div style={{textAlign:"center",padding:"24px 20px",color:"#888"}}>None of these are open right now. <button onClick={()=>setOpenNowOnly(false)} style={{background:"none",border:"none",color:"#e83a2a",fontWeight:700,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline",fontSize:14}}>Show all</button></div>
          )}
          <div style={{display:viewMode==="map"&&(activeTab==="search"||activeTab==="results")?"none":"flex",flexDirection:"column",gap:10,padding:"0 16px"}}>
          {(activeTab === "opennow" ? openSpots : activeTab === "saved" ? savedSpots : (openNowOnly ? displayResults.filter(r => r.isOpen && r.isOpen.includes("Open")) : displayResults)).slice(0, resultLimit).map(spot => <SpotCard key={spot.id} spot={spot} />)}
          </div>
          {(activeTab === "search" || activeTab === "results") && (
            <button onClick={openSuggestSpot} style={{width:"calc(100% - 32px)",margin:"4px 16px 20px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#fff",border:"1.5px dashed #e0d8d0",borderRadius:14,padding:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:"#999"}}>
              Spot missing? ➕ Suggest it
            </button>
          )}
        </>
      )}
      {contactModal && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
          <div style={{background:"#fff",borderRadius:24,padding:"24px",width:"100%",maxWidth:420,boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
            {contactSuccess ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:48,marginBottom:12}}>Thanks!</div>
                <div style={{fontWeight:800,fontSize:20,color:"#27ae60"}}>Message sent!</div>
              </div>
            ) : (
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div style={{fontWeight:800,fontSize:18,color:"#1a1a1a"}}>Get in touch</div>
                  <button onClick={() => setContactModal(false)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#aaa"}}>x</button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <input value={contactForm.name} onChange={e => setContactForm(p => ({...p, name: e.target.value}))} placeholder="Your name" style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:12,padding:"12px 14px",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} />
                  <input value={contactForm.email} onChange={e => setContactForm(p => ({...p, email: e.target.value}))} placeholder="Your email" style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:12,padding:"12px 14px",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} />
                  <textarea value={contactForm.message} onChange={e => setContactForm(p => ({...p, message: e.target.value}))} placeholder="Tell us what's on your mind..." rows={4} style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:12,padding:"12px 14px",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",resize:"none"}} />
                  <button onClick={handleContactSubmit} disabled={contactSubmitting || !contactForm.message} style={{background:"#e83a2a",color:"#fff",border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity:contactSubmitting || !contactForm.message ? 0.6 : 1}}>{contactSubmitting ? "Sending..." : "Send message"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PRICE SUBMISSION MODAL */}
      {priceModal && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
          <div style={{background:"#fff",borderRadius:24,padding:"24px",width:"100%",maxWidth:420,boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
            {submitSuccess ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:48,marginBottom:12}}>🎉</div>
                <div style={{fontWeight:800,fontSize:20,color:"#27ae60"}}>Thanks!</div>
                <div style={{fontSize:14,color:"#888",marginTop:8}}>Your price has been submitted — you're helping Kiwis eat smart!</div>
              </div>
            ) : (
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div style={{fontWeight:800,fontSize:18,color:"#1a1a1a"}}>💰 Submit Real Price</div>
                  <button onClick={() => setPriceModal(null)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#aaa"}}>✕</button>
                </div>
                {priceModal.name && <div style={{background:"#faf9f7",borderRadius:12,padding:"10px 14px",marginBottom:16,fontWeight:600,fontSize:15,color:"#333"}}>🍽️ {priceModal.name}</div>}
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:"#555",display:"block",marginBottom:4}}>What did you order?</label>
                    <input value={priceForm.dish} onChange={e => setPriceForm(p => ({...p, dish: e.target.value}))} placeholder="e.g. 2 pieces fish + chips" style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:12,padding:"12px 14px",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} />
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:"#555",display:"block",marginBottom:4}}>How much did you pay?</label>
                    <div style={{display:"flex",alignItems:"center",border:"1.5px solid #ede8e3",borderRadius:12,overflow:"hidden",background:"#fff"}}>
                      <span style={{padding:"12px 14px",fontWeight:700,fontSize:18,color:"#e83a2a",background:"#fff5f4"}}>$</span>
                      <input type="number" value={priceForm.price} onChange={e => setPriceForm(p => ({...p, price: e.target.value}))} placeholder="14" style={{flex:1,border:"none",padding:"12px 14px",fontSize:15,fontFamily:"inherit",outline:"none"}} />
                    </div>
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:"#555",display:"block",marginBottom:4}}>Date visited</label>
                    <input type="date" value={priceForm.date} onChange={e => setPriceForm(p => ({...p, date: e.target.value}))} style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:12,padding:"12px 14px",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} />
                  </div>
                  <button onClick={handlePriceSubmit} disabled={submitting || !priceForm.dish || !priceForm.price} style={{background:"#e83a2a",color:"#fff",border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity: submitting || !priceForm.dish || !priceForm.price ? 0.6 : 1}}>
                    {submitting ? "Submitting…" : "Submit Price 🙌"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav style={S.bottomNav}>
        {[
          { id: "search", emoji: "🔍", label: "Search" },
          { id: "opennow", emoji: "🟢", label: "Open Now" },
          { id: "saved", emoji: "❤️", label: "Saved" },
          { id: "contact", emoji: "💬", label: "Feedback" },
        ].map(tab => (
          <button key={tab.id} style={{...S.navBtn, ...(activeTab === tab.id ? S.navBtnActive : {})}} onClick={() => handleTabPress(tab.id)}>
            <span style={{fontSize:22}}>{tab.emoji}</span>
            <span style={{fontSize:11,marginTop:2,fontWeight: activeTab === tab.id ? 700 : 600}}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const S = {
  page:{overflow:"hidden",minHeight:"100vh",fontFamily:"'Poppins',sans-serif",background:"#faf9f7",maxWidth:480,margin:"0 auto",paddingBottom:100,width:"100%"},
  header:{background:"#e83a2a",padding:"10px 16px 10px",position:"relative"},
  logo:{display:"flex",alignItems:"center",gap:2,marginBottom:6},
  logoEat:{fontWeight:900,fontSize:28,color:"#fff",letterSpacing:-1.2},
  logoSmart:{fontWeight:900,fontSize:28,color:"#ffd97d",letterSpacing:-1.2},
  logoIcon:{fontSize:28,marginLeft:6},
  tagline:{color:"rgba(255,255,255,0.9)",fontSize:15,margin:"4px 0 0",fontWeight:500},
  wave:{position:"absolute",bottom:-2,left:0,right:0,height:36,background:"#faf9f7",borderRadius:"50% 50% 0 0 / 100% 100% 0 0"},
  card:{background:"#fff",padding:"14px 16px",boxShadow:"none",display:"flex",flexDirection:"column",gap:10},
  selectedChip:{background:"#fff5f4",color:"#e83a2a",border:"1.5px solid #ffd5d0",borderRadius:20,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
  row:{display:"flex",gap:10,alignItems:"flex-start"},
  locateBtn:{flex:1,display:"flex",alignItems:"center",gap:8,background:"#fff5f4",border:"1.5px solid #ffd5d0",borderRadius:14,padding:"14px 16px",cursor:"pointer",fontSize:15},
  typeBtn:{background:"#fff",border:"1.5px solid #ede8e3",borderRadius:14,padding:"14px 18px",cursor:"pointer",fontSize:15,color:"#999",fontFamily:"inherit"},
  selectWrap:{flex:1,position:"relative"},
  select:{width:"100%",appearance:"none",border:"1.5px solid #ede8e3",borderRadius:14,padding:"13px 36px 13px 14px",fontSize:15,background:"#fff",fontFamily:"inherit",cursor:"pointer",color:"#222",outline:"none"},
  chevron:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"#aaa",fontSize:14},
  budgetWrap:{flex:1,display:"flex",alignItems:"center",border:"1.5px solid #ede8e3",borderRadius:14,padding:"0 14px",gap:4,background:"#fff"},
  budgetInput:{border:"none",outline:"none",fontSize:22,fontWeight:700,width:"100%",fontFamily:"inherit",color:"#222",background:"transparent"},
  cta:{background:"#e83a2a",color:"#fff",border:"none",borderRadius:16,padding:"18px",fontSize:17,fontWeight:700,fontFamily:"inherit",cursor:"pointer",letterSpacing:0.3,boxShadow:"0 4px 16px rgba(200,50,40,0.3)"},
  results:{padding:"24px 16px 0"},
  loadingWrap:{display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 0"},
  spinner:{width:36,height:36,border:"3px solid #f0e0de",borderTop:"3px solid #e83a2a",borderRadius:"50%",animation:"spin 0.8s linear infinite"},
  loadingText:{marginTop:14,color:"#888",fontSize:14},
  errorBox:{background:"#fff3f3",border:"1px solid #f5c6c6",borderRadius:12,padding:"16px",color:"#e83a2a",fontSize:14,marginBottom:12},
  emptyBox:{background:"#fff",borderRadius:16,padding:"28px 24px",textAlign:"center",color:"#aaa",fontSize:15,border:"1.5px dashed #ede8e3"},
  resultsHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8},
  resultsCount:{fontSize:17,color:"#222"},
  resultsLocation:{fontSize:13,color:"#888"},
  radiusBadge:{fontSize:12,color:"#aaa",marginBottom:16,paddingLeft:2},
  spotCard:{background:"#fff",borderRadius:16,padding:"12px 14px",marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"},
  spotTop:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12},
  spotLeft:{display:"flex",gap:10,alignItems:"flex-start"},
  spotEmoji:{fontSize:26,lineHeight:1},
  spotName:{fontWeight:700,fontSize:15,color:"#1a1a1a"},
  spotMeta:{fontSize:13,color:"#888",marginTop:2},
  spotDesc:{fontSize:13,color:"#777",margin:"0 0 10px"},
  tagRow:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14},
  tag:{background:"#f2f2f2",borderRadius:20,padding:"5px 12px",fontSize:12,color:"#555",fontWeight:500},
  actionRow:{display:"flex",gap:10},
  openBtn:{flex:1,background:"#f0faf4",border:"1.5px solid #a9dfbf",borderRadius:8,padding:"7px 4px",fontSize:11,fontWeight:700,color:"#27ae60",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"},
  saveBtn:{flex:1,background:"#fff5f4",border:"1.5px solid #ffd5d0",borderRadius:8,padding:"7px 4px",fontSize:11,fontWeight:700,color:"#e83a2a",cursor:"pointer",fontFamily:"inherit"},
  bottomNav:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid #f0ebe6",display:"flex",justifyContent:"space-around",padding:"8px 0 20px",zIndex:100,boxShadow:"0 -4px 20px rgba(200,50,40,0.08)"},
  navBtn:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",background:"none",border:"none",cursor:"pointer",color:"#6b6b6b",fontFamily:"inherit",padding:"4px 0",fontWeight:600},
  navBtnActive:{color:"#e83a2a"},
  perPerson:{fontSize:10,color:"#aaa",marginTop:3,textAlign:"center"},
};

const styleEl = document.createElement("style");
styleEl.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
document.head.appendChild(styleEl);
