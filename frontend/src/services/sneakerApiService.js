// frontend/src/services/sneakerApiService.js
export async function enrichSneakersWithMarketData(sneakers) {
  if (!sneakers || !Array.isArray(sneakers) || sneakers.length === 0) {
    return [];
  }
  
  console.log(`Enriching ${sneakers.length} sneakers with market data`);
  
  // Add basic market data to each sneaker
  return sneakers.map(sneaker => {
    return {
      ...sneaker,
      marketData: {
        retailPrice: 120,
        releaseDate: "2023-05-15",
        prices: {
          stockX: 180,
          goat: 175
        },
        resellLinks: {
          stockX: `https://stockx.com/search?s=${encodeURIComponent(sneaker.name || '')}`,
          goat: `https://www.goat.com/search?query=${encodeURIComponent(sneaker.name || '')}`
        }
      }
    };
  });
}