// Runtime configuration. Override via Vite env vars in .env files.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5003/api";
export const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS).toLowerCase() === "true";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5003";

// Map defaults — centered on India.
export const MAP_DEFAULT_CENTER = [20.5937, 78.9629];
export const MAP_DEFAULT_ZOOM = 5;
export const MAP_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const MAP_TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// CSC Map API key – from .env
export const CSC_MAP_API_KEY = import.meta.env.VITE_CSC_MAP_API_KEY || "";
