import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "./Navbar";

export default function Vehicle() {

  const [form, setForm] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  // ADD VEHICLE
  const addVehicle = async () => {
    try {
      await API.post("/vehicles/add", form);
      alert("Vehicle added");
      getVehicles();
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  // GET VEHICLES
  const getVehicles = async () => {
    try {
      const res = await API.get("/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // BOOK VEHICLE
  const bookVehicle = async (vehicleId) => {
    try {
      await API.post("/vehicles/book", {
        vehicleId,
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
      });
      alert("Vehicle booked");
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  // OWNER BOOKINGS
  const getOwnerBookings = async () => {
    try {
      const res = await API.get("/vehicles/owner-bookings");
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const completeBooking = async (id) => {
    await API.patch(`/vehicles/complete/${id}`);
    getOwnerBookings();
  };

  const cancelBooking = async (id) => {
    await API.patch(`/vehicles/cancel/${id}`);
    getOwnerBookings();
  };

  useEffect(() => {
    getVehicles();
    getOwnerBookings();
  }, []);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 pt-20 space-y-10">

        <h1 className="text-3xl font-bold text-center">
          Vehicle Renting
        </h1>

        {/* ADD VEHICLE */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">
            Add Vehicle
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded"
              placeholder="Vehicle Name"
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Price per hour"
              onChange={e => setForm({ ...form, pricePerHour: e.target.value })}
            />
          </div>

          <button
            onClick={addVehicle}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
          >
            Add Vehicle
          </button>
        </div>

        {/* VEHICLE LIST */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">
            Available Vehicles
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            {vehicles.map(v => (
              <div key={v._id} className="border p-4 rounded shadow">

                <p className="font-semibold">
                  {v.name}
                </p>

                <p className="text-gray-600">
                  ₹{v.pricePerHour}/hr
                </p>

                <button
                  onClick={() => bookVehicle(v._id)}
                  className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
                >
                  Book Vehicle
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

            {bookings.map(b => (
              <div key={b._id} className="border p-4 rounded shadow">

                <p className="font-semibold">
                  {b.vehicleId?.name}
                </p>

                <p>
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
                    onClick={() => cancelBooking(b._id)}
                    className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Cancel
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
                    Completed
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