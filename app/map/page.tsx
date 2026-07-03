'use client';
import React, { useEffect, useRef, useState } from 'react'
import type { Map, Icon } from 'leaflet';
import dynamic from 'next/dynamic';
import { useMap } from 'react-leaflet';
import cities from './cities.json';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

function FlyToLocation({ position }: { position: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (position) map.flyTo(position, 12);
    }, [position, map]);
    return null;
}

export default function MapPage() {
    const [center] = useState({ lat: 13.084622, lng: 80.248357 });
    const [markerIcon, setMarkerIcon] = useState<Icon | null>(null);
    const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
    const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const Zoom_LEVEL = 9;
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        import('leaflet').then((L) => {
            setMarkerIcon(new L.Icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconSize: [35, 45],
                iconAnchor: [17, 46],
                popupAnchor: [0, -46]
            }));
        });
    }, []);

    const filteredCities = searchQuery.length > 0
        ? cities.filter(c => c.city.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
        : [];

    const handleCitySelect = (city: typeof cities[0]) => {
        setFlyTo([parseFloat(city.lat), parseFloat(city.lng)]);
        setSearchQuery(city.city);
        setShowDropdown(false);
    };

    const handleLocationSearch = async () => {
        if (!searchQuery.trim()) return;
        setShowDropdown(false);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
        const data = await res.json();
        if (data.length > 0) {
            const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            setFlyTo(coords);
            setCurrentLocation(coords);
        } else {
            alert('Location not found');
        }
    };

    const handleCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setCurrentLocation(coords);
                setFlyTo(coords);
            },
            () => alert('Location access denied')
        );
    };

    return (
        <div>
            <h1>Map Page</h1>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', position: 'relative' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <input
                        type="text"
                        placeholder="Search city..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                        onFocus={() => setShowDropdown(true)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                        style={{ width: '100%', padding: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {showDropdown && filteredCities.length > 0 && (
                        <ul style={{
                            position: 'absolute', top: '100%', left: 0, right: 0,
                            background: '#fff', border: '1px solid #ccc', listStyle: 'none',
                            margin: 0, padding: 0, zIndex: 1000, maxHeight: '200px', overflowY: 'auto'
                        }}>
                            {filteredCities.map((city) => (
                                <li
                                    key={city.city}
                                    onClick={() => handleCitySelect(city)}
                                    style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
                                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                                >
                                    {city.city}, {city.admin}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button onClick={handleLocationSearch} style={{ padding: '8px 14px', cursor: 'pointer' }}>🔍 Search</button>
                <button onClick={handleCurrentLocation} style={{ padding: '8px 14px', cursor: 'pointer' }}>
                    📍 My Location
                </button>
            </div>
            <MapContainer center={center} zoom={Zoom_LEVEL} ref={mapRef} style={{ height: '600px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors" />
                <FlyToLocation position={flyTo} />
                {markerIcon && <Marker position={[13.084622, 80.248357]} icon={markerIcon}><Popup>Chennai</Popup></Marker>}
                {markerIcon && currentLocation && (
                    <Marker position={currentLocation} icon={markerIcon}><Popup>You are here</Popup></Marker>
                )}
            </MapContainer>
        </div>
    );
}
