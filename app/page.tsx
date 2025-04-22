"use client";
import { useState, useEffect } from "react";
import { database } from "../src/lib/firebase"; 
import { ref, onValue } from "firebase/database";

export default function Home() {
  const [carData, setCarData] = useState({
    speed: 0,
    seatbelt: 0,
    lat: 0,
    lon: 0,
    speedViolation: 0,
    seatbeltViolation: 0,
    timestamp: "N/A",
  });

  // Indian time formatting function
  const getIndianTimeString = (date = new Date()) => {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fetch data from Firebase
  useEffect(() => {
    const carDataRef = ref(database, "car_Data"); // Ensure this matches your ESP32 path

    const unsubscribe = onValue(carDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const keys = Object.keys(data);
        if (keys.length === 0) return;

        const latestKey = keys.reduce((a, b) => a > b ? a : b); // Get latest key
        const latestData = data[latestKey];

        // Use current Indian time instead of device timestamp
        const now = new Date();
        
        setCarData({
          speed: latestData.speed || 0,
          seatbelt: latestData.seatbelt || 0,
          lat: latestData.lat || 0,
          lon: latestData.lon || 0,
          speedViolation: latestData.speedViolation || 0,
          seatbeltViolation: latestData.seatbeltViolation || 0,
          timestamp: getIndianTimeString(now)
        });
      }
    });

    // Update clock every second
    const interval = setInterval(() => {
      setCarData(prev => ({
        ...prev,
        timestamp: getIndianTimeString()
      }));
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Rest of the component remains exactly the same
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Car Dashboard
        </h1>
        <div className="space-y-4">
        <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Speed:</span>
            <span className="text-blue-600 font-semibold">
              {carData.speed} km/h
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Seatbelt:</span>
            <span
              className={`font-semibold ${
                carData.seatbelt ? "text-green-600" : "text-red-600"
              }`}
            >
              {carData.seatbelt ? "ON" : "OFF"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Latitude:</span>
            <span className="text-blue-600 font-semibold">{carData.lat}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Longitude:</span>
            <span className="text-blue-600 font-semibold">{carData.lon}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Speed Violation:</span>
            <span
              className={`font-semibold ${
                carData.speedViolation ? "text-red-600" : "text-green-600"
              }`}
            >
              {carData.speedViolation ? "YES" : "NO"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">
              Seatbelt Violation:
            </span>
            <span
              className={`font-semibold ${
                carData.seatbeltViolation ? "text-red-600" : "text-green-600"
              }`}
            >
              {carData.seatbeltViolation ? "YES" : "NO"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Last Updated:</span>
            <span className="text-blue-600 font-semibold">
              {carData.timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}