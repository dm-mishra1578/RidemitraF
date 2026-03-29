import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "user"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login success");

      // 🔹 redirect based on role
      if (res.data.user.role === "user") {
        navigate("/services");
      } else if (res.data.user.role === "driver") {
        navigate("/driver-dashboard");
      } 
      else if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      }
      else if (res.data.user.role === "owner") {
        navigate("/owner-dashboard");
      }
      else {
        navigate("/register");
      }

    } catch (err) {

      if (err.response?.status === 403) {
        alert("Waiting for admin approval");
      } else {
        alert(err.response?.data || "Login failed");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded space-y-4">

        <h2 className="text-2xl font-bold text-center">
          Login
        </h2>

        <input name="email"
          placeholder="Email"
          className="border p-2 w-full"
          onChange={handleChange} />

        <input name="password"
          type="password"
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
          <option value="admin">Admin</option>


        </select>

        <button
          onClick={submit}
          className="bg-green-600 text-white w-full py-2"
        >
          Login
        </button>

      </div>
    </>
  );
}