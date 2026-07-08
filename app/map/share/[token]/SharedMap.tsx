'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  latitude: number;
  longitude: number;
  label?: string;
}

export default function SharedMap({ latitude, longitude, label }: Props) {
  const [icon, setIcon] = useState<Icon | null>(null);

  useEffect(() => {
    import('leaflet').then((L) => {
      setIcon(new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [35, 45], iconAnchor: [17, 46], popupAnchor: [0, -46],
      }));
    });
  }, []);

  return (
    <MapContainer center={[latitude, longitude]} zoom={15} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {icon && (
        <Marker position={[latitude, longitude]} icon={icon}>
          <Popup> <div>
        <strong>{label || "Shared Location"}</strong>
    </div></Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
