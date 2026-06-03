import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Link } from "react-router-dom";
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from "@/config/env.js";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function ComplaintMap(props) {
  const { complaints = [], height = 420, basePath = "/admin/complaints" } = props || {};

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const pts = complaints.filter((c) => c.location?.latitude && c.location?.longitude);
    const initCenter = pts[0]
      ? [pts[0].location.latitude, pts[0].location.longitude]
      : MAP_DEFAULT_CENTER;

    const map = L.map(mapContainerRef.current, {
      center: initCenter,
      zoom: pts.length ? 11 : MAP_DEFAULT_ZOOM,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    mapRef.current = map;

    pts.forEach((c) => {
      const lat = c.location.latitude;
      const lng = c.location.longitude;
      const popupHtml =
        `<p class="font-semibold">${escapeHtml(c.title)}</p>` +
        `<p class="text-xs">${escapeHtml(c.location.area)}, ${escapeHtml(c.location.city)}</p>` +
        `<a href="${basePath}/${c._id}" class="text-primary text-xs underline">View</a>`;
      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(popupHtml, { closeButton: true, offset: L.point(0, -8) });
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaints]);

  return (
    <div className="rounded-lg overflow-hidden border border-border" style={{ height }} ref={mapContainerRef} />
  );
}

// Small helper to avoid injecting uninterpolated values into popup HTML.
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
