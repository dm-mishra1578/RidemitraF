import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/dashboard/Index";
// import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";

import Ride from "./pages/Ride";
import Vehicle from "./pages/Vehicle";
import Driver from "./pages/Driver";

import DriverDash from "./pages/DriverDash";
import OwnerDash from "./pages/OwnerDash";
import AdminDash from "./pages/AdminDash";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/services" element={
          <ProtectedRoute><Services /></ProtectedRoute>
        } />

        <Route path="/ride" element={
          <ProtectedRoute><Ride /></ProtectedRoute>
        } />

        <Route path="/vehicle" element={
          <ProtectedRoute><Vehicle /></ProtectedRoute>
        } />

        <Route path="/driver" element={
          <ProtectedRoute><Driver /></ProtectedRoute>
        } />

        <Route path="/driver-dashboard" element={<ProtectedRoute><DriverDash /></ProtectedRoute>} />
        <Route path="/owner-dashboard" element={<ProtectedRoute><OwnerDash /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDash /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;