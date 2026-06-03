import ClientOnlyMap from "./ClientOnlyMap.jsx";
export default function ComplaintMap(props) {
  return <ClientOnlyMap loader={() => import("./ComplaintMap.impl.jsx")} {...props} />;
}
