export default function NavButtons({ navigate }) {
  return (
    <div className="flex gap-4 justify-center mb-6">
      <button onClick={() => navigate("/ride")}>Ride</button>
      <button onClick={() => navigate("/driver")}>Driver</button>
      <button onClick={() => navigate("/vehicle")}>Vehicle</button>
    </div>
  );
}