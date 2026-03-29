import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "./Navbar";
import ChatBox from "../components/ChatBox";
import OtpBox from "../components/OtpBox";

export default function Dashboard() {

  const navigate = useNavigate();

  const [incoming, setIncoming] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [rides, setRides] = useState([]);
  const [driverReq, setDriverReq] = useState([]);
  const [vehicleReq, setVehicleReq] = useState([]);

  const [tab, setTab] = useState("incoming");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadData = async () => {
    try {
      const [inc, my, ride, dr, vr] = await Promise.all([
        API.get("/rides/requests"),
        API.get("/rides/my-requests"),
        API.get("/rides/my-rides"),
        API.get("/drivers/my-requests"),
        API.get("/vehicles/my-bookings"),
      ]);

      setIncoming(inc.data || []);
      setMyRequests(my.data || []);
      setRides(ride.data || []);
      setDriverReq(dr.data || []);
      setVehicleReq(vr.data || []);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, []);

  if (!user) return <div>Login required</div>;

  // ================= RIDE =================
  const accept = async (id) => {
    await API.patch(`/rides/accept/${id}`);
    loadData();
  };

  const reject = async (id) => {
    await API.patch(`/rides/reject/${id}`);
    loadData();
  };

  const complete = async (id) => {
    await API.patch(`/rides/complete/${id}`);
    loadData();
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 pt-20">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Dashboard
        </h1>

        {/* NAV */}
        <div className="flex gap-4 justify-center mb-6">
          <button onClick={() => navigate("/ride")}>Ride</button>
          <button onClick={() => navigate("/driver")}>Driver</button>
          <button onClick={() => navigate("/vehicle")}>Vehicle</button>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 border-b pb-2">
          <button onClick={() => setTab("incoming")}>Ride Incoming</button>
          <button onClick={() => setTab("myreq")}>My Ride</button>
          <button onClick={() => setTab("driver")}>Driver</button>
          <button onClick={() => setTab("vehicle")}>Vehicle</button>
          <button onClick={() => setTab("rides")}>My Rides</button>
        </div>

        {/* ================= RIDE INCOMING ================= */}
        {tab === "incoming" && (
          <>
            {incoming.length === 0 && <p>No requests</p>}

            {incoming.map(req => (
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
                    <p className="text-green-600">OTP: {req.otp}</p>
                    {req.chatId && <ChatBox chatId={req.chatId} />}
                  </>
                )}

                {req.status === "ongoing" && (
                  <button onClick={() => complete(req._id)}>
                    Complete
                  </button>
                )}

              </div>
            ))}
          </>
        )}

        {/* ================= MY RIDE ================= */}
        {tab === "myreq" && (
          <>
            {myRequests.length === 0 && <p>No ride requests</p>}

            {myRequests.map(r => (
              <div key={r._id} className="border p-4 mb-3 rounded">

                <p><b>{r.rideId?.source} → {r.rideId?.destination}</b></p>
                <p>Status: {r.status}</p>

                {r.status === "accepted" && (
                  <>
                    {r.chatId && <ChatBox chatId={r.chatId} />}
                    <OtpBox requestId={r._id} refresh={loadData} />
                  </>
                )}

                {r.status === "ongoing" && (
                  <p className="text-blue-600">Ride Started</p>
                )}

                {r.status === "completed" && (
                  <p className="text-green-600">Completed</p>
                )}

              </div>
            ))}
          </>
        )}

        {/* ================= DRIVER ================= */}
        {tab === "driver" && (
          <>
            {driverReq.length === 0 && <p>No driver bookings</p>}

            {driverReq.map(b => (
              <div key={b._id} className="border p-4 mb-3 rounded">

                <p><b>Driver:</b> {b.driverId?.userId?.name || "Driver"}</p>
                <p>Status: {b.status}</p>
                <p>₹{b.totalPrice}</p>

                {b.status === "accepted" && (
                  <p className="text-blue-600">Driver Assigned</p>
                )}

                {b.status === "ongoing" && (
                  <p className="text-yellow-600">Ride in Progress</p>
                )}

                {b.status === "completed" && (
                  <p className="text-green-600">Completed</p>
                )}

              </div>
            ))}
          </>
        )}

        {/* ================= VEHICLE ================= */}
        {tab === "vehicle" && (
          <>
            {vehicleReq.length === 0 && <p>No vehicle bookings</p>}

            {vehicleReq.map(b => (
              <div key={b._id} className="border p-4 mb-3 rounded">

                <p><b>Vehicle:</b> {b.vehicleId?.name}</p>
                <p>Status: {b.status}</p>
                <p>₹{b.totalPrice}</p>

                {b.status === "accepted" && (
                  <p className="text-blue-600">Vehicle Reserved</p>
                )}

                {b.status === "ongoing" && (
                  <p className="text-yellow-600">In Use</p>
                )}

                {b.status === "completed" && (
                  <p className="text-green-600">Completed</p>
                )}

              </div>
            ))}
          </>
        )}

        {/* ================= MY RIDES ================= */}
        {tab === "rides" && (
          <>
            {rides.length === 0 && <p>No rides created</p>}

            {rides.map(r => (
              <div key={r._id} className="border p-3 mb-2 rounded">
                {r.source} → {r.destination}
              </div>
            ))}
          </>
        )}

      </div>
    </>
  );
}