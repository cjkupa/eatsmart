export const FEATURED = {
  "Bianca": {
    "featured": true,
    "suburb": "Ellerslie",
    "city": "Auckland",
    "signatureDish": "Goat cheese dumplings, beurre blanc & chives",
    "signaturePrice": 28,
    "badge": "⭐ Featured"
  },
  "NY Grill": {
    "featured": true,
    "suburb": "Newmarket",
    "city": "Auckland",
    "signatureDish": "Steak frites",
    "signaturePrice": 25,
    "badge": "⭐ Featured"
  }
};

export function getFeatured(name) {
  if (!name) return null;
  const key = Object.keys(FEATURED).find(k => name.toLowerCase().includes(k.toLowerCase()));
  return key ? FEATURED[key] : null;
}
