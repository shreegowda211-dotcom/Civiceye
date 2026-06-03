import { useEffect, useState } from "react";

// Wraps a lazy-loaded map component so leaflet never runs during SSR.
export default function ClientOnlyMap(props) {
  const { loader, fallbackHeight = 300, ...rest } = props || {};
  const [Comp, setComp] = useState(null);

  useEffect(() => {
    let active = true;

    loader()?.then((mod) => {
      if (!active) return;

      const loaded = mod?.default ?? mod;
      const isReactElement = loaded && typeof loaded === "object" && "$$typeof" in loaded;
      const component = isReactElement ? () => loaded : loaded;

      if (active && component) {
        setComp(() => component);
      }
    }).catch(() => {
      // swallow load errors here to preserve the fallback UI;
      // the actual component import failure will still appear in DevTools.
    });

    return () => {
      active = false;
    };
  }, [loader]);

  if (!Comp) {
    return <div style={{ height: rest.height || fallbackHeight }} className="rounded-lg bg-muted animate-pulse" />;
  }

  return <Comp {...rest} />;
}
