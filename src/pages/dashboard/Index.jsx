import React, { useState } from "react";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

import useDashboardData from "./hooks/useDashboardData";

import RideIncoming from "./components/RideIncoming";
import MyRide from "./components/Myride";
import DriverBookings from "./components/DriverBookings";
import VehicleBookings from "./components/VehicleBookings";
import MyRides from "./components/MyRides";
import Tabs from "./components/Tabs";
import NavButtons from "./components/NavButtons";

export default function Dashboard() {

  const navigate = useNavigate();
  const [tab, setTab] = useState("incoming");

  const {
    incoming,
    myRequests,
    rides,
    driverReq,
    vehicleReq,
    loadData
  } = useDashboardData();

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 pt-20">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Dashboard
        </h1>

        <NavButtons navigate={navigate} />

        <Tabs tab={tab} setTab={setTab} />

        {tab === "incoming" && (
          <RideIncoming data={incoming} reload={loadData} />
        )}

        {tab === "myreq" && (
          <MyRide data={myRequests} reload={loadData} />
        )}

        {tab === "driver" && (
          <DriverBookings data={driverReq} />
        )}

        {tab === "vehicle" && (
          <VehicleBookings data={vehicleReq} />
        )}

        {tab === "rides" && (
          <MyRides data={rides} />
        )}

      </div>
    </>
  );
}