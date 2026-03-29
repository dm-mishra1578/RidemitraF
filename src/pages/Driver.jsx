import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "./Navbar";

export default function Driver() {

  const [price, setPrice] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [bookings, setBookings] = useState([]);

  // CREATE PROFILE
  const createProfile = async () => {
    try {
      await API.post("/drivers/create", {
        pricePerHour: price
      });
      alert("Driver profile created");
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  // GET DRIVERS
  const getDrivers = async () => {
    try {
      const res = await API.get("/drivers");
      setDrivers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // REQUEST DRIVER
  const requestDriver = async (driverId) => {
    try {
      await API.post("/drivers/request", {
        driverId,
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
      });
      alert("Driver requested");
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  // GET BOOKINGS
  const getBookings = async () => {
    try {
      const res = await API.get("/drivers/bookings");
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const acceptBooking = async (id) => {
    await API.patch(`/drivers/accept/${id}`);
    getBookings();
  };

  const completeBooking = async (id) => {
    await API.patch(`/drivers/complete/${id}`);
    getBookings();
  };

  useEffect(() => {
    getDrivers();
    getBookings();
  }, []);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 pt-20 space-y-10">

        <h1 className="text-3xl font-bold text-center">
          Driver Hire
        </h1>

        {/* BECOME DRIVER */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">
            Become Driver
          </h2>

          <div className="flex gap-4">
            <input
              className="border p-2 rounded w-full"
              type="number"
              placeholder="Price per hour"
              onChange={(e) => setPrice(e.target.value)}
            />

            <button
              onClick={createProfile}
              className="bg-blue-600 text-white px-6 rounded"
            >
              Create
            </button>
          </div>
        </div>

        {/* DRIVER LIST */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">
            Available Drivers
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            {drivers.map((d) => (
              <div key={d._id} className="border p-4 rounded shadow">

                <p className="font-semibold">
                  ₹{d.pricePerHour}/hr
                </p>

                <button
                  onClick={() => requestDriver(d._id)}
                  className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
                >
                  Request Driver
                </button>

              </div>
            ))}

          </div>
        </div>

        {/* BOOKINGS */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">
            Your Bookings
          </h2>

          <div className="space-y-4">

            {bookings.length === 0 && <p>No bookings</p>}

            {bookings.map((b) => (
              <div key={b._id} className="border p-4 rounded shadow">

                <p className="font-semibold">
                  Status:
                  <span className={`ml-2
                    ${b.status === "pending" && "text-yellow-600"}
                    ${b.status === "accepted" && "text-blue-600"}
                    ${b.status === "ongoing" && "text-purple-600"}
                    ${b.status === "completed" && "text-green-600"}
                  `}>
                    {b.status}
                  </span>
                </p>

                {/* PENDING */}
                {b.status === "pending" && (
                  <button
                    onClick={() => acceptBooking(b._id)}
                    className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Accept
                  </button>
                )}

                {/* ONGOING */}
                {b.status === "ongoing" && (
                  <button
                    onClick={() => completeBooking(b._id)}
                    className="mt-2 bg-purple-600 text-white px-4 py-1 rounded"
                  >
                    Complete
                  </button>
                )}

                {/* COMPLETED */}
                {b.status === "completed" && (
                  <p className="text-green-600 mt-2">
                    Job Completed
                  </p>
                )}

              </div>
            ))}

          </div>
        </div>

      </div>
    </>
  );
}