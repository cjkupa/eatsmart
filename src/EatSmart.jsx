import { useState, useCallback, useEffect, useRef } from "react";
import { getFeatured } from "./featuredData.js";

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
  const queries = suburb === "All Suburbs"
    ? [city + ", New Zealand"]
    : [suburb + ", " + city + ", New Zealand", suburb + ", New Zealand", city + ", New Zealand"];
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

async function searchRestaurants(lat, lon, radiusMeters, cuisineType) {
  const url = `https://eatsmart-production-7bcf.up.railway.app/api/places?lat=${lat}&lng=${lon}&radius=${radiusMeters}&cuisine=${encodeURIComponent(cuisineType || "Any")}`;
  const res = await fetch(url);
  const data = await res.json();
  const places = data.results || [];
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
  const types = place.types || [];
  const excludedTypes = ["lodging","motel","hotel","motor_lodge","rv_park","campground","real_estate_agency","car_rental","gas_station","convenience_store","grocery_or_supermarket","supermarket","pharmacy","bank","atm","hospital","doctor","dentist"];
  const excludedNameWords = ["motel","motor lodge","motor inn","lodge","hotel","inn","backpacker","hostel","holiday park","caravan","accommodation","b&b","bed and breakfast","apartment","suites","bakery","patisserie","bread","cakes","countdown","new world","pak n save","supermarket","4 square","petrol","z energy","bp station","mobil"];
  const nameLower = (place.name || "").toLowerCase();
  if (types.some(t => excludedTypes.includes(t)) && !types.includes("restaurant")) return null;
  if (types.includes("bakery") && !types.includes("restaurant")) return null;
  if (types.includes("store") && !types.includes("restaurant") && !types.includes("food")) return null;
  if (excludedNameWords.some(w => nameLower.includes(w))) return null;
  const blacklist = ["meal delivery","delivery","bollywood","noodle canteen","motor lodge","motor inn","holiday inn","best western","supermarket","new world","countdown","pak n save","4 square","fresh choice","night n day","petrol","z energy","mobil","bp station"];
  if (blacklist.some(b => nameLower.includes(b))) return null;

  const name = place.name || "Unnamed Restaurant";
  const cuisine = types.length > 0 ? types[0].replace(/_/g, " ") : "restaurant";
  const addr = place.vicinity || null;
  const website = place.website || null;
  const phone = place.formatted_phone_number || null;
  const rating = place.rating || null;
  const ratingCount = place.user_ratings_total || null;
  const priceLevel = (place.price_level !== undefined && place.price_level !== null) ? place.price_level : null;
  const isOpen = place.opening_hours ? (place.opening_hours.open_now ? "✅ Open now" : "❌ Closed") : null;
  const photoRef = place.photoRef || place.photos?.[0]?.photo_reference || null; return { id: place.place_id || index, name, emoji: getCuisineEmoji(cuisine), cuisine, address: addr || null, phone, website, tags: [isOpen].filter(Boolean), isOpen, rating, ratingCount, priceLevel, rawTypes: types, photoRef };
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

async function geocodeAddress(query, city) {
  try {
    const url = "https://eatsmart-production-7bcf.up.railway.app/api/geocode?q=" + encodeURIComponent(query + " " + city);
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results.slice(0,5).map(r => ({
        label: r.formatted_address.replace(", New Zealand",""),
        lat: r.geometry.location.lat,
        lon: r.geometry.location.lng,
        suburb: r.address_components.find(c => c.types.includes("sublocality") || c.types.includes("neighborhood"))?.long_name || "",
        city: r.address_components.find(c => c.types.includes("locality"))?.long_name || city,
        type: "street"
      }));
    }
  } catch(e) {}
  return [];
}

export default function EatSmart() {
  const cities = Object.keys(NZ_CITIES);
  const [city, setCity] = useState(() => localStorage.getItem("es_city") || "Auckland");
  const [suburb, setSuburb] = useState(() => localStorage.getItem("es_suburb") || "Remuera");
  const [cuisine, setCuisine] = useState("Any");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [saved, setSaved] = useState({});
  const [locating, setLocating] = useState(false);
  const [searchRadius, setSearchRadius] = useState(800);
  const [typeMode, setTypeMode] = useState(false);
  const [locationSearch, setLocationSearch] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [citySearch, setCitySearch] = useState(null);
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

  const searchRef = useRef(null);
  const openNowRef = useRef(null);
  const savedRef = useRef(null);
  const topRatedRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
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
      if (!coords) {
        coords = await geocodeSuburb(suburb, city);
      }
      // If suburb geocoding failed, try the location search text as a street address
      if (!coords && locationSearch && locationSearch.length > 2) {
        const streetResults = await geocodeAddress(locationSearch, city);
        if (streetResults.length > 0) {
          coords = { lat: streetResults[0].lat, lon: streetResults[0].lon };
        }
      }
      // Also try the suburb field directly as an address if still no coords
      if (!coords) {
        const streetResults = await geocodeAddress(suburb + " " + city, "");
        if (streetResults.length > 0) {
          coords = { lat: streetResults[0].lat, lon: streetResults[0].lon };
        }
      }
      if (!coords) { setError("Couldn't find that location. Try a suburb name or street address."); setLoading(false); return; }
      setSearchCoords(coords);
      const radii = suburb === "All Suburbs" ? [5000, 8000] : [1500, 2500, 4000];
      if (suburb === "All Suburbs") setResultLimit(20);
      let spots = []; let usedRadius = 800;
      for (const r of radii) {
        const elements = await searchRestaurants(coords.lat, coords.lon, r, cuisine);
        spots = elements.map((el, i) => formatRestaurant(el, i)).filter(Boolean);
        if (spots.length > 0) { usedRadius = r; break; }
      }
      setSearchRadius(usedRadius);
      setResults(spots.slice(0, 20));
    } catch(e) { setError("Something went wrong. Please try again."); }
    setLoading(false);
  }, [suburb, city]);

  function toggleSave(id) { setSaved(prev => ({ ...prev, [id]: !prev[id] })); }

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
    setActiveTab(tabId);
    if (tabId === "search") {
      searchRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "opennow") {
      openNowRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "saved") {
      savedRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "contact") {
      setContactModal(true);
    }
  }

  const suburbs = NZ_CITIES[city] || [];
  const openSpots = results.filter(r => r.isOpen && r.isOpen.includes("Open"));
  const savedSpots = results.filter(r => saved[r.id]);
  const topRatedSpots = [...results].filter(r => r.rating).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, resultLimit);

  const SpotCard = ({ spot }) => {
    const featured = getFeatured(spot.name);
    return (
      <div style={S.spotCard}>
        {spot.photoRef && <img src={"https://eatsmart-production-7bcf.up.railway.app/api/photo?ref="+spot.photoRef} alt={spot.name} style={{width:"100%",height:150,objectFit:"cover",borderRadius:"16px 16px 0 0"}} onError={function(e){e.target.style.display="none";}} />}
        <div style={{padding:"14px 14px 8px"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{width:50,height:50,borderRadius:10,background:"#e83a2a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:26}}>{spot.emoji}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <div style={{fontWeight:700,fontSize:15,color:"#1a1a1a"}}>{spot.name}</div>
                {featured && <span style={{background:"#ffd97d",color:"#a06000",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700}}>Featured</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#888",flexWrap:"wrap"}}>
                {spot.rating && <span style={{fontWeight:700,color:"#e67e22"}}>{spot.rating} stars</span>}
                {spot.ratingCount && <span>({spot.ratingCount})</span>}
                <span style={{color:"#ccc"}}>|</span>
                <span>{spot.cuisine.charAt(0).toUpperCase() + spot.cuisine.slice(1)}</span>
                {spot.isOpen && <span style={{color:"#ccc"}}>|</span>}
                {spot.isOpen && <span style={{fontWeight:600,color:spot.isOpen.includes("Open") ? "#27ae60" : "#e83a2a"}}>{spot.isOpen}</span>}
              </div>
              {spot.address && <div style={{fontSize:12,color:"#999",marginTop:4}}>{spot.address}</div>}
              {featured && featured.signatureDish && <div style={{fontSize:12,color:"#a06000",marginTop:4,fontWeight:600}}>{featured.signatureDish}</div>}
            </div>
          </div>
        </div>
        <div style={{...S.actionRow, padding:"8px 14px 12px"}}>
          {spot.website
            ? <a href={spot.website} target="_blank" rel="noopener noreferrer" style={{...S.openBtn,textDecoration:"none",textAlign:"center"}}>🌐 Website</a>
            : spot.phone
            ? <a href={"tel:"+spot.phone} style={{...S.openBtn,textDecoration:"none",textAlign:"center"}}>📞 Call</a>
            : <button style={S.openBtn}>👍 Looks good?</button>}
          <a href={"https://www.google.com/maps/search/" + encodeURIComponent(spot.name + " " + (spot.address || ""))} target="_blank" rel="noopener noreferrer" style={{...S.openBtn,textDecoration:"none",textAlign:"center",background:"#f0f7ff",color:"#1a73e8"}}>🗺️ Maps</a>
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
            <img src="/logo.png" alt="EatSmart" style={{width:48,height:48,borderRadius:12,marginRight:10,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}} />
            <div><span style={S.logoEat}>Eat</span><span style={S.logoSmart}>Smart</span></div>
          </div>
          <p style={S.tagline}>Find great local restaurants near you</p>
          <div style={S.wave} />
        </header>
        <div style={S.card}>


          <div style={S.row}>
            <div style={{flex:1,position:"relative"}}>
              <input
                style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:14,padding:"13px 14px",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",background:"#fff",color:"#222",textAlign:"left"}}
                placeholder="Search city..."
                value={citySearch !== null ? citySearch : city}
                onChange={e => {
                  setCitySearch(e.target.value);
                  const q = e.target.value.toLowerCase();
                  setCitySuggestions(q.length > 0 ? cities.filter(c => c.toLowerCase().startsWith(q)).slice(0,8) : []);
                }}
                onFocus={() => { setCitySearch(""); setCitySuggestions([]); }}
                onBlur={() => setTimeout(() => setCitySuggestions([]), 200)}
              />
              {citySuggestions.length > 0 && (
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",zIndex:100,maxHeight:240,overflowY:"auto",marginTop:4,width:"100%",boxSizing:"border-box"}}>
                  {citySuggestions.map((c,i) => (
                    <div key={i} onMouseDown={() => { handleCityChange(c); setCitySearch(null); setCitySuggestions([]); }} style={{padding:"11px 16px",cursor:"pointer",borderBottom:"1px solid #f5f5f5",fontSize:14,color:"#333",textAlign:"left"}}>
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{flex:1,position:"relative"}}>
              <input
                style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:14,padding:"13px 14px 13px 14px",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",background:"#fff",color:"#222",textAlign:"left"}}
                placeholder="Suburb or street address..."
                value={locationSearch !== null ? locationSearch : suburb}
                onChange={e => {
                  const val = e.target.value;
                  setLocationSearch(val);
                  const q = val.toLowerCase();
                  const suburbMatches = (NZ_CITIES[city] || []).filter(s => s.toLowerCase().startsWith(q)).slice(0,10);
                  setLocationSuggestions(suburbMatches.map(s => ({label:s, city, suburb:s, type:"suburb"})));
                }}
                onFocus={() => { setLocationSearch(""); setLocationSuggestions([]); }}
                onBlur={() => setTimeout(() => setLocationSuggestions([]), 200)}
              />
              {locationSuggestions.length > 0 && (
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",zIndex:100,maxHeight:240,overflowY:"auto",marginTop:4}}>
                  <div onMouseDown={() => { setSuburb("All Suburbs"); localStorage.setItem("es_suburb","All Suburbs"); setLocationSearch(null); setLocationSuggestions([]); setSearched(false); }} style={{padding:"11px 16px",cursor:"pointer",borderBottom:"1px solid #f5f5f5",fontSize:14,color:"#e83a2a",fontWeight:600,textAlign:"left"}}>
                    📍 All Suburbs in {city}
                  </div>
                  {streetSearching && <div style={{padding:"11px 16px",fontSize:13,color:"#aaa"}}>Searching streets...</div>}
                  {locationSuggestions.map((s,i) => (
                    <div key={i} onMouseDown={() => {
                      if (s.type === "street") {
                        setCustomCoords({lat: s.lat, lon: s.lon});
                        setLocationSearch(s.label);
                        setLocationSuggestions([]);
                        setSearched(false);
                        setResults([]);
                      } else {
                        setSuburb(s.suburb);
                        setCustomCoords(null);
                        localStorage.setItem("es_suburb",s.suburb);
                        setLocationSearch(null);
                        setLocationSuggestions([]);
                        setSearched(false);
                        setResults([]);
                      }
                    }} style={{padding:"11px 16px",cursor:"pointer",borderBottom:"1px solid #f5f5f5",fontSize:14,color:"#333",textAlign:"left"}}>
                      {s.type === "street" ? "🗺️ " : "📍 "}{s.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={S.row}>
            
  
          </div>
          <button style={{...S.cta, opacity: loading ? 0.7 : 1}} onClick={handleSearch} disabled={loading}>{loading ? "Searching…" : "Find somewhere to eat →"}</button>
        </div>
      </div>

      {/* HERO EMPTY STATE */}
      {!searched && (
        <div style={{textAlign:"center",padding:"40px 32px 20px"}}>
          <div style={{fontSize:72,marginBottom:16}}>🍽️</div>
          <div style={{fontWeight:800,fontSize:22,color:"#1a1a1a",marginBottom:8}}>Find great food near you</div>
          <div style={{fontSize:14,color:"#aaa",lineHeight:1.6}}>Pick your suburb and discover cafes, restaurants, takeaways and more nearby.</div>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:20,flexWrap:"wrap"}}>
            {["🐟 Fish & Chips","☕ Cafe","🍔 Burgers","🍕 Pizza","🍛 Indian"].map(c => (
              <span key={c} style={{background:"#fff",border:"1.5px solid #ede8e3",borderRadius:20,padding:"8px 16px",fontSize:13,fontWeight:500,color:"#555",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH RESULTS */}
      {searched && (
        <div style={S.results}>
          {loading && <div style={S.loadingWrap}><div style={S.spinner}/><p style={S.loadingText}>Finding restaurants in {suburb}, {city}…</p></div>}
          {error && <div style={S.errorBox}>⚠️ {error}</div>}
          {!loading && !error && results.length === 0 && <div style={S.emptyBox}>😕 No restaurants found near {suburb}. Try a nearby suburb.</div>}
          {!loading && results.length > 0 && <>
            <div style={S.resultsHeader}><span style={S.resultsCount}><strong>{results.length} spots</strong> near you</span><span style={S.resultsLocation}>📍 {suburb}, {city}</span></div>
            <div style={S.radiusBadge}>🔍 Within {searchRadius >= 1000 ? (searchRadius/1000).toFixed(1)+"km" : searchRadius+"m"} of {suburb}</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <span style={{fontSize:13,color:"#888"}}>Show:</span>
              {[5,10,20].map(n => (
                <button key={n} onClick={() => setResultLimit(n)} style={{background: resultLimit===n ? "#e83a2a" : "#fff", color: resultLimit===n ? "#fff" : "#888", border:"1.5px solid", borderColor: resultLimit===n ? "#e83a2a" : "#ede8e3", borderRadius:20, padding:"4px 14px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit"}}>{n}</button>
              ))}
            </div>
          </>}
          {!loading && results.slice(0, resultLimit).map(spot => <SpotCard key={spot.id} spot={spot} />)}
          {!loading && results.length > resultLimit && (
            <div style={{textAlign:"center",padding:"8px 0 16px"}}>
              <button onClick={() => setResultLimit(r => Math.min(r + 5, 20))} style={{background:"#fff",border:"1.5px solid #ede8e3",borderRadius:20,padding:"10px 24px",fontSize:14,fontWeight:600,color:"#e83a2a",cursor:"pointer",fontFamily:"inherit"}}>Show more results ↓</button>
            </div>
          )}
        </div>
      )}

      {/* OPEN NOW SECTION */}
      <div ref={openNowRef} style={{...S.results, paddingTop:24, borderTop:"2px solid #f0ebe6", marginTop:8, display: activeTab === "opennow" ? "block" : "none"}}>
        <div style={{fontWeight:800,fontSize:20,color:"#1a1a1a",marginBottom:4}}>🕐 Open Right Now</div>
        <div style={{fontSize:13,color:"#aaa",marginBottom:16}}>{suburb}, {city}</div>
        {!searched
          ? <div style={S.emptyBox}>🔍 Do a search first to see what's open!</div>
          : openSpots.length === 0
          ? <div style={S.emptyBox}>😕 No confirmed open places in your last search.</div>
          : openSpots.map(spot => <SpotCard key={spot.id} spot={spot} />)
        }
      </div>

      {/* SAVED SECTION */}
      <div ref={savedRef} style={{...S.results, paddingTop:24, borderTop:"2px solid #f0ebe6", marginTop:8, display: activeTab === "saved" ? "block" : "none"}}>
        <div style={{fontWeight:800,fontSize:20,color:"#1a1a1a",marginBottom:16}}>❤️ Saved Places</div>
        {savedSpots.length === 0
          ? <div style={S.emptyBox}>Heart a restaurant to save it here!</div>
          : savedSpots.map(spot => <SpotCard key={spot.id} spot={spot} />)
        }
      </div>



      {/* FOOTER */}
      <div style={{textAlign:"center",padding:"24px 16px 8px",borderTop:"1px solid #f0ebe6",marginTop:16}}>

        <div style={{background:"#f8f8f8",border:"1.5px solid #ede8e3",borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:14,fontWeight:700,color:"#333",margin:"0 0 4px"}}>✉️ Missing a restaurant?</p>
          <p style={{fontSize:12,color:"#888",margin:"0 0 10px"}}>Let us know and we'll get it added!</p>
          <a href="mailto:eatsmartapp@gmail.com" style={{display:"inline-block",background:"#333",color:"#fff",borderRadius:20,padding:"8px 20px",fontSize:13,fontWeight:700,textDecoration:"none"}}>Get in touch →</a>
        </div>
        <p style={{fontSize:11,color:"#ccc",marginTop:12}}>© 2025 EatSmart NZ · eatsmart.co.nz</p>
      </div>

      {/* CONTACT MODAL */}
      {contactModal && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
          <div style={{background:"#fff",borderRadius:24,padding:"24px",width:"100%",maxWidth:420,boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
            {contactSuccess ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:48,marginBottom:12}}>🙌</div>
                <div style={{fontWeight:800,fontSize:20,color:"#27ae60"}}>Message sent!</div>
                <div style={{fontSize:14,color:"#888",marginTop:8}}>Thanks for getting in touch — we'll get back to you soon!</div>
              </div>
            ) : (
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div style={{fontWeight:800,fontSize:18,color:"#1a1a1a"}}>✉️ Get in Touch</div>
                  <button onClick={() => { setContactModal(false); setActiveTab("search"); }} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#aaa"}}>✕</button>
                </div>
                <p style={{fontSize:13,color:"#888",marginBottom:16}}>Missing a restaurant? Found a bug? Have an idea? We'd love to hear from you!</p>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:"#555",display:"block",marginBottom:4}}>Your name (optional)</label>
                    <input value={contactForm.name} onChange={e => setContactForm(p => ({...p, name: e.target.value}))} placeholder="e.g. Sarah" style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:12,padding:"12px 14px",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} />
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:"#555",display:"block",marginBottom:4}}>Your email (optional)</label>
                    <input type="email" value={contactForm.email} onChange={e => setContactForm(p => ({...p, email: e.target.value}))} placeholder="so we can reply to you" style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:12,padding:"12px 14px",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} />
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:"#555",display:"block",marginBottom:4}}>Message</label>
                    <textarea value={contactForm.message} onChange={e => setContactForm(p => ({...p, message: e.target.value}))} placeholder="Tell us what's on your mind..." rows={4} style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:12,padding:"12px 14px",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",resize:"none"}} />
                  </div>
                  <button onClick={handleContactSubmit} disabled={contactSubmitting || !contactForm.message} style={{background:"#e83a2a",color:"#fff",border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity: contactSubmitting || !contactForm.message ? 0.6 : 1}}>
                    {contactSubmitting ? "Sending…" : "Send Message 🙌"}
                  </button>
                  <a href="mailto:eatsmartappnz@gmail.com" style={{textAlign:"center",fontSize:13,color:"#aaa",textDecoration:"none"}}>or email us at eatsmartappnz@gmail.com</a>
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
          { id: "search", emoji: "🏠", label: "Home" },
          { id: "opennow", emoji: "🕐", label: "Open Now" },
          { id: "saved", emoji: "❤️", label: "Saved" },
          { id: "contact", emoji: "✉️", label: "Contact" },
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
  page:{overflowX:"hidden",fontFamily:"'Poppins',sans-serif",background:"#faf9f7",minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:100},
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
  openBtn:{flex:1,background:"#f0faf4",border:"none",borderRadius:10,padding:"9px",fontSize:13,fontWeight:600,color:"#27ae60",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"},
  saveBtn:{flex:1,border:"none",borderRadius:10,padding:"9px",fontSize:13,fontWeight:600,color:"#e83a2a",cursor:"pointer",fontFamily:"inherit"},
  bottomNav:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid #f0ebe6",display:"flex",justifyContent:"space-around",padding:"8px 0 20px",zIndex:100,boxShadow:"0 -4px 20px rgba(200,50,40,0.08)"},
  navBtn:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",background:"none",border:"none",cursor:"pointer",color:"#aaa",fontFamily:"inherit",padding:"4px 0"},
  navBtnActive:{color:"#e83a2a"},
  perPerson:{fontSize:10,color:"#aaa",marginTop:3,textAlign:"center"},
};

const styleEl = document.createElement("style");
styleEl.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
document.head.appendChild(styleEl);
