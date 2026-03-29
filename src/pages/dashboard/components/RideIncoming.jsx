import API from "../../../api/axios";
import ChatBox from "../../../components/ChatBox";

export default function RideIncoming({ data, reload }) {

  const accept = async (id) => {
    await API.patch(`/rides/accept/${id}`);
    reload();
  };

  const reject = async (id) => {
    await API.patch(`/rides/reject/${id}`);
    reload();
  };

  const complete = async (id) => {
    await API.patch(`/rides/complete/${id}`);
    reload();
  };

  if (!data.length) return <p>No requests</p>;

  return data.map(req => (
    <div key={req._id} className="border p-4 mb-3 rounded">

      <p><b>{req.userId?.name}</b></p>
      <p>{req.rideId?.source} → {req.rideId?.destination}</p>
      <p>Status: {req.status}</p>

      {req.status === "pending" && (
        <>
          <button onClick={() => accept(req._id)}>Accept</button>
          <button onClick={() => reject(req._id)}>Reject</button>
        </>
      )}

      {req.status === "accepted" && (
        <>
          <p>OTP: {req.otp}</p>
          {req.chatId && <ChatBox chatId={req.chatId} />}
        </>
      )}

      {req.status === "ongoing" && (
        <button onClick={() => complete(req._id)}>Complete</button>
      )}

    </div>
  ));
}