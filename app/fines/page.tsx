"use client";
import { useEffect, useState } from "react";
import { database } from "../../src/lib/firebase";
import { ref, onValue } from "firebase/database";
import Link from 'next/link';

interface Fine {
  speed: number;
  lat: number;
  lon: number;
  duration: number;
  id: string;
}

export default function FinesPage() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  };

  useEffect(() => {
    const finesRef = ref(database, 'fines');
    const unsubscribe = onValue(finesRef, (snapshot) => {
      
      try {
        const data = snapshot.val();
        if (data) {
          const finesArray = Object.keys(data).map(key => ({
            ...data[key],
            id: key,
            duration: Number(data[key].duration) || 0,
            lat: Number(data[key].lat) || 0,
            lon: Number(data[key].lon) || 0,
            speed: Number(data[key].speed) || 0
          }));
          setFines(finesArray.reverse());
        } else {
          setFines([]);
        }
        setError(null);
      } catch (firebaseError) {
        console.error('Firebase data error:', firebaseError);
        setError('Error loading fines data');
        setFines([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Fines History</h1>
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className=" px-4 py-2 border-2 rounded-lg text-black cursor-pointer">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 p-4 rounded-lg mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 py-8">
            Loading fines...
          </div>
        ) : (
          <div className="space-y-4">
            {fines.map((fine) => (
              <div key={fine.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {fine.speed.toFixed(1)} km/h
                    </h3>
                    <p className="text-sm text-gray-600">
                      Duration: {formatDuration(fine.duration)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Location: {fine.lat?.toFixed(6)}, {fine.lon?.toFixed(6)}
                    </p>
                  </div>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ₹500
                  </span>
                </div>
              </div>
            ))}

            {fines.length === 0 && !error && (
              <div className="text-center text-gray-500 py-8">
                No fines recorded yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
 