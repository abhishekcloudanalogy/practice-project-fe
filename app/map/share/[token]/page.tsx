'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const SharedMap = dynamic(() => import('./SharedMap'), { ssr: false, loading: () => <p style={{ padding: 20 }}>Loading map...</p> });

interface SharedLocation {
  label?: string;
  latitude: number;
  longitude: number;
}

export default function SharedLocationPage() {
  const { token } = useParams<{ token: string }>();
  const [location, setLocation] = useState<SharedLocation | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const baseURL = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:4000';
    fetch(`${baseURL}/api/map/share/${token}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setLocation(res.data);
        else setError('Location not found or link is invalid.');
      })
      .catch(() => setError('Failed to load location.'));
  }, [token]);

  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-500 text-base px-4 text-center">
      {error}
    </div>
  );

  if (!location) return (
    <div className="flex items-center justify-center h-screen text-sm">
      Loading shared location...
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="px-4 py-3 bg-[#1677ff] text-white">
        <div className="font-semibold text-sm sm:text-base truncate">📍 {location.label}</div>
        <div className="text-xs opacity-80 mt-0.5">
          {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <SharedMap latitude={location.latitude} longitude={location.longitude} label={location.label} />
      </div>
    </div>
  );
}
