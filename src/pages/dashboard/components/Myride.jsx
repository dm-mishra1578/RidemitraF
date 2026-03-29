import ChatBox from "../../../components/ChatBox";
import OtpBox from "../../../components/OtpBox";

export default function MyRide({ data, reload }) {

  if (!data.length) return <p>No ride requests</p>;

  return data.map(r => (
    <div key={r._id} className="border p-4 mb-3 rounded">

      <p><b>{r.rideId?.source} → {r.rideId?.destination}</b></p>
      <p>Status: {r.status}</p>

      {r.status === "accepted" && (
        <>
          {r.chatId && <ChatBox chatId={r.chatId} />}
          <OtpBox requestId={r._id} refresh={reload} />
        </>
      )}

      {r.status === "ongoing" && <p>Ride Started</p>}
      {r.status === "completed" && <p>Completed</p>}

    </div>
  ));
}