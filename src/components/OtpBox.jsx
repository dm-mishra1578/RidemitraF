import { useState } from "react";
import API from "../api/axios";

export default function OtpBox({ requestId, refresh }) {

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {

    // ❌ validation
    if (!otp.trim()) {
      alert("Enter OTP");
      return;
    }

    if (otp.length !== 4) {
      alert("OTP must be 4 digits");
      return;
    }

    try {
      setLoading(true);

      await API.patch("/rides/verify-otp", {
        requestId,
        otp
      });

      alert("Ride Started");

      setOtp("");
      refresh();

    } catch (err) {
      alert(err.response?.data || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">

      <p className="text-sm mb-1">Enter OTP to start ride</p>

      <div className="flex gap-2">

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="4-digit OTP"
          maxLength={4}
          className="border px-2 py-1 rounded"
        />

        <button
          onClick={verify}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded">
          {loading ? "Checking..." : "Start"}
        </button>

      </div>

    </div>
  );
}