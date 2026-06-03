import ClientOnlyMap from "./ClientOnlyMap.jsx";
export default function LocationPicker(props) {
  return <ClientOnlyMap loader={() => import("./LocationPicker.impl.jsx")} {...props} />;
}
