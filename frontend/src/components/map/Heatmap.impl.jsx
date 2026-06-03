import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MAP_DEFAULT_CENTER } from "@/config/env.js";

// Ensure default marker icons resolve correctly in bundlers like Vite.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * Heatmap component – Leaflet implementation.
 *
 * Props
 * -----
 * points: Array of [lat, lng, intensity] where intensity is 0‑1.
 * height: CSS height for the container (number → px, string passed through).
 */
export default function Heatmap({ points = [], height = 480 }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  const containerHeight = typeof height === "number" ? `${height}px` : height;

  const isValidPoint = (point) => {
    if (!Array.isArray(point) || point.length < 2) return false;
    const [lat, lng] = point;
    return typeof lat === "number" && typeof lng === "number" && Number.isFinite(lat) && Number.isFinite(lng);
  };

  const validPoints = points.filter(isValidPoint);

  const getColorForIntensity = (t) => {
    if (t <= 0.45) return t <= 0 ? "#3b82f6" : interpolateColor("#3b82f6", "#f59e0b", t / 0.45);
    return interpolateColor("#f59e0b", "#ef4444", (t - 0.45) / (1 - 0.45));
  };

  // Simple hex color interpolation between two colors (t in [0,1]).
  const interpolateColor = (a, b, t) => {
    const pa = hexToRgb(a);
    const pb = hexToRgb(b);
    const r = Math.round(pa.r + (pb.r - pa.r) * t);
    const g = Math.round(pa.g + (pb.g - pa.g) * t);
    const bl = Math.round(pa.b + (pb.b - pa.b) * t);
    return `rgb(${r}, ${g}, ${bl})`;
  };

  const hexToRgb = (hex) => {
    const m = hex.replace('#', '');
    const r = parseInt(m.substring(0, 2), 16);
    const g = parseInt(m.substring(2, 4), 16);
    const b = parseInt(m.substring(4, 6), 16);
    return { r, g, b };
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter = validPoints.length ? [validPoints[0][0], validPoints[0][1]] : MAP_DEFAULT_CENTER;
    const initialZoom = validPoints.length ? 11 : 5;
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    mapRef.current = map;

    layerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render points whenever they change.
  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.clearLayers();
    validPoints.forEach(([lat, lng, intensity = 0.5]) => {
      const color = getColorForIntensity(Number(intensity));
      const radius = 8 + (20 * Math.max(0, Math.min(1, intensity)));
      const circle = L.circleMarker([lat, lng], {
        radius,
        color: "#000",
        weight: 1,
        fillColor: color,
        fillOpacity: 0.35,
      });
      circle.addTo(layerRef.current);
    });
  }, [validPoints]);

  return (
    <div
      ref={mapContainerRef}
      className="rounded-lg overflow-hidden border border-border"
      style={{ height: containerHeight, width: "100%" }}
    />
  );
}
