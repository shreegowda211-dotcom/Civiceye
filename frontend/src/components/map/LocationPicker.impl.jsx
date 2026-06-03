import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from "@/config/env.js";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function LocationPicker(props) {
  const { value, onChange, height = 320, interactive = true } = props || {};

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!value && interactive && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, [value, interactive]);

  const center = Array.isArray(value) && value.length === 2 ? value : userLocation ?? MAP_DEFAULT_CENTER;
  const zoom = Array.isArray(value) && value.length === 2 ? 14 : MAP_DEFAULT_ZOOM;
  const safeCenter = Array.isArray(center) && center.length === 2 ? center : MAP_DEFAULT_CENTER;

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [safeCenter[0], safeCenter[1]],
      zoom,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    mapRef.current = map;

    if (interactive) {
      map.on("click", (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        onChange?.([lat, lng]);
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }
      });
    }

    if (Array.isArray(value) && value.length === 2) {
      const [lat, lng] = value;
      markerRef.current = L.marker([lat, lng]).addTo(map);
    } else if (userLocation) {
      const [lat, lng] = userLocation;
      markerRef.current = L.marker([lat, lng]).addTo(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([safeCenter[0], safeCenter[1]], zoom);
    }
  }, [safeCenter]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (Array.isArray(value) && value.length === 2) {
      const [lat, lng] = value;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
      }
    }
  }, [value]);

  return (
    <div className="rounded-lg overflow-hidden border border-border" style={{ height }} ref={mapContainerRef} />
  );
}
