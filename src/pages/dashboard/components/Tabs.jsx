export default function Tabs({ tab, setTab }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6 border-b pb-2">
      <button onClick={() => setTab("incoming")}>Ride Incoming</button>
      <button onClick={() => setTab("myreq")}>My Ride</button>
      <button onClick={() => setTab("driver")}>Driver</button>
      <button onClick={() => setTab("vehicle")}>Vehicle</button>
      <button onClick={() => setTab("rides")}>My Rides</button>
    </div>
  );
}