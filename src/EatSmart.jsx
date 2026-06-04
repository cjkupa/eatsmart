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
  const addr = place.vicinity || null;
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

export default function EatSmart() {
  const cities = Object.keys(NZ_CITIES);
  const [city, setCity] = useState(() => localStorage.getItem("es_city") || "Auckland");
  const [suburb, setSuburb] = useState(() => localStorage.getItem("es_suburb") || "Remuera");
  const [cuisine, setCuisine] = useState("Any");
  const [priceFilter, setPriceFilter] = useState("Any");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [smartSearch, setSmartSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
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
    const newSuburb = NZ_CITIES[newCity][0];
    setSuburb(newSuburb);
    localStorage.setItem("es_city", newCity);
    localStorage.setItem("es_suburb", newSuburb);
    setSearched(false); setResults([]); setError(null);
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

  const handleSearch = useCallback(async () => {
    setLoading(true); setError(null); setSearched(true); setResults([]);
    try {
      let coords = customCoords;
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
      const radii = suburb === "All Suburbs" ? [5000, 8000] : isStreetSearch ? [300, 600, 1000] : [1500, 2500, 4000];
      if (suburb === "All Suburbs") setResultLimit(20);
      let spots = []; let usedRadius = 800;
      for (const r of radii) {
        const selectedCuisine = cuisineFilter || cuisine || "Any";
        const elements = await searchRestaurants(coords.lat, coords.lon, r, selectedCuisine); console.log("Elements:", elements.length, "radius:", r);
        spots = elements.map((el, i) => formatRestaurant(el, i)).filter(Boolean); console.log("Spots after filter:", spots.length);
        if (spots.length > 0) { usedRadius = r; break; }
      }
      setSearchRadius(usedRadius);
      const pLevel = priceFilter === "Any" ? null : ["$","$$","$$$","$$$$"].indexOf(priceFilter);
      const filteredByPrice = pLevel !== null
        ? spots.filter(s => pLevel === 0 ? (s.priceLevel === 0 || s.priceLevel === null) : s.priceLevel === pLevel)
        : spots;
      const toShow = filteredByPrice.length > 0 ? filteredByPrice : spots;
      const filteredOpen = openNowOnly ? toShow.filter(s => s.isOpen && s.isOpen.includes("Open")) : toShow;
      const sorted = [...filteredOpen].sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "nearest") {
          const distA = a.lat && a.lng ? Math.pow(a.lat - coords.lat, 2) + Math.pow(a.lng - coords.lon, 2) : Number.MAX_SAFE_INTEGER;
          const distB = b.lat && b.lng ? Math.pow(b.lat - coords.lat, 2) + Math.pow(b.lng - coords.lon, 2) : Number.MAX_SAFE_INTEGER;
          return distA - distB;
        }
        return 0;
      });
      setResults(sorted.slice(0, 30));
    } catch(e) { setError("Error: " + e.message); console.error(e); }
    setLoading(false);
  }, [suburb, city, customCoords, locationSearch, cuisine, cuisineFilter, priceFilter, sortBy, openNowOnly]);

  function toggleSave(id) { setSaved(prev => { const next = { ...prev, [id]: !prev[id] }; if (!next[id]) delete next[id]; localStorage.setItem("es_saved", JSON.stringify(next)); return next; }); }

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
    if (tabId === "search" || activeTab !== tabId) {
      setActiveTab(tabId);
      if (tabId === "search") window.scrollTo({top:0,behavior:"smooth"});
    } else {
      setActiveTab("search");
      window.scrollTo({top:0,behavior:"smooth"});
    }
  }

  const suburbs = NZ_CITIES[city] || [];
  const hasActiveFilters = Boolean(cuisineFilter) || priceFilter !== "Any" || openNowOnly;
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
  const savedSpots = results.filter(r => saved[r.id]);
  const topRatedSpots = [...results].filter(r => r.rating).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, resultLimit);

  const SpotCard = ({ spot }) => {
    const featured = getFeatured(spot.name);
    return (
      <div style={S.spotCard}>
        {spot.photoRef && <a href={"https://www.google.com/maps/search/"+encodeURIComponent(spot.name+" "+(spot.address||""))} target="_blank" rel="noopener noreferrer"><img src={`${API_BASE_URL}/api/photo?ref=${encodeURIComponent(spot.photoRef)}`} alt={spot.name} style={{width:"100%",height:90,objectFit:"cover",borderRadius:"16px 16px 0 0",display:"block",cursor:"pointer"}} onError={function(e){e.target.parentElement.style.display="none";}} /></a>}
        <div style={{padding:"14px 14px 8px"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{background:"#fff5f4",border:"1px solid #ffd5d0",borderRadius:8,padding:"3px 8px",fontSize:11,fontWeight:700,color:"#e83a2a",flexShrink:0,alignSelf:"flex-start",marginTop:2}}>{spot.cuisine.charAt(0).toUpperCase() + spot.cuisine.slice(1)}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <div style={{fontWeight:700,fontSize:15,color:"#1a1a1a"}}>{spot.name}</div>
                {featured && <span style={{background:"#ffd97d",color:"#7a4800",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:800,boxShadow:"0 2px 6px rgba(255,180,0,0.3)"}}>⭐ Featured</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginTop:2}}>
                {spot.rating && <span style={{fontWeight:800,fontSize:14,color:"#e67e22"}}>⭐ {spot.rating}</span>}
                {spot.ratingCount && <span style={{fontSize:12,color:"#bbb"}}>({spot.ratingCount})</span>}
                {spot.priceLevel !== null && spot.priceLevel !== undefined && <span style={{fontWeight:800,fontSize:14,color:"#27ae60"}}>{"$".repeat(spot.priceLevel + 1)}</span>}
                {spot.isOpen && <span style={{fontWeight:700,fontSize:12,background:spot.isOpen.includes("Open") ? "#f0faf4" : "#fff3f3",color:spot.isOpen.includes("Open") ? "#27ae60" : "#e83a2a",padding:"2px 8px",borderRadius:8}}>{spot.isOpen.includes("Open") ? "✅ Open" : "❌ Closed"}</span>}
              </div>
              {spot.address && <div style={{fontSize:12,color:"#999",marginTop:4,textAlign:"left"}}>{spot.address}</div>}
              {featured && featured.signatureDish && <div style={{fontSize:12,color:"#a06000",marginTop:4,fontWeight:600}}>{featured.signatureDish}</div>}
            </div>
          </div>
        </div>
        <div style={{...S.actionRow, padding:"8px 14px 12px"}}>
          {spot.website
            ? <a href={spot.website} target="_blank" rel="noopener noreferrer" style={{...S.openBtn,textDecoration:"none",textAlign:"center"}}>Website</a>
            : spot.phone
            ? <a href={"tel:"+spot.phone} style={{...S.openBtn,textDecoration:"none",textAlign:"center"}}>Call</a>
            : <button style={S.openBtn}>Looks good?</button>}
          <a href={"https://www.google.com/maps/search/" + encodeURIComponent(spot.name + " " + (spot.address || ""))} target="_blank" rel="noopener noreferrer" style={{...S.openBtn,textDecoration:"none",textAlign:"center",background:"#f0f7ff",border:"1.5px solid #bbd4f8",color:"#1a73e8"}}>Maps</a>
          <button style={S.saveBtn} onClick={() => setPriceModal(spot)}>Add price</button>
          <button style={{...S.saveBtn, background: saved[spot.id] ? "#fde8e8" : "#fef2f2"}} onClick={() => toggleSave(spot.id)}>{saved[spot.id] ? "🩷 Saved" : "🤍 Save"}</button>
        </div>
      </div>
    );
  };

  return (
    <div style={S.page}>
      {/* SEARCH SECTION */}
      <div ref={searchRef}>
        <header style={S.header}>
          <div style={S.logo}>
            <img src="/logo.png" alt="EatSmart" style={{width:44,height:44,borderRadius:11,marginRight:10,boxShadow:"0 3px 8px rgba(0,0,0,0.2)"}} />
            <div><span style={S.logoEat}>Eat</span><span style={S.logoSmart}>Smart</span></div>
          </div>
          <p style={S.tagline}>Eat out smarter near you</p>
          <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:"4px 0 0",textAlign:"center"}}>Restaurants, Cafes, Takeaways & more</p>
          <div style={S.wave} />
        </header>
        <div style={S.card}>
          <div style={{display:"flex",alignItems:"center",background:"#fff",border:"2px solid",borderColor:searchFocused?"#e83a2a":"#ede8e3",borderRadius:14,padding:"6px 6px 6px 12px",gap:6,minHeight:52,position:"relative"}}>
            {city && <button onMouseDown={e=>{e.preventDefault();}} style={{background:"#f5f5f5",border:"1px solid #ddd",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600,color:"#333",cursor:"default",whiteSpace:"nowrap",flexShrink:0}}>{city}</button>}
            {cuisineFilter && <button onMouseDown={e=>{e.preventDefault();setCuisineFilter("");}} style={{background:"#fff5f4",border:"1px solid #ffd5d0",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600,color:"#e83a2a",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{cuisineFilter} x</button>}
            <input
              style={{flex:1,border:"none",outline:"none",fontSize:15,fontFamily:"inherit",color:"#222",background:"transparent",minWidth:60}}
              placeholder={city ? "Suburb or street..." : "City, suburb, cuisine..."}
              value={locationSearch !== null ? locationSearch : (suburb && suburb !== "All Suburbs" ? suburb : "")}
              onFocus={() => { setSearchFocused(true); setLocationSearch(""); setLocationSuggestions([]); }}
              onBlur={() => { setTimeout(() => { setLocationSuggestions([]); setSearchFocused(false); if (locationSearch && locationSearch.length > 1) { setSuburb(locationSearch); localStorage.setItem("es_suburb", locationSearch); } setLocationSearch(null); }, 200); }}
              onChange={async e => {
                const val = e.target.value;
                setLocationSearch(val);
                const q = val.toLowerCase();
                const suburbMatches = (NZ_CITIES[city]||[]).filter(s=>s.toLowerCase().startsWith(q)).slice(0,4).map(s=>({label:s,city,suburb:s,type:"suburb"}));
                const cityMatches = cities.filter(c=>c.toLowerCase().startsWith(q)).slice(0,2).map(c=>({label:c,city:c,suburb:"All Suburbs",type:"city"}));
                if (val.length > 2) {
                  try {
                    const res = await fetch(API_BASE_URL + '/api/autocomplete?q=' + encodeURIComponent(val));
                    const data = await res.json();
                    const allSuburbs2 = Object.values(NZ_CITIES).flat().map(s=>s.toLowerCase());
                    const googleSuggestions = (data.predictions||[]).slice(0,4).map(p=>{
                      const label = p.description.replace(', New Zealand','');
                      const mainText = (p.structured_formatting&&p.structured_formatting.main_text)||'';
                      const types = p.types||[];
                      const isSuburb = types.includes("sublocality")||types.includes("locality")||types.includes("neighborhood")||allSuburbs2.includes(mainText.toLowerCase());
                      return {label,type:isSuburb?'suburb':'street',placeId:p.place_id,suburb:isSuburb?mainText:null};
                    });
                    setLocationSuggestions([...cityMatches,...suburbMatches,...googleSuggestions].slice(0,8));
                  } catch(e) { setLocationSuggestions([...cityMatches,...suburbMatches]); }
                } else {
                  setLocationSuggestions([...cityMatches,...suburbMatches]);
                }
              }}
              onKeyDown={e => { if (e.key==='Enter') { if (locationSearch) { setSuburb(locationSearch); localStorage.setItem("es_suburb",locationSearch); } handleSearch(); }}}
            />
            <button onMouseDown={e=>{e.preventDefault();if(locationSearch){setSuburb(locationSearch);localStorage.setItem("es_suburb",locationSearch);}handleSearch();}} style={{background:"#e83a2a",border:"none",borderRadius:10,padding:"10px 16px",cursor:"pointer",color:"#fff",fontWeight:700,fontSize:14,fontFamily:"inherit",flexShrink:0}}>{loading?"...":"Search"}</button>
            {locationSuggestions.length > 0 && (
              <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",zIndex:100,maxHeight:280,overflowY:"auto",marginTop:4,width:"100%",boxSizing:"border-box"}}>
                {locationSuggestions.map((s,i) => (
                  <div key={i} onMouseDown={async()=>{
                    setLocationSearch(null);
                    if(s.type==="city"){handleCityChange(s.city);setSuburb("All Suburbs");localStorage.setItem("es_suburb","All Suburbs");}
                    else if(s.type==="street"&&s.placeId){const r=await geocodePlace(s.placeId,city);if(r.length>0){setCustomCoords({lat:r[0].lat,lon:r[0].lon});setSuburb(r[0].suburb||s.label);localStorage.setItem("es_suburb",r[0].suburb||s.label);}}
                    else{if(s.city&&s.city!==city)handleCityChange(s.city);setSuburb(s.suburb||s.label);setCustomCoords(null);localStorage.setItem("es_suburb",s.suburb||s.label);}
                    setLocationSuggestions([]);setSearchFocused(false);
                  }} style={{padding:"10px 16px",cursor:"pointer",borderBottom:"1px solid #f5f5f5",fontSize:14,color:s.type==="street"?"#1a73e8":s.type==="city"?"#e83a2a":"#333",display:"flex",alignItems:"center",gap:8}}>
                    {s.type==="street"?"🛣️":s.type==="city"?"🏙️":"📍"} {s.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          {searchFocused && locationSuggestions.length === 0 && (
            <div style={{paddingTop:8}}>
              <div style={{fontSize:10,color:"#bbb",marginBottom:5,fontWeight:600}}>CITIES</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                {["Auckland","Wellington","Christchurch","Hamilton","Tauranga","Napier","Hastings","Whangarei","Dunedin"].map(c=>(
                  <button key={c} onMouseDown={e=>{e.preventDefault();handleCityChange(c);setSuburb("All Suburbs");setSearchFocused(false);}} style={{background:city===c?"#e83a2a":"#f5f5f5",color:city===c?"#fff":"#555",border:"none",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{c}</button>
                ))}
              </div>
              <div style={{fontSize:10,color:"#bbb",marginBottom:5,fontWeight:600}}>CUISINE</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                {[{e:"🐟",l:"Fish & Chips"},{e:"☕",l:"Cafe"},{e:"🍔",l:"Burgers"},{e:"🍕",l:"Pizza"},{e:"🍛",l:"Indian"},{e:"🍣",l:"Sushi"},{e:"🍜",l:"Chinese"},{e:"🥗",l:"Healthy"}].map(c=>(
                  <button key={c.l} onMouseDown={e=>{e.preventDefault();setCuisineFilter(cuisineFilter===c.l?"":c.l);setSearchFocused(false);}} style={{background:cuisineFilter===c.l?"#e83a2a":"#f5f5f5",color:cuisineFilter===c.l?"#fff":"#555",border:"none",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{c.e} {c.l}</button>
                ))}
              </div>
              <div style={{fontSize:10,color:"#bbb",marginBottom:5,fontWeight:600}}>BUDGET</div>
              <div style={{display:"flex",gap:5}}>
                {[{label:"Any",desc:"All"},{label:"$",desc:"<$15"},{label:"$$",desc:"$15-35"},{label:"$$$",desc:"$35-60"},{label:"$$$$",desc:">$60"}].map(p=>(
                  <button key={p.label} onMouseDown={e=>{e.preventDefault();setPriceFilter(p.label);}} style={{flex:1,background:priceFilter===p.label?"#d63020":"#f5f5f5",color:priceFilter===p.label?"#fff":"#555",border:"none",borderRadius:10,padding:"5px 0",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <span>{p.label}</span>
                    <span style={{fontSize:9,opacity:0.75}}>{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HERO EMPTY STATE */}
      {!searched && (
        <div style={{textAlign:"center",padding:"40px 32px 20px"}}>
          <div style={{fontSize:72,marginBottom:16}}>🍴</div>
          <div style={{fontWeight:800,fontSize:22,color:"#1a1a1a",marginBottom:6}}>Ready to eat?</div>
          <div style={{fontSize:14,color:"#888",marginBottom:8}}>Search by city, suburb or street and by budget</div>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:20,flexWrap:"wrap"}}>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {loading && <div style={{textAlign:"center",padding:"40px 20px",color:"#888"}}>Searching...</div>}
      {error && <div style={{margin:"16px",padding:"14px 16px",background:"#fff3f3",border:"1.5px solid #f5c6c6",borderRadius:14,color:"#e83a2a",fontSize:14}}>{error}</div>}
      {!loading && searched && results.length === 0 && !error && <div style={{textAlign:"center",padding:"40px 20px",color:"#888"}}>No restaurants found near {suburb}. Try a nearby suburb.</div>}
      {!loading && results.length > 0 && (
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px 8px"}}>
            <span style={{fontSize:17,color:"#1a1a1a",fontWeight:800}}>{results.length} <span style={{fontWeight:400,color:"#888",fontSize:14}}>spots near you</span></span>
            <div style={{display:"flex",gap:4}}>
              {["rating","nearest"].map(s => (
                <button key={s} onClick={() => setSortBy(s)} style={{background:sortBy===s?"#e83a2a":"#f5f5f5",color:sortBy===s?"#fff":"#888",border:"none",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  {s==="rating"?"Top rated":"Nearest"}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 16px 8px",fontSize:11,color:"#bbb"}}><span>Powered by Google Places</span><span>{openSpots.length} open now</span></div>
          {showInstallPrompt && (
            <div style={{margin:"0 16px 12px",background:"#fff9ee",border:"1.5px solid #ffd97d",borderRadius:14,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#a06000"}}>Add to home screen</div>
                <div style={{fontSize:11,color:"#888",marginTop:2}}>Works like an app — no download needed!</div>
              </div>
              <button onClick={() => { setShowInstallPrompt(false); localStorage.setItem("es_install_dismissed","1"); }} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#aaa",padding:"4px"}}>x</button>
            </div>
          )}

          {activeTab === "opennow" && openSpots.length === 0 && <div style={{textAlign:"center",padding:"30px 20px",color:"#888"}}>No open restaurants found nearby right now.</div>}
          {activeTab === "saved" && savedSpots.length === 0 && <div style={{textAlign:"center",padding:"30px 20px",color:"#888"}}>No saved spots yet — tap the Save button on any restaurant!</div>}
          <div style={{display:"flex",flexDirection:"column",gap:10,padding:"0 16px"}}>
          {(activeTab === "opennow" ? openSpots : activeTab === "saved" ? savedSpots : sortedResults).slice(0, resultLimit).map(spot => <SpotCard key={spot.id} spot={spot} />)}
          </div>
        </>
      )}
      {/* CONTACT MODAL */}
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
          { id: "search", emoji: "⌂", label: "Home" },
          { id: "opennow", emoji: "🟢", label: "Open Now" },
          { id: "saved", emoji: "♡", label: "Saved" },
          { id: "contact", emoji: "✎", label: "Feedback" },
        ].map(tab => (
          <button key={tab.id} style={{...S.navBtn, ...(activeTab === tab.id ? S.navBtnActive : {})}} onClick={() => handleTabPress(tab.id)}>
            <span style={{fontSize:22}}>{tab.emoji}</span>
            <span style={{fontSize:11,marginTop:2,fontWeight: activeTab === tab.id ? 700 : 400}}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const S = {
  page:{overflow:"hidden",minHeight:"100vh",fontFamily:"'Poppins',sans-serif",background:"#faf9f7",maxWidth:480,margin:"0 auto",paddingBottom:100,width:"100%"},
  header:{background:"#e83a2a",padding:"10px 16px 28px",position:"relative",overflow:"hidden"},
  logo:{display:"flex",alignItems:"center",gap:2,marginBottom:6},
  logoEat:{fontWeight:900,fontSize:36,color:"#fff",letterSpacing:-1.5},
  logoSmart:{fontWeight:900,fontSize:36,color:"#ffd97d",letterSpacing:-1.5},
  logoIcon:{fontSize:28,marginLeft:6},
  tagline:{color:"rgba(255,255,255,0.9)",fontSize:15,margin:"4px 0 0",fontWeight:500},
  wave:{position:"absolute",bottom:-2,left:0,right:0,height:36,background:"#faf9f7",borderRadius:"50% 50% 0 0 / 100% 100% 0 0"},
  card:{background:"#fff",borderRadius:24,margin:"0 16px",padding:"22px 18px",boxShadow:"0 8px 32px rgba(200,50,40,0.10)",marginTop:-18,position:"relative",zIndex:2,display:"flex",flexDirection:"column",gap:12},
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
  spotCard:{background:"#fff",borderRadius:16,padding:"12px 14px",marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",borderLeft:"4px solid #e83a2a"},
  spotTop:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12},
  spotLeft:{display:"flex",gap:10,alignItems:"flex-start"},
  spotEmoji:{fontSize:26,lineHeight:1},
  spotName:{fontWeight:700,fontSize:15,color:"#1a1a1a"},
  spotMeta:{fontSize:13,color:"#888",marginTop:2},
  spotDesc:{fontSize:13,color:"#777",margin:"0 0 10px"},
  tagRow:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14},
  tag:{background:"#f2f2f2",borderRadius:20,padding:"5px 12px",fontSize:12,color:"#555",fontWeight:500},
  actionRow:{display:"flex",gap:10},
  openBtn:{flex:1,background:"#f5f5f5",border:"none",borderRadius:8,padding:"7px 4px",fontSize:11,fontWeight:600,color:"#555",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"},
  saveBtn:{flex:1,border:"none",borderRadius:8,padding:"7px 4px",fontSize:11,fontWeight:600,color:"#e83a2a",cursor:"pointer",fontFamily:"inherit",background:"#fff5f4"},
  bottomNav:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid #f0ebe6",display:"flex",justifyContent:"space-around",padding:"8px 0 20px",zIndex:100,boxShadow:"0 -4px 20px rgba(200,50,40,0.08)"},
  navBtn:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",background:"none",border:"none",cursor:"pointer",color:"#aaa",fontFamily:"inherit",padding:"4px 0"},
  navBtnActive:{color:"#e83a2a"},
  perPerson:{fontSize:10,color:"#aaa",marginTop:3,textAlign:"center"},
};

const styleEl = document.createElement("style");
styleEl.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
document.head.appendChild(styleEl);
