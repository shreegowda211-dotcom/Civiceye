import { useCallback, useState } from "react";
import { locationService } from "@/api/locationService.js";

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [denied, setDenied] = useState(false);

  const detect = useCallback(async () => {
    setLoading(true); setDenied(false);
    const res = await locationService.getBrowserLocation();
    setLoading(false);
    if (!res) { setDenied(true); return null; }
    setCoords(res);
    return res;
  }, []);

  return { coords, loading, denied, detect, setCoords };
}
