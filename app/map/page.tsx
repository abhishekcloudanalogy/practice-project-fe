'use client';
import React, { useState } from 'react'
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });

export default function MapPage() {
    const [center,setCenter]=useState({lat:13.084622,lng:80.248357});
    const Zoom_LEVEL=9;
    return (
        <div>
            <h1>Map Page</h1>
            <MapContainer center={center} zoom={Zoom_LEVEL} style={{ height: '400px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"/>
            </MapContainer>
        </div>
    )
}
