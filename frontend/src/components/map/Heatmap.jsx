import ClientOnlyMap from "./ClientOnlyMap.jsx";
export default function Heatmap(props) {
  return <ClientOnlyMap loader={() => import("./Heatmap.impl.jsx")} {...props} />;
}
