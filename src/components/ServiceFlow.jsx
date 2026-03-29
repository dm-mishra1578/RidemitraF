import { useState } from "react";
import API from "../api/axios";
import ChatBox from "./ChatBox";
import OtpBox from "./OtpBox";

export default function ServiceFlow({ req, refresh }) {

  const [openChat, setOpenChat] = useState(null);

  const accept = async () => {
    const res = await API.patch(`/rides/accept/${req._id}`);
    alert("Accepted | OTP: " + res.data.otp);
    refresh();
  };

  const reject = async () => {
    await API.patch(`/rides/reject/${req._id}`);
    refresh();
  };

  const complete = async () => {
    await API.patch(`/rides/complete/${req._id}`);
    refresh();
  };

  return (
    <div className="bg-white shadow p-4 rounded">

      <p><b>User:</b> {req.userId?.name || "User"}</p>
      <p><b>Status:</b> {req.status}</p>

      {/* PENDING */}
      {req.status === "pending" && (
        <>
          <button onClick={accept} className="bg-green-600 text-white px-3 py-1 mr-2 rounded">
            Accept
          </button>

          <button onClick={reject} className="bg-red-600 text-white px-3 py-1 rounded">
            Reject
          </button>
        </>
      )}

      {/* ACCEPTED */}
      {req.status === "accepted" && (
        <>
          <button
            onClick={() => setOpenChat(req._id)}
            className="bg-blue-600 text-white px-3 py-1 rounded">
            Open Chat
          </button>

          {openChat === req._id && (
            <div className="mt-2 border p-2">
              <ChatBox chatId={req.chatId} />
            </div>
          )}

          <OtpBox requestId={req._id} refresh={refresh} />
        </>
      )}

      {/* ONGOING */}
      {req.status === "ongoing" && (
        <>
          <p className="text-blue-600">Ride Running</p>
          <button onClick={complete} className="bg-black text-white px-3 py-1 rounded">
            Complete
          </button>
        </>
      )}

      {/* COMPLETED */}
      {req.status === "completed" && (
        <p className="text-green-600">Completed</p>
      )}

    </div>
  );
}