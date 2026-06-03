import axiosClient from "./axiosClient.js";
import { USE_MOCKS } from "@/config/env.js";

/**
 * LOCATION SERVICE — Country / State / City + Reverse Geocoding
 * -------------------------------------------------------------
 *
 * Architected against the Country-State-City API
 * (https://countrystatecity.in/docs/) — backend proxies upstream and adds caching.
 *
 * GET /api/location/countries
 *   200: { success: true, data: [{ iso2, name, emoji, phone_code }] }
 *
 * GET /api/location/states/:countryIso2
 *   200: { success: true, data: [{ iso2, name }] }
 *
 * GET /api/location/cities/:countryIso2/:stateIso2
 *   200: { success: true, data: [{ name, latitude, longitude }] }
 *
 * GET /api/location/reverse
 *   Query: { lat, lng }
 *   200:   { success: true, data: { country, state, city, area, formatted, latitude, longitude } }
 *
 * GET /api/location/forward
 *   Query: { q }   // e.g. "Indiranagar, Bangalore"
 *   200:   { success: true, data: [{ formatted, latitude, longitude }] }
 *
 * Frontend convenience:
 *   getBrowserLocation() — wraps navigator.geolocation in a Promise.
 *                          Rejects gracefully so the UI can fall back to manual selection.
 */

function delay(ms = 200) { return new Promise((r) => setTimeout(r, ms)); }

const MOCK_STATES = [
  { iso2: "KA", name: "Karnataka" },
  { iso2: "MH", name: "Maharashtra" },
  { iso2: "DL", name: "Delhi" },
  { iso2: "TN", name: "Tamil Nadu" },
  { iso2: "WB", name: "West Bengal" },
  { iso2: "GJ", name: "Gujarat" },
];

const MOCK_CITIES = {
  KA: ["Bangalore", "Mysore", "Mangalore", "Hubli"],
  MH: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  DL: ["New Delhi", "Dwarka", "Rohini"],
  TN: ["Chennai", "Coimbatore", "Madurai"],
  WB: ["Kolkata", "Howrah", "Durgapur"],
  GJ: ["Ahmedabad", "Surat", "Vadodara"],
};

export const locationService = {
  async countries() {
    if (USE_MOCKS) { await delay(); return { success: true, data: [{ iso2: "IN", name: "India", emoji: "🇮🇳", phone_code: "91" }] }; }
    const { data } = await axiosClient.get("/location/countries");
    return data;
  },

  async states(countryIso2 = "IN") {
    if (USE_MOCKS) { await delay(); return { success: true, data: MOCK_STATES }; }
    const { data } = await axiosClient.get(`/location/states/${countryIso2}`);
    return data;
  },

  async cities(countryIso2, stateIso2) {
    if (USE_MOCKS) {
      await delay();
      const list = (MOCK_CITIES[stateIso2] || []).map((name) => ({ name, latitude: 12.97 + Math.random(), longitude: 77.59 + Math.random() }));
      return { success: true, data: list };
    }
    const { data } = await axiosClient.get(`/location/cities/${countryIso2}/${stateIso2}`);
    return data;
  },

  async reverseGeocode(lat, lng) {
    if (USE_MOCKS) {
      await delay();
      return { success: true, data: { country: "India", state: "Karnataka", city: "Bangalore", area: "Indiranagar", formatted: "Indiranagar, Bangalore, KA", latitude: lat, longitude: lng } };
    }
    const { data } = await axiosClient.get("/location/reverse", { params: { lat, lng } });
    return data;
  },

  async forwardGeocode(q) {
    if (USE_MOCKS) { await delay(); return { success: true, data: [{ formatted: q, latitude: 12.97, longitude: 77.59 }] }; }
    const { data } = await axiosClient.get("/location/forward", { params: { q } });
    return data;
  },

  // Browser geolocation — optional. Resolves to null if denied/unavailable.
  getBrowserLocation(options = { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }) {
    return new Promise((resolve) => {
      if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy }),
        () => resolve(null),
        options,
      );
    });
  },
};
