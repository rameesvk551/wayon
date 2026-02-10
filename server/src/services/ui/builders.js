const addBlockVersions = (blocks, version = 1) => {
  if (!Array.isArray(blocks)) return [];
  return blocks.map((block) => ({
    blockVersion: typeof block?.blockVersion === "number" ? block.blockVersion : version,
    ...block,
  }));
};

// ═══════════════════════════════════════════════════════════════════════════
// UI BUILDER LOGGING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════
const LOG_COLORS = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
};

const getTimestamp = () => new Date().toISOString().replace("T", " ").slice(0, 23);

const logUi = (level, message, data = null) => {
  const timestamp = getTimestamp();
  const colors = { info: LOG_COLORS.cyan, success: LOG_COLORS.green, warn: LOG_COLORS.yellow };
  const color = colors[level] || LOG_COLORS.reset;
  const prefix = `${LOG_COLORS.dim}[${timestamp}]${LOG_COLORS.reset} ${color}[UI-BUILDER]${LOG_COLORS.reset}`;

  console.log(`${prefix} ${message}`);
  if (data) {
    console.log(`${LOG_COLORS.dim}├─ Details:${LOG_COLORS.reset}`, JSON.stringify(data, null, 2));
  }
};

const coerceArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const getNested = (obj, paths) => {
  if (!obj || typeof obj !== "object") return undefined;
  for (const path of paths) {
    const parts = path.split(".");
    let current = obj;
    let found = true;
    for (const part of parts) {
      if (!current || typeof current !== "object" || !(part in current)) {
        found = false;
        break;
      }
      current = current[part];
    }
    if (found && current !== undefined) return current;
  }
  return undefined;
};

const formatPrice = (value, currency) => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "number") {
    const suffix = currency ? ` ${currency}` : "";
    return `${value}${suffix}`;
  }
  if (typeof value === "object") {
    const amount = value.amount ?? value.value ?? value.price ?? value.total;
    const curr = value.currency ?? currency;
    if (amount !== undefined) {
      return formatPrice(amount, curr);
    }
  }
  return undefined;
};

const mapWeatherCondition = (description) => {
  const text = `${description || ""}`.toLowerCase();
  if (text.includes("snow")) return "snowy";
  if (text.includes("rain") || text.includes("storm")) return "rainy";
  if (text.includes("cloud")) return "cloudy";
  if (text.includes("partly")) return "partly_cloudy";
  return "sunny";
};

const addUniqueInput = (inputs, value) => {
  if (!value) return;
  if (!inputs.includes(value)) {
    inputs.push(value);
  }
};

export const buildCollectInputBlocks = (structuredPayload, intent) => {
  if (!structuredPayload) return null;
  const combinedText = [
    structuredPayload.reply || "",
    ...(structuredPayload.next_questions || []),
  ]
    .join(" ")
    .toLowerCase();

  if (!combinedText) return null;

  const inputs = [];

  // Destination detection
  if (/(destination|where.*going|traveling to|travelling to|which city|which place)/.test(combinedText)) {
    addUniqueInput(inputs, "destination");
  }
  // Companions/travelers detection
  if (/(who.*traveling with|who.*travelling with|companions|travel.*type|solo.*couple.*family|friends.*family)/.test(combinedText)) {
    addUniqueInput(inputs, "companions");
  }
  // Budget detection
  if (/(budget|price range|budget range|spend|how much)/.test(combinedText)) {
    addUniqueInput(inputs, "budget");
  }
  // Dates detection - improved to catch more patterns
  if (/(travel dates|dates|when.*travel|time of year|check-in|check-out|checkin|checkout|departure date|travel date|when do you want)/.test(combinedText)) {
    addUniqueInput(inputs, "dates");
  }
  // Origin/Location detection - improved
  if (/(where are you from|current location|origin|departing from|departure city|flying from|leaving from|where.*departing)/.test(combinedText)) {
    addUniqueInput(inputs, "location");
  }
  // Transport detection
  if (/(transport|how would you like to travel|mode of travel|mode of transport)/.test(combinedText)) {
    addUniqueInput(inputs, "transport");
  }
  // Interests detection - improved
  if (/(interests|activities|what do you like|what do you enjoy|what.*interests you|prefer.*adventure|history.*food|culture.*nature)/.test(combinedText)) {
    addUniqueInput(inputs, "interests");
  }
  // Guests/Passengers detection - NEW
  if (/(how many guests|number of guests|how many passengers|number of passengers|how many people|how many travelers|how many travellers)/.test(combinedText)) {
    addUniqueInput(inputs, "companions");
  }

  // Keep hotel flow focused: don't suggest budget/interests after hotel results.
  if (intent?.name === "hotel_search" && inputs.length > 0) {
    return null;
  }

  if (inputs.length === 0) return null;

  return {
    blocks: addBlockVersions([
      {
        type: "collect_input",
        title: "Help me personalize your trip",
        subtitle: "Pick the options below to continue.",
        inputs,
      },
    ]),
  };
};

export const mergeUiBlocks = (primary, secondary) => {
  if (!primary && !secondary) return null;
  if (!primary) return secondary;
  if (!secondary) return primary;
  return { blocks: [...primary.blocks, ...secondary.blocks] };
};

export const buildBlocksFromTools = (toolResults) => {
  logUi("info", `🔧 Building blocks from tool results`, { count: toolResults?.length || 0 });

  if (!toolResults || toolResults.length === 0) {
    logUi("info", `📭 No tool results to process`);
    return null;
  }

  const blocks = [];

  for (const result of toolResults) {
    if (!result.ok) {
      logUi("warn", `⚠️ Service error: ${result.service}`, { error: result.error });
      blocks.push({
        type: "alert",
        level: "warning",
        text: result.error || `${result.service || "Service"} is unavailable.`,
      });
      continue;
    }

    logUi("info", `📦 Processing result from: ${result.service}`);
    const data = result.data;
    switch (result.service) {
      case "weather": {
        const payload = data?.current ? data : data?.data ?? data;
        const current = payload?.current;
        if (current) {
          blocks.push({
            type: "weather",
            location: payload?.city
              ? `${payload.city}${payload?.country ? `, ${payload.country}` : ""}`
              : "Weather update",
            temperature: current.temperature ?? current.temp ?? 0,
            feelsLike: current.feelsLike ?? current.feels_like,
            condition: mapWeatherCondition(current.description),
            humidity: current.humidity ?? 0,
            wind: `${current.windSpeed ?? current.wind_speed ?? 0} m/s`,
            uvIndex: "N/A",
          });
        }
        break;
      }
      case "hotel": {
        const hotels = coerceArray(
          getNested(data, [
            "hotels",
            "data.hotels",
            "data.data.hotels",
            "data",
            "results",
          ]) ?? data
        );
        if (hotels.length > 0) {
          blocks.push({
            type: "hotel_carousel",
            title: "Hotel Options",
            hotels: hotels.map((hotel, index) => ({
              id: hotel.id || hotel.hotelId || `hotel-${index}`,
              name: hotel.name || hotel.title || "Hotel",
              image: hotel.image || hotel.imageUrl || hotel.images?.[0] || "",
              rating: Number(hotel.rating ?? hotel.reviewScore ?? 4.2),
              reviewCount: hotel.reviewCount ?? hotel.reviews,
              price:
                formatPrice(hotel.price, hotel.currency) ||
                formatPrice(hotel.pricePerNight, hotel.currency) ||
                "Contact for pricing",
              originalPrice: formatPrice(hotel.originalPrice, hotel.currency),
              location:
                hotel.location ||
                hotel.city ||
                [hotel.address, hotel.country].filter(Boolean).join(", "),
              amenities: hotel.amenities || [],
              badge: hotel.badge,
              badgeType: hotel.badgeType,
            })),
          });
        }
        break;
      }
      case "flight": {
        const flights = coerceArray(
          getNested(data, ["flights", "data.flights", "data", "results"]) ?? data
        );
        if (flights.length > 0) {
          blocks.push({
            type: "flight_carousel",
            title: "Flight Options",
            flights: flights.map((flight, index) => ({
              id: flight.id || `flight-${index}`,
              airline: flight.airline || flight.carrier || "Airline",
              airlineLogo: flight.airlineLogo || flight.logo,
              flightNumber: flight.flightNumber || flight.number || "N/A",
              departure: flight.departureTime || flight.departure || "",
              arrival: flight.arrivalTime || flight.arrival || "",
              departureAirport: flight.departureAirport || flight.origin || "",
              arrivalAirport: flight.arrivalAirport || flight.destination || "",
              departureCity: flight.departureCity,
              arrivalCity: flight.arrivalCity,
              duration: flight.duration || flight.totalDuration || "",
              price: formatPrice(flight.price, flight.currency) || "Contact",
              stops: Number.isFinite(Number(flight.stops)) ? Number(flight.stops) : 0,
              aircraft: flight.aircraft,
              class: flight.class,
              route: flight.route,
              gate: flight.gate,
              seat: flight.seat,
            })),
          });
        }
        break;
      }
      case "attraction": {
        const attractions = coerceArray(
          getNested(data, ["attractions", "data.attractions", "data", "results"]) ?? data
        );
        if (attractions.length > 0) {
          const source = data?.source ?? data?.data?.source;
          const requestCity = result.request?.city || result.request?.destination;
          const requestCountry = result.request?.country;
          const destinationLabel = requestCity
            ? `${requestCity}${requestCountry ? `, ${requestCountry}` : ""}`
            : attractions[0]?.city || attractions[0]?.location?.city || "Destination";
          if (source === "fallback") {
            blocks.push({
              type: "alert",
              level: "info",
              text: "Attraction results are sample data because the attraction service returned fallback results.",
            });
          }
          blocks.push({
            type: "attraction_carousel",
            title: "Top Attractions",
            destination: destinationLabel,
            attractions: attractions.map((attr, index) => ({
              id: attr.id || `attr-${index}`,
              name: attr.name || attr.title || "Attraction",
              category: attr.category || attr.type || "general",
              description: attr.description,
              rating: Number(attr.rating ?? 4.5),
              image: attr.image || attr.imageUrl || attr.photos?.[0],
              duration: attr.duration,
              price: formatPrice(attr.price, attr.currency),
              lat: attr.lat ?? attr.latitude ?? attr.location?.lat ?? 0,
              lng: attr.lng ?? attr.longitude ?? attr.location?.lng ?? 0,
            })),
          });
        }
        break;
      }
      case "tour": {
        const experiences = coerceArray(
          getNested(data, ["experiences", "data.experiences", "data", "results"]) ?? data
        );
        if (experiences.length > 0) {
          blocks.push({
            type: "list",
            ordered: false,
            items: experiences.map((exp, index) => ({
              id: exp.id || `exp-${index}`,
              text: `${exp.name || exp.title || "Experience"}${exp.location?.city ? ` • ${exp.location.city}` : ""}`,
            })),
          });
        }
        break;
      }
      case "blog": {
        const posts = coerceArray(
          getNested(data, ["posts", "data", "blogs", "articles", "results"]) ?? data
        );
        if (posts.length > 0) {
          blocks.push({
            type: "list",
            ordered: false,
            items: posts.map((post, index) => ({
              id: post.id || `post-${index}`,
              text: post.title || post.name || post.slug || "Blog post",
            })),
          });
        }
        break;
      }
      case "transport": {
        const legs = coerceArray(
          getNested(data, ["data", "legs", "routes", "results"]) ?? data
        );
        if (legs.length > 0) {
          blocks.push({
            type: "list",
            ordered: false,
            items: legs.map((leg, index) => ({
              id: `leg-${index}`,
              text: leg.origin?.name && leg.destination?.name
                ? `${leg.origin.name} → ${leg.destination.name}`
                : `Transport option ${index + 1}`,
            })),
          });
        }
        break;
      }
      case "pdf": {
        if (data?.pdfUrl || data?.pdfBytesBase64) {
          blocks.push({
            type: "alert",
            level: "success",
            text: "Itinerary PDF is ready to download.",
          });
        }
        break;
      }
      case "itinerary": {
        // The itinerary service wraps its payload in { success, data }
        const itinData = data?.data ?? data;
        const dailyPlan = itinData?.dailyPlan ?? [];
        const mapData = itinData?.mapData;
        const summary = itinData?.summary;
        const notes = itinData?.notes ?? [];

        if (dailyPlan.length > 0) {
          // Summary alert
          if (summary) {
            blocks.push({
              type: "alert",
              level: "success",
              text: `✅ ${summary.assignedAttractions}/${summary.totalAttractions} attractions planned across ${dailyPlan.length} day(s) — optimised in ${summary.algorithmMs}ms`,
            });
          }

          // Unassigned warning
          const unassigned = itinData?.unassigned ?? [];
          if (unassigned.length > 0) {
            blocks.push({
              type: "alert",
              level: "warning",
              text: `⚠️ ${unassigned.length} attraction(s) could not fit: ${unassigned.map((u) => u.name).join(", ")}`,
            });
          }

          // Notes
          for (const note of notes) {
            blocks.push({ type: "alert", level: "info", text: note });
          }

          // Distance rollup (straight-line km between consecutive stops)
          const haversineKm = (a, b) => {
            const toRad = (v) => (v * Math.PI) / 180;
            const R = 6371; // km
            const dLat = toRad(b.lat - a.lat);
            const dLng = toRad(b.lng - a.lng);
            const lat1 = toRad(a.lat);
            const lat2 = toRad(b.lat);
            const h =
              Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
            return 2 * R * Math.asin(Math.sqrt(h));
          };

          const distanceSummaries = dailyPlan
            .map((day) => {
              if (!Array.isArray(day.stops) || day.stops.length < 2) return null;
              const legs = [];
              for (let i = 1; i < day.stops.length; i += 1) {
                const prev = day.stops[i - 1];
                const curr = day.stops[i];

                const distKm = Number.isFinite(curr.distanceFromPrevKm)
                  ? curr.distanceFromPrevKm
                  : haversineKm(
                    { lat: prev.lat, lng: prev.lng },
                    { lat: curr.lat, lng: curr.lng },
                  );

                legs.push(`${prev.name} → ${curr.name} ${distKm.toFixed(2)} km`);
              }
              return legs.length > 0
                ? { day: day.day, text: `Day ${day.day}: ${legs.join("; ")}` }
                : null;
            })
            .filter(Boolean);

          if (distanceSummaries.length > 0) {
            blocks.push({
              type: "title",
              level: 3,
              text: "Day-by-day straight-line gaps (km)",
            });
            blocks.push({
              type: "list",
              ordered: false,
              items: distanceSummaries.map((entry, idx) => ({
                id: `dist-${idx + 1}`,
                text: entry.text,
              })),
            });
          }

          // Timeline per day
          for (const day of dailyPlan) {
            blocks.push({
              type: "timeline",
              title: day.title || `Day ${day.day}`,
              subtitle: `${day.stops.length} stops · ${day.summary.totalVisitMinutes} min visiting · ${day.summary.totalTravelMinutes} min travel`,
              items: day.stops.map((stop) => ({
                time: `${stop.arrivalTime} – ${stop.departureTime}`,
                title: stop.name,
                description: stop.description || stop.category || "",
                icon: stop.transportMode === "WALKING" ? "🚶" : stop.transportMode === "CYCLING" ? "🚲" : stop.transportMode === "DRIVING" ? "🚗" : "🚌",
                metadata: {
                  duration: `${stop.visitDurationMinutes} min`,
                  travel: stop.travelFromPrevMinutes > 0 ? `${stop.travelFromPrevMinutes} min (${stop.distanceFromPrevKm} km)` : undefined,
                  transport: stop.transportMode,
                },
              })),
            });
          }

          // Map with all markers
          if (mapData && mapData.markers?.length > 0) {
            blocks.push({
              type: "map",
              center: mapData.centre,
              zoom: 12,
              markers: mapData.markers.map((m) => ({
                lat: m.lat,
                lng: m.lng,
                label: m.label,
                popup: `Day ${m.day}: ${m.label}`,
              })),
            });
          }
        }
        break;
      }
      default:
        break;
    }
  }

  if (blocks.length === 0) return null;
  return { blocks: addBlockVersions(blocks) };
};

const buildDefaultUi = ({ structuredPayload, toolResults, intent }) => {
  const toolBlocks = buildBlocksFromTools(toolResults);
  const collectBlocks = buildCollectInputBlocks(structuredPayload, intent);

  const baseUi = mergeUiBlocks(toolBlocks, collectBlocks);
  if (!baseUi) return null;

  return {
    version: "2026-02-05",
    blocks: addBlockVersions(baseUi.blocks),
  };
};

const INTENT_BUILDERS = {
  hotel_search: buildDefaultUi,
  flight_search: buildDefaultUi,
  attraction_list: buildDefaultUi,
  itinerary_generate: buildDefaultUi,
  weather_lookup: buildDefaultUi,
  experience_list: buildDefaultUi,
  transport_options: buildDefaultUi,
  itinerary_pdf: buildDefaultUi,
  general_chat: buildDefaultUi,
};

export const buildUiForIntent = ({ intent, structuredPayload, toolResults }) => {
  const name = intent?.name;
  const builder = (name && INTENT_BUILDERS[name]) ? INTENT_BUILDERS[name] : buildDefaultUi;
  return builder({ structuredPayload, toolResults, intent });
};
