import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "./Navbar";
import ChatBox from "../components/ChatBox";

export default function OwnerDashboard() {

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    pricePerHour: ""
  });

  const loadData = async () => {
    try {
      const v = await API.get("/vehicles/owner");
      const b = await API.get("/vehicles/owner-bookings");

      setVehicles(v.data || []);
      setBookings(b.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ➕ ADD VEHICLE
  const addVehicle = async () => {
    try {
      await API.post("/vehicles/create", form);

      setForm({
        name: "",
        type: "",
        capacity: "",
        location: "",
        pricePerHour: ""
      });

      loadData();
    } catch {
      alert("Error adding vehicle");
    }
  };

  // ✅ ACCEPT (OTP SHOW)
  const accept = async (id) => {
    try {
      const res = await API.patch(`/vehicles/accept/${id}`);
      alert(`OTP: ${res.data.otp}`);
      loadData();
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  // ✅ COMPLETE
  const complete = async (id) => {
    try {
      await API.patch(`/vehicles/complete/${id}`);
      loadData();
    } catch {
      alert("Error completing ride");
    }
  };

  // 💸 PAYMENT
  const pay = async (id) => {
    try {
      await API.post("/vehicles/pay", { bookingId: id });
      alert("Payment received");
      loadData();
    } catch {
      alert("Payment error");
    }
  };

  // 💰 EARNINGS (ONLY PAID)
  const earnings = bookings
    .filter(b => b.status === "paid")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 pt-20 space-y-10">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          🚗 Owner Dashboard
        </h1>

        {/* 🔥 STATS */}
        <div className="grid md:grid-cols-3 gap-4">

          <div className="bg-white shadow p-4 rounded text-center">
            <p>Total Vehicles</p>
            <h2 className="text-2xl">{vehicles.length}</h2>
          </div>

          <div className="bg-white shadow p-4 rounded text-center">
            <p>Total Bookings</p>
            <h2 className="text-2xl">{bookings.length}</h2>
          </div>

          <div className="bg-white shadow p-4 rounded text-center">
            <p>Earnings</p>
            <h2 className="text-2xl text-green-600">₹{earnings}</h2>
          </div>

        </div>

        {/* ➕ ADD VEHICLE */}
        <div className="bg-white shadow-lg p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Add Vehicle</h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded" />

            <input placeholder="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border p-2 rounded" />

            <input placeholder="Capacity" type="number"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="border p-2 rounded" />

            <input placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border p-2 rounded" />

            <input placeholder="Price" type="number"
              value={form.pricePerHour}
              onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
              className="border p-2 rounded" />

          </div>

          <button
            onClick={addVehicle}
            className="bg-green-600 text-white px-4 py-2 rounded">
            Add Vehicle
          </button>
        </div>

        {/* 🚗 VEHICLES */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">My Vehicles</h2>

          {vehicles.map((v) => (
            <div key={v._id} className="border p-4 mb-3 rounded">

              <p><b>{v.name}</b></p>
              <p>{v.type}</p>
              <p>{v.location}</p>
              <p>₹{v.pricePerHour}</p>

              <p className={v.isAvailable ? "text-green-600" : "text-red-600"}>
                {v.isAvailable ? "Available" : "Busy"}
              </p>

            </div>
          ))}
        </div>

        {/* 📥 BOOKINGS */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Bookings</h2>

          {bookings.map((b) => (
            <div key={b._id} className="border p-4 mb-3 rounded space-y-2">

              <p><b>{b.userId?.name}</b></p>
              <p><b>Vehicle:</b> {b.vehicleId?.name}</p>
              <p>Status: {b.status}</p>
              <p>₹{b.totalPrice}</p>

              {/* PENDING */}
              {b.status === "pending" && (
                <button
                  onClick={() => accept(b._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded">
                  Accept
                </button>
              )}

              {/* CONFIRMED */}
              {b.status === "confirmed" && (
                <>
                  <p className="text-blue-600">Waiting for OTP</p>
                  {b.chatId && <ChatBox chatId={b.chatId} />}
                </>
              )}

              {/* ONGOING */}
              {b.status === "ongoing" && (
                <>
                  <p className="text-yellow-600">In Use</p>
                  <button
                    onClick={() => complete(b._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded">
                    Complete
                  </button>
                </>
              )}

              {/* COMPLETED */}
              {b.status === "completed" && (
                <button
                  onClick={() => pay(b._id)}
                  className="bg-purple-600 text-white px-3 py-1 rounded">
                  Collect Payment
                </button>
              )}

              {/* PAID */}
              {b.status === "paid" && (
                <p className="text-green-700 font-bold">Paid</p>
              )}

            </div>
          ))}
        </div>

      </div>
    </>
  );
}