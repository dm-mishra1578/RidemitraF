import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "./Navbar";

export default function Service() {

  const [form, setForm] = useState({
    source: "",
    destination: "",
    price: "",
    seatsTotal: ""
  });

  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [search, setSearch] = useState({
    source: "",
    destination: "",
    location: ""
  });

  // LOAD
  const loadRides = async () => {
    const res = await API.get("/rides/search", {
      params: { source: search.source, destination: search.destination }
    });
    setRides(res.data || []);
  };

  const loadDrivers = async () => {
    const res = await API.get("/drivers");
    setDrivers(res.data || []);
  };

  const loadVehicles = async () => {
    const res = await API.get("/vehicles");
    setVehicles(res.data || []);
  };

  // CREATE RIDE
  const createRide = async () => {
    try {
      if (!form.source || !form.destination || !form.price || !form.seatsTotal) {
        return alert("Fill all fields");
      }

      await API.post("/rides/create", form);
      alert("Ride created");

      setForm({
        source: "",
        destination: "",
        price: "",
        seatsTotal: ""
      });

      loadRides();

    } catch (err) {
      alert("Error creating ride");
    }
  };

  // JOIN
  const joinRide = async (rideId) => {
    await API.post("/rides/request", { rideId, seats: 1 });
    alert("Request sent");
  };

  // DRIVER
  const hireDriver = async (driverId) => {
    try {
      await API.post("/drivers/request", {
        driverId,
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
      });

      alert("Driver request sent");
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  // VEHICLE
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

  // FILTERS
  const filteredDrivers = drivers.filter(d =>
    d.isAvailable &&
    (search.location === "" ||
      d.userId?.address?.toLowerCase().includes(search.location.toLowerCase()))
  );

  const filteredVehicles = vehicles.filter(v =>
    search.location === "" ||
    v.location?.toLowerCase().includes(search.location.toLowerCase())
  );

  useEffect(() => {
    loadRides();
    loadDrivers();
    loadVehicles();
  }, []);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 pt-20 space-y-10">

        <h1 className="text-4xl font-extrabold text-center text-blue-700">
          🚀 Services
        </h1>

        {/* SEARCH */}
        <div className="bg-white shadow p-6 rounded grid md:grid-cols-4 gap-4">
          <input placeholder="Source" className="border p-2"
            onChange={(e) => setSearch({ ...search, source: e.target.value })} />

          <input placeholder="Destination" className="border p-2"
            onChange={(e) => setSearch({ ...search, destination: e.target.value })} />

          <input placeholder="Location" className="border p-2"
            onChange={(e) => setSearch({ ...search, location: e.target.value })} />

          <button onClick={loadRides}
            className="bg-blue-600 text-white rounded">
            Search
          </button>
        </div>

        {/* 🔥 CREATE RIDE (RESTORED) */}
        <div className="bg-white shadow p-6 rounded space-y-4">
          <h2 className="text-xl font-bold">➕ Create Ride</h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input placeholder="Source"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="border p-2" />

            <input placeholder="Destination"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              className="border p-2" />

            <input placeholder="Price" type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border p-2" />

            <input placeholder="Seats" type="number"
              value={form.seatsTotal}
              onChange={(e) => setForm({ ...form, seatsTotal: e.target.value })}
              className="border p-2" />

          </div>

          <button onClick={createRide}
            className="bg-green-600 text-white px-4 py-2 rounded">
            Create Ride
          </button>
        </div>

        {/* RIDES */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-bold">🚘 Rides</h2>

          {rides.length === 0 && <p>No rides found</p>}

          {rides.map(r => (
            <div key={r._id} className="border p-4 mb-3 flex justify-between">
              <div>
                <p>{r.source} → {r.destination}</p>
                <p>Seats: {r.seatsAvailable}</p>
              </div>
              <button
                onClick={() => joinRide(r._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded">
                Join
              </button>
            </div>
          ))}
        </div>

        {/* DRIVERS */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-bold">🚖 Drivers</h2>

          {filteredDrivers.length === 0 && <p>No drivers available</p>}

          {filteredDrivers.map(d => (
            <div key={d._id} className="border p-4 mb-3 flex justify-between">
              <div>
                <p>{d.userId?.name}</p>
                <p>₹{d.pricePerHour}</p>
              </div>
              <button onClick={() => hireDriver(d._id)}
                className="bg-purple-500 text-white px-3 py-1 rounded">
                Hire
              </button>
            </div>
          ))}
        </div>

        {/* VEHICLES */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-bold">🚗 Vehicles</h2>

          {filteredVehicles.length === 0 && <p>No vehicles available</p>}

          {filteredVehicles.map(v => (
            <div key={v._id} className="border p-4 mb-3 flex justify-between">
              <div>
                <p>{v.name}</p>
                <p>₹{v.pricePerHour}</p>
              </div>
              <button onClick={() => bookVehicle(v._id)}
                className="bg-red-500 text-white px-3 py-1 rounded">
                Book
              </button>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}