export default function MyRides({ data }) {

  if (!data.length) return <p>No rides created</p>;

  return data.map(r => (
    <div key={r._id} className="border p-3 mb-2 rounded">
      {r.source} → {r.destination}
    </div>
  ));
}