export default function DriverBookings({ data }) {

  if (!data.length) return <p>No driver bookings</p>;

  return data.map(b => (
    <div key={b._id} className="border p-4 mb-3 rounded">

      <p><b>Driver:</b> {b.driverId?.userId?.name}</p>
      <p>Status: {b.status}</p>
      <p>₹{b.totalPrice}</p>

    </div>
  ));
}