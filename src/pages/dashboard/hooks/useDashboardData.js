import { useEffect, useState } from "react";
import API from "../../../api/axios";

export default function useDashboardData() {

  const [incoming, setIncoming] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [rides, setRides] = useState([]);
  const [driverReq, setDriverReq] = useState([]);
  const [vehicleReq, setVehicleReq] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadData = async () => {
    try {
      const [inc, my, ride, dr, vr] = await Promise.all([
        API.get("/rides/requests"),
        API.get("/rides/my-requests"),
        API.get("/rides/my-rides"),
        API.get("/drivers/my-requests"),
        API.get("/vehicles/my-bookings"),
      ]);

      setIncoming(inc.data || []);
      setMyRequests(my.data || []);
      setRides(ride.data || []);
      setDriverReq(dr.data || []);
      setVehicleReq(vr.data || []);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, []);

  return {
    incoming,
    myRequests,
    rides,
    driverReq,
    vehicleReq,
    loadData
  };
}