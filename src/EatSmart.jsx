import { useState } from "react";

const SPOTS = [
  {
    id: 1,
    name: "Ujido",
    emoji: "🍝",
    suburb: "Ahuriri",
    cuisine: "Italian",
    inBudget: true,
    price: null,
    priceLabel: "per person",
    description:
      "Authentic Italian pasta and risotto in a relaxed Ahuriri waterfront setting with excellent wine selection.",
    dish: "Handmade Tagliatelle al Ragù",
    dishPrice: 28,
    tags: ["Waterfront views", "Handmade pasta", "Italian wine"],
  },
  {
    id: 2,
    name: "Pacifica",
    emoji: "🐟",
    suburb: "Ahuriri",
    cuisine: "Italian",
    inBudget: false,
    price: null,
    priceLabel: "per person",
    description:
      "Contemporary fine dining showcasing fresh Hawke's Bay produce and world-class New Zealand seafood.",
    dish: "Pan-seared Hapuka",
    dishPrice: 42,
    tags: ["Fine dining", "Local produce", "Seafood"],
  },
  {
    id: 3,
    name: "Mister D",
    emoji: "🍔",
    suburb: "Napier Hill",
    cuisine: "Italian",
    inBudget: true,
    price: null,
    priceLabel: "per person",
    description:
      "Inventive comfort food in a vibrant art deco setting — burgers, pasta, and craft cocktails.",
    dish: "Truffle Fries & Wagyu Slider",
    dishPrice: 24,
    tags: ["Art Deco", "Craft cocktails", "Comfort food"],
  },
  {
    id: 4,
    name: "Bistro Lulu",
    emoji: "🥗",
    suburb: "Ahuriri",
    cuisine: "Italian",
    inBudget: true,
    price: null,
    priceLabel: "per person",
    description:
      "A neighbourhood favourite for fresh salads, wood-fired pizza, and long lazy lunches by the water.",
    dish: "Margherita DOC",
    dishPrice: 22,
    tags: ["Wood-fired", "Waterfront", "Casual"],
  },
];

const CITIES = ["Napier", "Hastings", "Havelock North"];
const SUBURBS = ["Ahuriri", "Napier Hill", "Taradale", "Bluff Hill"];
const CUISINES = ["Italian", "Japanese", "Mexican", "Thai", "NZ Modern", "Indian"];

export default function EatSmart() {
  const [budget, setBudget] = useState(30);
  const [city, setCity] = useState("Napier");
  const [suburb, setSuburb] = useState("Ahuriri");
  const [cuisine, setCuisine] = useState("Italian");
  const [searched, setSearched] = useState(true);
  const [saved, setSaved] = useState({});
  const [locating, setLocating] = useState(false);

  const inBudgetSpots = SPOTS.filter((s) => s.dishPrice <= budget);

  function handleLocate() {
    setLocating(true);
    setTimeout(() => setLocating(false), 1200);
  }

  function toggleSave(id) {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoEat}>Eat</span>
          <span style={styles.logoSmart}>Smart</span>
          <span style={styles.logoIcon}>🍽️</span>
        </div>
        <p style={styles.tagline}>Find great food near you — on any budget</p>
        <div style={styles.wave} />
      </header>

      {/* Search Card */}
      <div style={styles.card}>
        {/* Location row */}
        <div style={styles.locationRow}>
          <button
            style={{ ...styles.locateBtn, opacity: locating ? 0.7 : 1 }}
            onClick={handleLocate}
          >
            <span>📍</span>
            <span style={{ color: "#c0392b", fontWeight: 600 }}>
              {locating ? "Locating…" : "Use my location"}
            </span>
          </button>
          <button style={styles.typeBtn}>Type it</button>
        </div>

        {/* City / Suburb */}
        <div style={styles.row}>
          <div style={styles.selectWrap}>
            <select
              style={styles.select}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <span style={styles.chevron}>▾</span>
          </div>
          <div style={styles.selectWrap}>
            <select
              style={styles.select}
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
            >
              {SUBURBS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <span style={styles.chevron}>▾</span>
          </div>
        </div>

        {/* Budget / Cuisine */}
        <div style={styles.row}>
          <div style={styles.budgetWrap}>
            <span style={{ color: "#c0392b", fontWeight: 700, fontSize: 18 }}>$</span>
            <input
              type="number"
              value={budget}
              min={5}
              max={200}
              onChange={(e) => setBudget(Number(e.target.value))}
              style={styles.budgetInput}
            />
          </div>
          <div style={styles.selectWrap}>
            <select
              style={styles.select}
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              {CUISINES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <span style={styles.chevron}>▾</span>
          </div>
        </div>

        {/* CTA */}
        <button style={styles.cta} onClick={() => setSearched(true)}>
          Find somewhere to eat &nbsp;→
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div style={styles.results}>
          <div style={styles.resultsHeader}>
            <span style={styles.resultsCount}>
              <strong>{SPOTS.length} spots</strong> near you
            </span>
            <span style={styles.resultsLocation}>
              📍 {suburb}, {city}
            </span>
          </div>

          {SPOTS.map((spot) => {
            const withinBudget = spot.dishPrice <= budget;
            return (
              <div key={spot.id} style={styles.spotCard}>
                <div style={styles.spotTop}>
                  <div style={styles.spotLeft}>
                    <span style={styles.spotEmoji}>{spot.emoji}</span>
                    <div>
                      <div style={styles.spotName}>{spot.name}</div>
                      <div style={styles.spotMeta}>
                        {spot.suburb} · {spot.cuisine}
                      </div>
                      {withinBudget && (
                        <span style={styles.badge}>✅ In budget</span>
                      )}
                    </div>
                  </div>
                  <div style={styles.spotPriceCol}>
                    <span style={styles.dollarSign}>$</span>
                    <span style={styles.perPerson}>per person</span>
                  </div>
                </div>

                <p style={styles.spotDesc}>{spot.description}</p>

                <div style={styles.dishRow}>
                  <span style={styles.dishLabel}>Try: {spot.dish}</span>
                  <span style={styles.dishPrice}>${spot.dishPrice}</span>
                </div>

                <div style={styles.tagRow}>
                  {spot.tags.map((t) => (
                    <span key={t} style={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>

                <div style={styles.actionRow}>
                  <button style={styles.openBtn}>👍 Still open?</button>
                  <button
                    style={{
                      ...styles.saveBtn,
                      color: saved[spot.id] ? "#c0392b" : "#c0392b",
                      background: saved[spot.id] ? "#fde8e8" : "#fef2f2",
                    }}
                    onClick={() => toggleSave(spot.id)}
                  >
                    {saved[spot.id] ? "🩷 Saved" : "🤍 Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    background: "#f5f5f0",
    minHeight: "100vh",
    maxWidth: 480,
    margin: "0 auto",
    paddingBottom: 40,
  },
  header: {
    background: "#c0392b",
    padding: "28px 24px 48px",
    position: "relative",
    overflow: "hidden",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    marginBottom: 6,
  },
  logoEat: {
    fontFamily: "'Georgia', serif",
    fontWeight: 900,
    fontSize: 32,
    color: "#fff",
    letterSpacing: -1,
  },
  logoSmart: {
    fontFamily: "'Georgia', serif",
    fontWeight: 900,
    fontSize: 32,
    color: "#f9c784",
    letterSpacing: -1,
  },
  logoIcon: {
    fontSize: 28,
    marginLeft: 6,
  },
  tagline: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    margin: 0,
  },
  wave: {
    position: "absolute",
    bottom: -2,
    left: 0,
    right: 0,
    height: 32,
    background: "#f5f5f0",
    borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    margin: "0 16px",
    padding: "20px 16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    marginTop: -16,
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  locationRow: {
    display: "flex",
    gap: 10,
  },
  locateBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fef2f2",
    border: "none",
    borderRadius: 12,
    padding: "14px 16px",
    cursor: "pointer",
    fontSize: 15,
  },
  typeBtn: {
    background: "#fff",
    border: "1.5px solid #e0e0e0",
    borderRadius: 12,
    padding: "14px 18px",
    cursor: "pointer",
    fontSize: 15,
    color: "#999",
    fontFamily: "inherit",
  },
  row: {
    display: "flex",
    gap: 10,
  },
  selectWrap: {
    flex: 1,
    position: "relative",
  },
  select: {
    width: "100%",
    appearance: "none",
    border: "1.5px solid #e0e0e0",
    borderRadius: 12,
    padding: "13px 36px 13px 14px",
    fontSize: 15,
    background: "#fff",
    fontFamily: "inherit",
    cursor: "pointer",
    color: "#222",
    outline: "none",
  },
  chevron: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#aaa",
    fontSize: 14,
  },
  budgetWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #e0e0e0",
    borderRadius: 12,
    padding: "0 14px",
    gap: 4,
    background: "#fff",
  },
  budgetInput: {
    border: "none",
    outline: "none",
    fontSize: 22,
    fontWeight: 700,
    width: "100%",
    fontFamily: "inherit",
    color: "#222",
    background: "transparent",
  },
  cta: {
    background: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "18px",
    fontSize: 17,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    letterSpacing: 0.3,
    transition: "opacity 0.15s",
  },
  results: {
    padding: "24px 16px 0",
  },
  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 17,
    color: "#222",
  },
  resultsLocation: {
    fontSize: 13,
    color: "#888",
  },
  spotCard: {
    background: "#fff",
    borderRadius: 18,
    padding: "18px 16px",
    marginBottom: 14,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  spotTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  spotLeft: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  },
  spotEmoji: {
    fontSize: 32,
    lineHeight: 1,
  },
  spotName: {
    fontWeight: 700,
    fontSize: 17,
    color: "#1a1a1a",
  },
  spotMeta: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  badge: {
    display: "inline-block",
    marginTop: 6,
    background: "#eafaf1",
    color: "#27ae60",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
    border: "1px solid #a9dfbf",
  },
  spotPriceCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  dollarSign: {
    color: "#c0392b",
    fontWeight: 700,
    fontSize: 26,
    lineHeight: 1,
  },
  perPerson: {
    fontSize: 11,
    color: "#aaa",
    marginTop: 2,
  },
  spotDesc: {
    fontSize: 14,
    color: "#555",
    lineHeight: 1.55,
    margin: "0 0 12px",
  },
  dishRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fdf6ee",
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 12,
  },
  dishLabel: {
    fontWeight: 600,
    fontSize: 14,
    color: "#333",
  },
  dishPrice: {
    color: "#c0392b",
    fontWeight: 700,
    fontSize: 15,
  },
  tagRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  tag: {
    background: "#f2f2f2",
    borderRadius: 20,
    padding: "5px 12px",
    fontSize: 12,
    color: "#555",
    fontWeight: 500,
  },
  actionRow: {
    display: "flex",
    gap: 10,
  },
  openBtn: {
    flex: 1,
    background: "#f0faf4",
    border: "none",
    borderRadius: 10,
    padding: "11px",
    fontSize: 14,
    fontWeight: 600,
    color: "#27ae60",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  saveBtn: {
    flex: 1,
    border: "none",
    borderRadius: 10,
    padding: "11px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.2s",
  },
};
