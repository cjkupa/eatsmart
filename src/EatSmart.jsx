import { useState, useCallback, useEffect, useRef } from "react";
import { getMealSuggestion } from "./mealData.js";

const NZ_CITIES = {
  "Auckland": ["Albany","Avondale","Balmoral","Beachlands","Birkenhead","Blockhouse Bay","Botany Downs","Browns Bay","Clevedon","Devonport","East Tamaki","Eden Terrace","Ellerslie","Epsom","Flat Bush","Forrest Hill","Freemans Bay","Glen Eden","Glen Innes","Glendowie","Glenfield","Grey Lynn","Half Moon Bay","Henderson","Herne Bay","Hillsborough","Hobsonville","Howick","Kingsland","Kohimarama","Kumeu","Lynfield","Manukau","Manurewa","Massey","Mission Bay","Morningside","Mount Albert","Mount Eden","Mount Roskill","Mount Wellington","Newmarket","Newton","New Lynn","Northcote","Onehunga","Orewa","Pakuranga","Panmure","Papakura","Parnell","Papatoetoe","Penrose","Point Chevalier","Ponsonby","Pukekohe","Remuera","Royal Oak","Sandringham","Silverdale","St Heliers","St Johns","St Lukes","Takapuna","Titirangi","Wairau Valley","Warkworth","Waterview","Wellsford","Westgate","Westmere","Whangaparaoa"],
  "Wellington": ["Aro Valley","Berhampore","Brooklyn","Churton Park","Crofton Downs","Glenside","Hataitai","Highbury","Houghton Bay","Island Bay","Johnsonville","Karori","Kelburn","Kilbirnie","Khandallah","Lambton","Lyall Bay","Miramar","Mornington","Mount Cook","Mount Victoria","Newlands","Newtown","Ngaio","Northland","Oriental Bay","Owhiro Bay","Petone","Porirua","Roseneath","Seatoun","Strathmore Park","Tawa","Te Aro","Thorndon","Upper Hutt","Wadestown","Waterloo","Wilton","Woodridge"],
  "Christchurch": ["Addington","Aranui","Avonhead","Beckenham","Belfast","Bishopdale","Bryndwr","Burnside","Cashmere","Cathedral Square","Christchurch Central","Edgeware","Ferrymead","Fendalton","Halswell","Harewood","Heathcote","Hillmorton","Hornby","Ilam","Islington","Linwood","Lyttelton","Merivale","New Brighton","Northcote","Papanui","Parklands","Phillipstown","Prebbleton","Rangiora","Redcliffs","Riccarton","Rolleston","Russley","Shirley","Sockburn","Spreydon","St Albans","St Martins","Sumner","Sydenham","Templeton","Upper Riccarton","Waltham","Woolston"],
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
  "Taupo": ["Acacia Bay","Broadlands","Hilltop","Kinloch","Lake Terrace","Mangakino","Nukuhau","Rangatira Park","Richmond Heights","Taupo Central","Tauhara","Turangi","Wairakei","Waitahanui"],
  "Queenstown": ["Arrowtown","Arthurs Point","Closeburn","Dalefield","Fernhill","Frankton","Glenorchy","Hanley's Farm","Jack's Point","Lake Hayes","Lake Hayes Estate","Queenstown Central","Remarkables Park","Sunshine Bay","Wanaka"],
  "Blenheim": ["Awatere Valley","Blenheim Central","Grovetown","Mayfield","Omaka","Rapaura","Renwick","Spring Creek","Springlands","Witherlea","Woodbourne"],
  "Timaru": ["Gleniti","Highfield","Kingsdown","Marchwiel","Parkside","Seaview","Smithfield","Timaru Central","Waimataitai","Watlington"],
  "Gore": ["Charlton","Gore Central","Knapdale","Lorneville","Mataura","Pukerau","Riversdale","Waikaka"],
  "Masterton": ["Colombo","Kuripuni","Lansdowne","Masterton Central","Opaki","Solway","Te Ore Ore","Tararua"],
  "Levin": ["Kimberley","Levin Central","Ohau","Otaki","Shannon","Tokomaru","Waitarere Beach"],
  "Pukekohe": ["Bombay","Buckland","Karaka","Paerata","Patumahoe","Pukekohe Central","Tuakau","Waiuku"],
  "Kerikeri": ["Haruru","Kerikeri Central","Kaikohe","Kawakawa","Paihia","Russell","Waipapa","Waitangi"],
  "Dargaville": ["Dargaville Central","Awakino Point","Baylys Beach","Donnellys Crossing","Maropiu","Matakohe","Ruawai","Tinopai"],
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

async function searchRestaurants(lat, lon, radiusMeters) {
  const url = `https://eatsmart-production-7bcf.up.railway.app/api/places?lat=${lat}&lng=${lon}&radius=${radiusMeters}`;
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
  const name = place.name || "Unnamed Restaurant";
  const types = place.types || [];
  const cuisine = types.length > 0 ? types[0].replace(/_/g, " ") : "restaurant";
  const addr = place.vicinity || null;
  const website = place.website || null;
  const phone = place.formatted_phone_number || null;
  const rating = place.rating || null;
  const ratingCount = place.user_ratings_total || null;
  const priceLevel = (place.price_level !== undefined && place.price_level !== null) ? place.price_level : null;
  const isOpen = place.opening_hours ? (place.opening_hours.open_now ? "✅ Open now" : "❌ Closed") : null;
  return { id: place.place_id || index, name, emoji: getCuisineEmoji(cuisine), cuisine, address: addr || null, phone, website, tags: [isOpen].filter(Boolean), isOpen, rating, ratingCount, priceLevel };
}

export default function EatSmart() {
  const cities = Object.keys(NZ_CITIES);
  const [budget, setBudget] = useState(() => Number(localStorage.getItem("es_budget")) || 30);
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
  const [typeInput, setTypeInput] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [resultLimit, setResultLimit] = useState(5);

  const searchRef = useRef(null);
  const openNowRef = useRef(null);
  const savedRef = useRef(null);
  const topRatedRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
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
      const coords = await geocodeSuburb(suburb, city);
      if (!coords) { setError("Couldn't find " + suburb + ", " + city + ". Try a nearby suburb."); setLoading(false); return; }
      const radii = suburb === "All Suburbs" ? [3000, 5000] : [800, 1500, 2500];
      let spots = []; let usedRadius = 800;
      for (const r of radii) {
        const elements = await searchRestaurants(coords.lat, coords.lon, r);
        spots = elements.map((el, i) => formatRestaurant(el, i));
        if (spots.length > 0) { usedRadius = r; break; }
      }
      setSearchRadius(usedRadius);
      setResults(spots.slice(0, 20));
    } catch(e) { setError("Something went wrong. Please try again."); }
    setLoading(false);
  }, [suburb, city]);

  function toggleSave(id) { setSaved(prev => ({ ...prev, [id]: !prev[id] })); }

  function handleTabPress(tabId) {
    setActiveTab(tabId);
    if (tabId === "search") {
      searchRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "opennow") {
      openNowRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "saved") {
      savedRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "toprated") {
      topRatedRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const suburbs = NZ_CITIES[city] || [];
  const openSpots = results.filter(r => r.isOpen && r.isOpen.includes("Open"));
  const savedSpots = results.filter(r => saved[r.id]);
  const topRatedSpots = [...results].filter(r => r.rating).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, resultLimit);

  const SpotCard = ({ spot }) => {
    const meal = getMealSuggestion(spot.cuisine, budget);
    return (
      <div style={S.spotCard}>
        <div style={S.spotTop}>
          <div style={S.spotLeft}>
            <span style={S.spotEmoji}>{spot.emoji}</span>
            <div>
              <div style={S.spotName}>{spot.name}</div>
              <div style={S.spotMeta}>{spot.cuisine.charAt(0).toUpperCase() + spot.cuisine.slice(1)}</div>
              <div style={{display:"flex",gap:8,marginTop:4,alignItems:"center",flexWrap:"wrap"}}>
                {spot.rating && <span style={{fontSize:13,fontWeight:600,color:"#f39c12"}}>⭐ {spot.rating}{spot.ratingCount ? <span style={{fontWeight:400,color:"#aaa",fontSize:11}}> ({spot.ratingCount})</span> : ""}</span>}
                {spot.priceLevel !== null && spot.priceLevel !== undefined && <span style={{fontSize:13,fontWeight:700,color:"#27ae60"}}>{"$".repeat(spot.priceLevel + 1)}</span>}
                {spot.isOpen && <span style={{fontSize:11,fontWeight:600,color: spot.isOpen.includes("Open") ? "#27ae60" : "#e83a2a"}}>{spot.isOpen}</span>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <span style={{background:"#e83a2a",color:"#fff",borderRadius:10,padding:"4px 10px",fontWeight:900,fontSize:18}}>${budget}</span>
            <span style={{fontSize:10,color:"#aaa"}}>budget</span>
          </div>
        </div>
        {meal.canAfford ? (
          <div style={{background:"#eafaf1",border:"1px solid #a9dfbf",borderRadius:12,padding:"8px 12px",marginBottom:10}}>
            <div style={{fontWeight:700,fontSize:14,color:"#27ae60"}}>{meal.emoji} {meal.dish}</div>
            <div style={{fontSize:12,color:"#888",marginTop:2}}>Est. price: {meal.typical} · <a href="https://docs.google.com/forms/d/e/1FAIpQLSfAJiZq0I82rrrJ2VEz9ziTjMqADIbPgmoc_Ahqi_QnPyoPrg/viewform" target="_blank" rel="noopener noreferrer" style={{color:"#e83a2a",textDecoration:"none",fontWeight:600}}>Submit real price</a></div>
          </div>
        ) : (
          <div style={{background:"#fff3f3",border:"1px solid #f5c6c6",borderRadius:12,padding:"8px 12px",marginBottom:10}}>
            <div style={{fontWeight:700,fontSize:14,color:"#e83a2a"}}>⚠️ Tight budget here</div>
            <div style={{fontSize:12,color:"#888",marginTop:2}}>Expect to pay {meal.typical}</div>
          </div>
        )}
        {spot.address && <p style={S.spotDesc}>📍 {spot.address}</p>}
        {spot.tags.length > 0 && <div style={S.tagRow}>{spot.tags.map(t => <span key={t} style={S.tag}>{t}</span>)}</div>}
        <div style={S.actionRow}>
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
          <div style={S.logo}><span style={S.logoEat}>Eat</span><span style={S.logoSmart}>Smart</span><span style={S.logoIcon}>🍽️</span></div>
          <p style={S.tagline}>Find great food near you — on any budget</p>
          <div style={S.wave} />
        </header>
        <div style={S.card}>


          <div style={S.row}>
            <div style={S.selectWrap}><select style={S.select} value={city} onChange={e => handleCityChange(e.target.value)}>{cities.map(c => <option key={c}>{c}</option>)}</select><span style={S.chevron}>▾</span></div>
            <div style={S.selectWrap}><select style={S.select} value={suburb} onChange={e => { setSuburb(e.target.value); localStorage.setItem("es_suburb", e.target.value); setSearched(false); }}>
    <option key="all">All Suburbs</option>
    {suburbs.map(s => <option key={s}>{s}</option>)}
  </select><span style={S.chevron}>▾</span></div>
          </div>
          <div style={S.row}>
            <div style={S.budgetWrap}><span style={{color:"#e83a2a",fontWeight:700,fontSize:18}}>$</span><input type="number" value={budget || ""} min={5} max={200} placeholder="30" onChange={e => { setBudget(Number(e.target.value)); localStorage.setItem("es_budget", e.target.value); }} style={S.budgetInput} /></div>
            <div style={S.selectWrap}><select style={S.select} value={cuisine} onChange={e => setCuisine(e.target.value)}>{CUISINES.map(c => <option key={c}>{c}</option>)}</select><span style={S.chevron}>▾</span></div>
          </div>
          <button style={{...S.cta, opacity: loading ? 0.7 : 1}} onClick={handleSearch} disabled={loading}>{loading ? "Searching…" : "Find somewhere to eat →"}</button>
        </div>
      </div>

      {/* HERO EMPTY STATE */}
      {!searched && (
        <div style={{textAlign:"center",padding:"40px 32px 20px"}}>
          <div style={{fontSize:72,marginBottom:16}}>🍽️</div>
          <div style={{fontWeight:800,fontSize:22,color:"#1a1a1a",marginBottom:8}}>What are you hungry for?</div>
          <div style={{fontSize:14,color:"#aaa",lineHeight:1.6}}>Set your budget, pick your suburb,<br/>and find great food nearby.</div>
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
      <div ref={openNowRef} style={{...S.results, paddingTop:24, borderTop:"2px solid #f0ebe6", marginTop:8}}>
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
      <div ref={savedRef} style={{...S.results, paddingTop:24, borderTop:"2px solid #f0ebe6", marginTop:8}}>
        <div style={{fontWeight:800,fontSize:20,color:"#1a1a1a",marginBottom:16}}>❤️ Saved Places</div>
        {savedSpots.length === 0
          ? <div style={S.emptyBox}>Heart a restaurant to save it here!</div>
          : savedSpots.map(spot => <SpotCard key={spot.id} spot={spot} />)
        }
      </div>

      {/* TOP RATED SECTION */}
      <div ref={topRatedRef} style={{...S.results, paddingTop:24, borderTop:"2px solid #f0ebe6", marginTop:8}}>
        <div style={{fontWeight:800,fontSize:20,color:"#1a1a1a",marginBottom:4}}>⭐ Top Rated Nearby</div>
        <div style={{fontSize:13,color:"#aaa",marginBottom:16}}>{suburb}, {city}</div>
        {!searched
          ? <div style={S.emptyBox}>🔍 Do a search first to see top rated places!</div>
          : topRatedSpots.length === 0
          ? <div style={S.emptyBox}>😕 No rated places found in your last search.</div>
          : topRatedSpots.map(spot => <SpotCard key={spot.id} spot={spot} />)
        }
      </div>

      {/* FOOTER */}
      <div style={{textAlign:"center",padding:"24px 16px 8px",borderTop:"1px solid #f0ebe6",marginTop:16}}>
        <p style={{fontSize:13,color:"#aaa",margin:"0 0 6px"}}>Know what something actually costs here?</p>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfAJiZq0I82rrrJ2VEz9ziTjMqADIbPgmoc_Ahqi_QnPyoPrg/viewform" target="_blank" rel="noopener noreferrer" style={{fontSize:13,fontWeight:600,color:"#e83a2a",textDecoration:"none"}}>💰 Submit a real price</a>
        <p style={{fontSize:13,color:"#aaa",margin:"12px 0 6px"}}>Missing a restaurant or got feedback?</p>
        <a href="mailto:eatsmartapp@gmail.com" style={{fontSize:13,fontWeight:600,color:"#e83a2a",textDecoration:"none"}}>✉️ Let us know</a>
        <p style={{fontSize:11,color:"#ccc",marginTop:12}}>© 2025 EatSmart NZ · eatsmart.co.nz</p>
      </div>

      {/* BOTTOM NAV */}
      <nav style={S.bottomNav}>
        {[
          { id: "search", emoji: "🏠", label: "Home" },
          { id: "opennow", emoji: "🕐", label: "Open Now" },
          { id: "saved", emoji: "❤️", label: "Saved" },
          { id: "toprated", emoji: "⭐", label: "Top Rated" },
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
  spinner:{width:36,height:36,border:"3px solid #f0e0de",borderTop:"3px solid #e83a2a",borderRadius:"50%",animation:"spin 0.8s linear infinite"},
  loadingText:{marginTop:14,color:"#888",fontSize:14},
  errorBox:{background:"#fff3f3",border:"1px solid #f5c6c6",borderRadius:12,padding:"16px",color:"#e83a2a",fontSize:14,marginBottom:12},
  emptyBox:{background:"#fff",borderRadius:16,padding:"28px 24px",textAlign:"center",color:"#aaa",fontSize:15,border:"1.5px dashed #ede8e3"},
  resultsHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8},
  resultsCount:{fontSize:17,color:"#222"},
  resultsLocation:{fontSize:13,color:"#888"},
  radiusBadge:{fontSize:12,color:"#aaa",marginBottom:16,paddingLeft:2},
  spotCard:{background:"#fff",borderRadius:24,padding:"18px 16px",marginBottom:14,boxShadow:"0 4px 16px rgba(0,0,0,0.07)",borderLeft:"4px solid #e83a2a"},
  spotTop:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12},
  spotLeft:{display:"flex",gap:10,alignItems:"flex-start"},
  spotEmoji:{fontSize:32,lineHeight:1},
  spotName:{fontWeight:700,fontSize:17,color:"#1a1a1a"},
  spotMeta:{fontSize:13,color:"#888",marginTop:2},
  spotDesc:{fontSize:13,color:"#777",margin:"0 0 10px"},
  tagRow:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14},
  tag:{background:"#f2f2f2",borderRadius:20,padding:"5px 12px",fontSize:12,color:"#555",fontWeight:500},
  actionRow:{display:"flex",gap:10},
  openBtn:{flex:1,background:"#f0faf4",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:600,color:"#27ae60",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"},
  saveBtn:{flex:1,border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:600,color:"#e83a2a",cursor:"pointer",fontFamily:"inherit"},
  bottomNav:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid #f0ebe6",display:"flex",justifyContent:"space-around",padding:"8px 0 20px",zIndex:100,boxShadow:"0 -4px 20px rgba(200,50,40,0.08)"},
  navBtn:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",background:"none",border:"none",cursor:"pointer",color:"#aaa",fontFamily:"inherit",padding:"4px 0"},
  navBtnActive:{color:"#e83a2a"},
  perPerson:{fontSize:10,color:"#aaa",marginTop:3,textAlign:"center"},
};

const styleEl = document.createElement("style");
styleEl.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
document.head.appendChild(styleEl);
