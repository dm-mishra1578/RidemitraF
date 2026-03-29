import { useState } from "react";
import API from "../../../api/axios";
import ChatBox from "../../../components/ChatBox";

export default function VehicleBookings({ data, reload }) {

  const [otpMap, setOtpMap] = useState({});

  if (!data.length) return <p>No vehicle bookings</p>;

  // ❌ CANCEL
  const cancel = async (id) => {
    try {
      await API.patch(`/vehicles/cancel/${id}`);
      reload && reload();
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  // 🔐 VERIFY OTP
  const verifyOtp = async (id) => {
    try {
      await API.patch("/vehicles/verify-otp", {
        bookingId: id,
        otp: otpMap[id]
      });

      alert("Vehicle started");
      reload && reload();

    } catch {
      alert("Invalid OTP");
    }
  };

  // 💰 PAYMENT
  const pay = async (id) => {
    try {
      await API.post("/vehicles/pay", { bookingId: id });
      alert("Payment successful");
      reload && reload();
    } catch {
      alert("Payment failed");
    }
  };

  return data.map(b => (
    <div key={b._id} className="border p-4 mb-3 rounded space-y-2">

      <p><b>Vehicle:</b> {b.vehicleId?.name}</p>
      <p>Status: {b.status}</p>
      <p>₹{b.totalPrice}</p>

      {/* PENDING */}
      {b.status === "pending" && (
        <button
          onClick={() => cancel(b._id)}
          className="bg-red-500 text-white px-3 py-1 rounded">
          Cancel
        </button>
      )}

      {/* CONFIRMED */}
      {b.status === "confirmed" && (
        <>
          <p className="text-blue-600">Enter OTP to start</p>

          {b.chatId && <ChatBox chatId={b.chatId} />}

          <div className="flex gap-2">
            <input
              placeholder="Enter OTP"
              value={otpMap[b._id] || ""}
              onChange={(e) =>
                setOtpMap({
                  ...otpMap,
                  [b._id]: e.target.value
                })
              }
              className="border p-2 rounded"
            />

            <button
              onClick={() => verifyOtp(b._id)}
              className="bg-green-600 text-white px-3 py-1 rounded">
              Verify
            </button>
          </div>
        </>
      )}

      {/* ONGOING */}
      {b.status === "ongoing" && (
        <p className="text-yellow-600">Vehicle in use</p>
      )}

      {/* COMPLETED */}
      {b.status === "completed" && (
        <button
          onClick={() => pay(b._id)}
          className="bg-purple-600 text-white px-3 py-1 rounded">
          Pay
        </button>
      )}

      {/* PAID */}
      {b.status === "paid" && (
        <p className="text-green-600 font-bold">Paid</p>
      )}

    </div>
  ));
}