import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "./Navbar";

export default function AdminDash() {

  const [pending, setPending] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  // 🔹 LOAD DATA
  const load = async () => {
    try {
      setLoading(true);

      const p = await API.get("/admin/pending");
      const d = await API.get("/drivers/admin/all");
      const v = await API.get("/vehicles/admin/all");
      const u = await API.get("/admin/users"); // ⚠️ REQUIRED

      setPending(p.data || []);
      setDrivers(d.data || []);
      setVehicles(v.data || []);
      setUsers(u.data || []);

    } catch (err) {
      console.log("Admin Load Error:", err.response?.data || err.message);
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 APPROVE
  const approveUser = async (id) => {
    await API.patch(`/admin/approve/${id}`);
    load();
  };

  // 🔹 REJECT
  const rejectUser = async (id) => {
    await API.patch(`/admin/reject/${id}`);
    load();
  };

  // 🔹 DELETE VEHICLE
  const deleteVehicle = async (id) => {
    await API.delete(`/vehicles/admin/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  // 🔹 STATS
  const totalUsers = users.length;
  const totalDrivers = drivers.length;
  const totalVehicles = vehicles.length;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 pt-20 space-y-10">

        <h1 className="text-3xl font-bold text-center">
          Admin Dashboard
        </h1>

        {/* 🔥 STATS */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-blue-100 p-6 rounded shadow text-center">
            <h2 className="text-xl font-bold">Users</h2>
            <p className="text-2xl">{totalUsers}</p>
          </div>

          <div className="bg-green-100 p-6 rounded shadow text-center">
            <h2 className="text-xl font-bold">Drivers</h2>
            <p className="text-2xl">{totalDrivers}</p>
          </div>

          <div className="bg-purple-100 p-6 rounded shadow text-center">
            <h2 className="text-xl font-bold">Vehicles</h2>
            <p className="text-2xl">{totalVehicles}</p>
          </div>

        </div>

        {loading && <p className="text-center">Loading...</p>}

        {!loading && (
          <>
            {/* 🔥 PENDING APPROVALS */}
            <div className="bg-white shadow p-6 rounded">
              <h2 className="font-semibold mb-4">Pending Approvals</h2>

              {pending.length === 0 && <p>No pending requests</p>}

              {pending.map(u => (
                <div key={u._id} className="border p-3 mb-2 flex justify-between items-center">

                  <div>
                    <p><b>{u.name}</b></p>
                    <p>Role: {u.role}</p>
                  </div>

                  <div>
                    <button
                      onClick={() => approveUser(u._id)}
                      className="bg-green-600 text-white px-3 py-1 mr-2 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectUser(u._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* 🚖 DRIVERS */}
            <div className="bg-white shadow p-6 rounded">
              <h2 className="font-semibold mb-4">Drivers</h2>

              {drivers.map(d => (
                <div key={d._id} className="border p-3 mb-2 flex justify-between items-center">

                  <div>
                    <p><b>{d.name}</b></p>
                    <p>Status: {d.status}</p>
                  </div>

                  {d.status === "pending" && (
                    <div>
                      <button
                        onClick={() => approveUser(d._id)}
                        className="bg-green-600 text-white px-3 py-1 mr-2 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectUser(d._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>

            {/* 🚗 VEHICLES */}
            <div className="bg-white shadow p-6 rounded">
              <h2 className="font-semibold mb-4">Vehicles</h2>

              {vehicles.map(v => (
                <div key={v._id} className="border p-3 mb-2 flex justify-between items-center">

                  <div>
                    <p><b>{v.name}</b></p>
                    <p>₹{v.pricePerHour}</p>
                  </div>

                  <button
                    onClick={() => deleteVehicle(v._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>
              ))}
            </div>

          </>
        )}

      </div>
    </>
  );
}