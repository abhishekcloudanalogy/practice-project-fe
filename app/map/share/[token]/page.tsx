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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 18, color: 'red' }}>
      {error}
    </div>
  );

  if (!location) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 16 }}>
      Loading shared location...
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', background: '#1677ff', color: '#fff', fontSize: 15, fontWeight: 600 }}>
        <div>📍 {location.label }</div>
    <small>
        {location.latitude.toFixed(5)},
        {location.longitude.toFixed(5)}
    </small>
      </div>
      <div style={{ flex: 1 }}>
        <SharedMap latitude={location.latitude} longitude={location.longitude} label={location.label} />
      </div>
    </div>
  );
}
