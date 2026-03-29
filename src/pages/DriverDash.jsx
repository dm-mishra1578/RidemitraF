import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "./Navbar";
import ChatBox from "../components/ChatBox";

export default function DriverDash() {

  const [bookings, setBookings] = useState([]);
  const [online, setOnline] = useState(false);
  const [tab, setTab] = useState("requests");

  // LOAD
  const load = async () => {
    try {
      const res = await API.get("/drivers/bookings");
      setBookings(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // TOGGLE
  const toggle = async () => {
    const res = await API.patch("/drivers/toggle");
    setOnline(res.data.isAvailable);
  };

  // ACTIONS
  const accept = async (id) => {
    await API.patch(`/drivers/accept/${id}`);
    load();
  };

  const startRide = async (id) => {
    await API.patch(`/drivers/start/${id}`);
    load();
  };

  const complete = async (id) => {
    await API.patch(`/drivers/complete/${id}`);
    load();
  };

  // 💸 earnings (completed only for now)
  const earnings = bookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 pt-20">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Driver Dashboard</h1>

          <button
            onClick={toggle}
            className={`px-4 py-2 rounded text-white ${
              online ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            {online ? "Online" : "Offline"}
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white shadow p-4 rounded text-center">
            <p>Total</p>
            <h2>{bookings.length}</h2>
          </div>

          <div className="bg-white shadow p-4 rounded text-center">
            <p>Completed</p>
            <h2>{bookings.filter(b => b.status === "completed").length}</h2>
          </div>

          <div className="bg-white shadow p-4 rounded text-center">
            <p>Earnings</p>
            <h2 className="text-green-600">₹{earnings}</h2>
          </div>

        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b mb-6">
          <button onClick={() => setTab("requests")}
            className={tab === "requests" ? "font-bold border-b-2" : ""}>
            Requests
          </button>

          <button onClick={() => setTab("active")}
            className={tab === "active" ? "font-bold border-b-2" : ""}>
            Active
          </button>

          <button onClick={() => setTab("history")}
            className={tab === "history" ? "font-bold border-b-2" : ""}>
            History
          </button>
        </div>

        {/* 🔹 REQUESTS */}
        {tab === "requests" && (
          <>
            {bookings.filter(b => b.status === "pending").length === 0 && (
              <p>No new requests</p>
            )}

            {bookings
              .filter(b => b.status === "pending")
              .map(b => (
                <div key={b._id}
                  className="bg-white shadow p-4 mb-3 rounded flex justify-between">

                  <div>
                    <p><b>{b.userId?.name}</b></p>
                    <p>₹{b.totalPrice}</p>
                  </div>

                  <button
                    onClick={() => accept(b._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>

                </div>
              ))}
          </>
        )}

        {/* 🔹 ACTIVE */}
        {tab === "active" && (
          <>
            {bookings.filter(b =>
              ["accepted", "ongoing"].includes(b.status)
            ).length === 0 && <p>No active jobs</p>}

            {bookings
              .filter(b => ["accepted", "ongoing"].includes(b.status))
              .map(b => (
                <div key={b._id}
                  className="bg-white shadow p-4 mb-3 rounded">

                  <p><b>{b.userId?.name}</b></p>
                  <p>₹{b.totalPrice}</p>
                  <p>Status: {b.status}</p>

                  {/* CHAT */}
                  {b.chatId && (
                    <ChatBox
                      chatId={b.chatId}
                      disabled={b.status === "ongoing"}
                    />
                  )}

                  {/* START */}
                  {b.status === "accepted" && (
                    <button
                      onClick={() => startRide(b._id)}
                      className="bg-yellow-500 text-white px-3 py-1 mt-2 rounded"
                    >
                      Start Ride
                    </button>
                  )}

                  {/* COMPLETE */}
                  {b.status === "ongoing" && (
                    <button
                      onClick={() => complete(b._id)}
                      className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
                    >
                      Complete
                    </button>
                  )}

                </div>
              ))}
          </>
        )}

        {/* 🔹 HISTORY */}
        {tab === "history" && (
          <>
            {bookings.filter(b => b.status === "completed").length === 0 && (
              <p>No history</p>
            )}

            {bookings
              .filter(b => b.status === "completed")
              .map(b => (
                <div key={b._id}
                  className="bg-white shadow p-4 mb-3 rounded">

                  <p><b>{b.userId?.name}</b></p>
                  <p>₹{b.totalPrice}</p>
                  <p className="text-green-600">Completed</p>

                </div>
              ))}
          </>
        )}

      </div>
    </>
  );
}