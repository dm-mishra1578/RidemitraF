import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Slider Data
const sliderImages = [
  "/slider1.jpg",
  "/slider2.jpg",
  "/slider3.jpg",
];

// Services Data (DRY Principle)
const services = [
  { id: "ride", icon: "🚕", title: "Ride Sharing", path: "/ride" },
  { id: "vehicle", icon: "🚗", title: "Vehicle Rent", path: "/vehicle" },
  { id: "driver", icon: "🧑‍✈️", title: "Driver Hire", path: "/driver" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  // Auto-slider logic
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000); // 4 seconds for better readability
    return () => clearInterval(interval);
  }, []);

  // Auth Protection Logic
  const handleProtectedNavigation = (path) => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate(path);
    } else {
      alert("Please login first to access this service.");
      // State helps redirect back after login if you set that up later
      navigate("/login", { state: { from: path } }); 
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={sliderImages[index]}
            alt="RideMitra Hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            RideMitra
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg md:text-2xl font-light max-w-2xl"
          >
            Your trusted partner for sharing rides, hiring professional drivers, and renting vehicles.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleProtectedNavigation("/services")}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-colors"
          >
            Explore Services
          </motion.button>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800">Our Services</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -10 }}
              onClick={() => handleProtectedNavigation(service.path)}
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-6xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm">
                Click to explore our {service.title.toLowerCase()} options.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Get in Touch</h2>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">📍</span>
                <p className="text-lg text-gray-600">Banda, Uttar Pradesh, India</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">📞</span>
                <p className="text-lg text-gray-600">+91 XXXXX XXXXX</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">📧</span>
                <p className="text-lg text-gray-600">support@ridemitra.com</p>
              </div>
            </div>

            <form className="space-y-4 bg-gray-50 p-8 rounded-2xl shadow-inner">
              <input 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
                placeholder="Full Name" 
              />
              <input 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
                placeholder="Email Address" 
                type="email"
              />
              <textarea 
                className="w-full border border-gray-300 p-3 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
                placeholder="How can we help you?" 
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition-colors shadow-md">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
