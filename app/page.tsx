"use client";
import { useState, useEffect } from "react";
import { database } from "../src/lib/firebase"; 
import { ref, onValue } from "firebase/database";
import Link from 'next/link';

interface CarData {
  speed: number;
  seatbelt: boolean;
  lat: number;
  lon: number;
  speed_violation: boolean;
  seatbelt_violation: boolean;
  speed_fine: boolean;
  violation_duration: number;
  timestamp: number;
}

export default function Home() {
  const [carData, setCarData] = useState<CarData>({
    speed: 0,
    seatbelt: false,
    lat: 0,
    lon: 0,
    speed_violation: false,
    seatbelt_violation: false,
    speed_fine: false,
    violation_duration: 0,
    timestamp: 0
  });
  const [currentTime, setCurrentTime] = useState<string>("");

  // Updated clock function with date display
  const updateClock = () => {
    const now = new Date();
    const date = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    
    let hours = now.getHours();
    const meridian = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const hoursStr = hours.toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const timeString = `${date} ${hoursStr}:${minutes}:${seconds} ${meridian}`;
    setCurrentTime(timeString);
  };

  useEffect(() => {
    // Update clock immediately and then every second
    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    // Firebase data listener
    const carDataRef = ref(database, "car_Data");
    const unsubscribe = onValue(carDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const keys = Object.keys(data);
        const latestKey = keys.reduce((a, b) => a > b ? a : b);
        const latestData = data[latestKey];

        const newData = {
          speed: latestData.speed || 0,
          seatbelt: !!latestData.seatbelt,
          lat: latestData.lat || 0,
          lon: latestData.lon || 0,
          speed_violation: !!latestData.speed_violation,
          seatbelt_violation: !!latestData.seatbelt_violation,
          speed_fine: !!latestData.speed_fine,
          violation_duration: latestData.violation_duration || 0,
          timestamp: latestData.timestamp || 0
        };

        setCarData(newData);
      }
    });

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          MH 15 7678
        </h1>
        
        <div className="space-y-4">
        <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Speed:</span>
            <span className="text-blue-600 font-semibold">
              {carData.speed.toFixed(1)} km/h
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Seatbelt:</span>
            <span className={`font-semibold ${carData.seatbelt ? "text-green-600" : "text-red-600"}`}>
              {carData.seatbelt ? "ENGAGED" : "DISENGAGED"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Latitude:</span>
            <span className="text-blue-600 font-semibold">
              {carData.lat.toFixed(6)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Longitude:</span>
            <span className="text-blue-600 font-semibold">
              {carData.lon.toFixed(6)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Speed Violation:</span>
            <span className={`font-semibold ${carData.speed_violation ? "text-red-600" : "text-green-600"}`}>
              {carData.speed_violation ? "YES" : "NO"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Seatbelt Violation:</span>
            <span className={`font-semibold ${carData.seatbelt_violation ? "text-red-600" : "text-green-600"}`}>
              {carData.seatbelt_violation ? "YES" : "NO"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Speed Fine Issued:</span>
            <span className={`font-semibold ${carData.speed_fine ? "text-red-600" : "text-green-600"}`}>
              {carData.speed_fine ? "YES" : "NO"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Violation Duration:</span>
            <span className="text-blue-600 font-semibold">
              {(carData.violation_duration / 1000).toFixed(0)} seconds
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Current Date & Time:</span>
            <span className="text-blue-600 font-semibold text-sm">
              {currentTime || "N/A"}
            </span>
          </div>

          <Link href="/fines">
            <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              View Fines History
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}