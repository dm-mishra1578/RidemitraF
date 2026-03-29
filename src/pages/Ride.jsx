import { useState, useEffect } from "react";
import API from "../api/axios";
import ChatBox from "../components/ChatBox";
import OtpBox from "../components/OtpBox";
import Navbar from "./Navbar";

export default function Ride() {

  const [form, setForm] = useState({});
  const [rides, setRides] = useState([]);
  const [requests, setRequests] = useState([]);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // CREATE RIDE
  const createRide = async () => {
    try {
      await API.post("/rides/create", form);
      alert("Ride created");
      searchRide();
    } catch (err) {
      alert(err.response?.data);
    }
  };

  // SEARCH RIDE
  const searchRide = async () => {
    try {
      const res = await API.get("/rides/search", {
        params: {
          source: form.source,
          destination: form.destination
        }
      });
      setRides(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // REQUEST RIDE
  const requestRide = async (rideId) => {
    try {
      await API.post("/rides/request", {
        rideId,
        seats: 1
      });
      alert("Requested");
    } catch (err) {
      alert(err.response?.data);
    }
  };

  // GET REQUESTS (FOR RIDE OWNER)
  const getRequests = async () => {
    try {
      const res = await API.get("/rides/requests");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ACCEPT
  const accept = async (id) => {
    await API.patch(`/rides/accept/${id}`);
    getRequests();
  };

  // REJECT
  const reject = async (id) => {
    await API.patch(`/rides/reject/${id}`);
    getRequests();
  };

  // COMPLETE
  const complete = async (id) => {
    await API.patch(`/rides/complete/${id}`);
    getRequests();
  };

  useEffect(() => {
    if (user) {
      getRequests();
    }
  }, [user]);

  if (!user) {
    return <div className="text-center mt-20">Login required</div>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 pt-20 space-y-10">

        <h1 className="text-3xl font-bold text-center">
          Ride Sharing
        </h1>

        {/* CREATE */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="font-semibold mb-4">Create Ride</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              className="border p-2 rounded"
              placeholder="Source"
              onChange={e => setForm({ ...form, source: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Destination"
              onChange={e => setForm({ ...form, destination: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Seats"
              onChange={e => setForm({ ...form, seatsTotal: e.target.value })}
            />
          </div>

          <button
            onClick={createRide}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
          >
            Create Ride
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="font-semibold mb-4">Available Rides</h2>

          <button
            onClick={searchRide}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>

          <div className="grid md:grid-cols-2 gap-4 mt-4">

            {rides.map(r => (
              <div key={r._id} className="border p-4 rounded">

                <p>{r.source} → {r.destination}</p>
                <p>Seats: {r.seatsAvailable}</p>

                {/* ❗ Hide request button for owner */}
                {r.driverId !== user._id && (
                  <button
                    onClick={() => requestRide(r._id)}
                    className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Request
                  </button>
                )}

              </div>
            ))}

          </div>
        </div>

        {/* REQUESTS (ONLY OWNER) */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="font-semibold mb-4">
            Incoming Requests
          </h2>

          {requests.map(req => (

            <div key={req._id} className="border p-4 rounded mb-3">

              <p>Status: {req.status}</p>

              {/* ❗ Only ride creator can see buttons */}
              {req.isOwner && req.status === "pending" && (
                <>
                  <button
                    onClick={() => accept(req._id)}
                    className="bg-green-600 text-white px-3 py-1 mr-2"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => reject(req._id)}
                    className="bg-red-600 text-white px-3 py-1"
                  >
                    Reject
                  </button>
                </>
              )}

              {req.status === "accepted" && (
                <>
                  <ChatBox chatId={req.chatId} />
                  <OtpBox requestId={req._id} refresh={getRequests} />
                </>
              )}

              {req.status === "ongoing" && (
                <button
                  onClick={() => complete(req._id)}
                  className="bg-purple-600 text-white px-3 py-1"
                >
                  Complete
                </button>
              )}

            </div>

          ))}

        </div>

      </div>
    </>
  );
}