import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "user"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {

      const res = await API.post("/auth/register", form);

      alert(res.data.message);

      // 👉 if driver/owner → pending
      if (res.data.status === "pending") {
        alert("Waiting for admin approval");
      }

      navigate("/login");

    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded space-y-4">

        <h2 className="text-2xl font-bold text-center">
          Register
        </h2>

        <input name="name" placeholder="Name"
          className="border p-2 w-full"
          onChange={handleChange} />

        <input name="email" placeholder="Email"
          className="border p-2 w-full"
          onChange={handleChange} />

        <input name="phone" placeholder="Phone"
          className="border p-2 w-full"
          onChange={handleChange} />

        <input name="address" placeholder="Address"
          className="border p-2 w-full"
          onChange={handleChange} />

        <input name="password" type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={handleChange} />

        {/* ROLE SELECT */}
        <select name="role"
          className="border p-2 w-full"
          onChange={handleChange}>

          <option value="user">User</option>
          <option value="driver">Driver</option>
          <option value="owner">Vehicle Owner</option>
          

        </select>

        {/* DL FIELD (ONLY DRIVER & OWNER) */}
        {(form.role === "driver" || form.role === "owner") && (
          <input name="dlNumber"
            placeholder="Driving License"
            className="border p-2 w-full"
            onChange={handleChange} />
        )}

        <button
          onClick={submit}
          className="bg-blue-600 text-white w-full py-2"
        >
          Register
        </button>

      </div>
    </>
  );
}