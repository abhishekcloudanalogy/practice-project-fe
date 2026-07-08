'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup, useMap, useMapEvents, Polyline } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { Map, Icon, FeatureGroup as FGType } from 'leaflet';
import { useGeolocation } from './useGeolocation';
import { useSaveLocationMutation } from '@/store/services/map/apiSlice';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import html2canvas from 'html2canvas-pro';

// ─── Tile Layers ──────────────────────────────────────────────────────────────
const TILE_LAYERS: Record<string, { url: string; attribution: string }> = {
    Street: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap contributors' },
    Satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '&copy; Esri' },
    Terrain: { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenTopoMap' },
    Dark: { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '&copy; CartoDB' },
};

const HEAT_POINTS: [number, number, number][] = [
    [28.6139, 77.2090, 0.9], [28.62, 77.21, 0.7], [28.60, 77.20, 0.5],
    [28.63, 77.22, 0.8], [28.61, 77.19, 0.6], [28.64, 77.23, 0.4],
];

const CLUSTER_MARKERS: [number, number, string][] = [
    [28.6139, 77.2090, 'New Delhi'], [28.7041, 77.1025, 'Rohini'],
    [28.5355, 77.3910, 'Noida'], [28.4595, 77.0266, 'Gurgaon'],
    [28.6692, 77.4538, 'Ghaziabad'], [28.5672, 77.3210, 'Faridabad'],
];

// ─── Inner components (safe — only rendered inside MapContainer) ──────────────

function InvalidateSize() {
    const map = useMap();
    useEffect(() => { setTimeout(() => map.invalidateSize(), 0); }, [map]);
    return null;
}

function FlyToLocation({ position }: { position: [number, number] | null }) {
    const map = useMap();
    useEffect(() => { if (position) map.flyTo(position, 13); }, [position, map]);
    return null;
}

function MouseCoords() {
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    useMapEvents({
        mousemove(e) { setCoords({ lat: +e.latlng.lat.toFixed(5), lng: +e.latlng.lng.toFixed(5) }); },
        mouseout() { setCoords(null); },
    });
    if (!coords) return null;
    return (
        <div style={{
            position: 'absolute', bottom: 30, left: 10, zIndex: 1000,
            background: 'rgba(255,255,255,0.9)', padding: '4px 8px',
            borderRadius: 4, fontSize: 12, pointerEvents: 'none', border: '1px solid #ccc'
        }}>
            Lat: {coords.lat} | Lng: {coords.lng}
        </div>
    );
}

function ReverseGeocode({ enabled }: { enabled: boolean }) {
    const [info, setInfo] = useState<{ pos: [number, number]; address: string } | null>(null);
    const map = useMap();
    useMapEvents({
        async click(e) {
            if (!enabled) return;
            const { lat, lng } = e.latlng;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            setInfo({ pos: [lat, lng], address: data.display_name || 'Unknown' });
        }
    });
    useEffect(() => {
        map.getContainer().style.cursor = enabled ? 'crosshair' : '';
        if (!enabled) setInfo(null);
    }, [enabled, map]);
    if (!info) return null;
    return <Marker position={info.pos}><Popup>{info.address}</Popup></Marker>;
}

function RoutePlanner({ enabled }: { enabled: boolean }) {
    const [points, setPoints] = useState<[number, number][]>([]);
    const [route, setRoute] = useState<[number, number][]>([]);
    const [info, setInfo] = useState('');
    const map = useMap();
    useMapEvents({
        async click(e) {
            if (!enabled) return;
            const newPoints = [...points, [e.latlng.lat, e.latlng.lng] as [number, number]];
            setPoints(newPoints);
            if (newPoints.length === 2) {
                const [a, b] = newPoints;
                const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`);
                const data = await res.json();
                if (data.routes?.[0]) {
                    const coords = data.routes[0].geometry.coordinates.map(([lng, lat]: number[]) => [lat, lng] as [number, number]);
                    setRoute(coords);
                    const dist = (data.routes[0].distance / 1000).toFixed(1);
                    const dur = Math.round(data.routes[0].duration / 60);
                    setInfo(`${dist} km · ~${dur} min`);
                }
                setPoints([]);
            }
        }
    });
    useEffect(() => {
        map.getContainer().style.cursor = enabled ? 'crosshair' : '';
        if (!enabled) { setRoute([]); setInfo(''); setPoints([]); }
    }, [enabled, map]);
    return (
        <>
            {route.length > 0 && <Polyline positions={route} color="blue" weight={4} />}
            {info && (
                <div style={{
                    position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                    zIndex: 1000, background: '#fff', padding: '6px 14px', borderRadius: 20,
                    fontWeight: 600, fontSize: 13, border: '1px solid #aaa', pointerEvents: 'none'
                }}>🛣 {info}</div>
            )}
            {points.map((p, i) => <Marker key={i} position={p}><Popup>{i === 0 ? '🟢 Start' : '🔴 End'}</Popup></Marker>)}
        </>
    );
}

function HeatmapLayer({ points }: { points: [number, number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (!points.length) return;
        import('leaflet').then((L) => {
            const CanvasLayer = L.Layer.extend({
                onAdd(m: any) {
                    this._map = m;
                    this._canvas = document.createElement('canvas');
                    this._canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none';
                    m.getPanes().overlayPane.appendChild(this._canvas);
                    m.on('moveend zoomend resize', this._draw, this);
                    this._draw();
                },
                onRemove(m: any) {
                    m.off('moveend zoomend resize', this._draw, this);
                    this._canvas.remove();
                },
                _draw() {
                    const m = this._map;
                    const size = m.getSize();
                    const c = this._canvas;
                    c.width = size.x; c.height = size.y;
                    const ctx = c.getContext('2d');
                    const topLeft = m.containerPointToLayerPoint([0, 0]);
                    L.DomUtil.setPosition(c, topLeft);
                    points.forEach(([lat, lng, intensity = 1]) => {
                        const p = m.latLngToContainerPoint([lat, lng]);
                        const r = 30;
                        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
                        grad.addColorStop(0, `rgba(255,0,0,${intensity * 0.6})`);
                        grad.addColorStop(0.5, `rgba(255,165,0,${intensity * 0.3})`);
                        grad.addColorStop(1, 'rgba(255,255,0,0)');
                        ctx.beginPath();
                        ctx.fillStyle = grad;
                        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                        ctx.fill();
                    });
                }
            });
            const layer = new (CanvasLayer as any)();
            layer.addTo(map);
            return () => map.removeLayer(layer);
        });
    }, [points, map]);
    return null;
}

function GeofenceAlert({ polygon, markerPos }: { polygon: [number, number][] | null; markerPos: [number, number] | null }) {
    const prevInside = useRef<boolean | null>(null);
    useEffect(() => {
        if (!polygon || !markerPos || polygon.length < 3) return;
        import('leaflet').then((L) => {
            const inside = L.polygon(polygon).getBounds().contains(markerPos);
            if (prevInside.current !== null && prevInside.current !== inside)
                alert(inside ? '📍 Marker entered the geofence!' : '🚪 Marker exited the geofence!');
            prevInside.current = inside;
        });
    }, [polygon, markerPos]);
    return null;
}

function ZoomToFit({ positions, trigger }: { positions: [number, number][]; trigger: boolean }) {
    const map = useMap();
    useEffect(() => {
        if (!trigger || !positions.length) return;
        import('leaflet').then((L) => map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] }));
    }, [trigger, positions, map]);
    return null;
}

function FullscreenControl() {
    const map = useMap();
    const [full, setFull] = useState(false);
    const toggle = () => {
        const el = map.getContainer().parentElement as HTMLElement;
        if (full) {
            el.style.position = 'relative';
            el.style.top = '';
            el.style.left = '';
            el.style.width = '';
            el.style.height = '';
            el.style.zIndex = '';
        } else {
            el.style.position = 'fixed';
            el.style.top = '0';
            el.style.left = '0';
            el.style.width = '100vw';
            el.style.height = '100vh';
            el.style.zIndex = '9999';
        }
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
        setFull(f => !f);
    };
    return (
        <div style={{ position: 'absolute', top: 80, left: 10, zIndex: 1000 }}>
            <button onClick={toggle} title="Toggle Fullscreen" style={{
                background: '#fff', border: '2px solid rgba(0,0,0,0.2)', borderRadius: 4,
                width: 30, height: 30, cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>{full ? '🗗' : '⛶'}</button>
        </div>
    );
}

function MiniMap() {
    const map = useMap();
    const miniRef = useRef<HTMLDivElement>(null);
    const miniMapRef = useRef<any>(null);
    useEffect(() => {
        if (!miniRef.current) return;
        let destroyed = false;
        import('leaflet').then((L) => {
            if (destroyed || !miniRef.current) return;
            // destroy any stale instance left by StrictMode's double-invoke
            const container = miniRef.current as any;
            if (container._leaflet_id) container._leaflet_id = undefined;
            if (miniMapRef.current) { miniMapRef.current.remove(); miniMapRef.current = null; }
            const mini = L.map(miniRef.current, {
                zoomControl: false, attributionControl: false,
                dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mini);
            miniMapRef.current = mini;
            const rect = L.rectangle(map.getBounds(), { color: '#3388ff', weight: 2, fillOpacity: 0.1 }).addTo(mini);
            const sync = () => {
                if (destroyed) return;
                mini.setView(map.getCenter(), Math.max(map.getZoom() - 5, 1));
                rect.setBounds(map.getBounds());
            };
            sync();
            map.on('moveend zoomend', sync);
            return () => { map.off('moveend zoomend', sync); };
        });
        return () => {
            destroyed = true;
            if (miniMapRef.current) { miniMapRef.current.remove(); miniMapRef.current = null; }
        };
    }, [map]);
    return <div ref={miniRef} style={{ position: 'absolute', bottom: 30, right: 10, width: 150, height: 120, zIndex: 1000, border: '2px solid #aaa', borderRadius: 4, overflow: 'hidden' }} />;
}

function ShareLocation() {
    const map = useMap();
    const [copied, setCopied] = useState(false);
    const share = () => {
        const { lat, lng } = map.getCenter();
        const url = `${window.location.origin}${window.location.pathname}?lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}&zoom=${map.getZoom()}`;
        navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    };
    return (
        <div style={{ position: 'absolute', top: 115, left: 10, zIndex: 1000 }}>
            <button onClick={share} title="Share Location" style={{
                background: copied ? '#4caf50' : '#fff', color: copied ? '#fff' : '#000',
                border: '2px solid rgba(0,0,0,0.2)', borderRadius: 4,
                width: 30, height: 30, cursor: 'pointer', fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>{copied ? '✓' : '🔗'}</button>
        </div>
    );
}

function MapClickHandler({ enabledRef, onClick }: { enabledRef: React.MutableRefObject<boolean>; onClick: (pos: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            if (enabledRef.current) onClick([e.latlng.lat, e.latlng.lng]);
        }
    });
    return null;
}

function MeasureTool({ enabled }: { enabled: boolean }) {
    const [pts, setPts] = useState<[number, number][]>([]);
    const [result, setResult] = useState('');
    const map = useMap();
    useMapEvents({
        click(e) { if (enabled) setPts(prev => [...prev, [e.latlng.lat, e.latlng.lng]]); },
        dblclick(e) {
            if (!enabled || pts.length < 2) return;
            e.originalEvent.preventDefault();
            import('leaflet').then((L) => {
                let dist = 0;
                for (let i = 1; i < pts.length; i++) dist += L.latLng(pts[i - 1]).distanceTo(L.latLng(pts[i]));
                setResult(`📏 ${(dist / 1000).toFixed(2)} km`);
                setPts([]);
            });
        }
    });
    useEffect(() => {
        map.getContainer().style.cursor = enabled ? 'crosshair' : '';
        if (!enabled) { setPts([]); setResult(''); }
    }, [enabled, map]);
    return (
        <>
            {pts.length > 1 && <Polyline positions={pts} color="orange" dashArray="6" weight={2} />}
            {result && (
                <div style={{
                    position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
                    zIndex: 1000, background: '#fff', padding: '5px 12px', borderRadius: 20,
                    fontSize: 13, fontWeight: 600, border: '1px solid #aaa', pointerEvents: 'none'
                }}>{result}</div>
            )}
        </>
    );
}

// ─── Utility functions ────────────────────────────────────────────────────────
function saveDrawings(fg: FGType | null) {
    if (!fg) return;
    const layers: any[] = [];
    fg.eachLayer((l: any) => layers.push(l));
    localStorage.setItem('map_drawings', JSON.stringify(layers.map(l => l.toGeoJSON?.()).filter(Boolean)));
    alert('💾 Drawings saved!');
}

function loadDrawings(fg: FGType | null) {
    const raw = localStorage.getItem('map_drawings');
    if (!raw || !fg) return;
    import('leaflet').then((L) => {
        JSON.parse(raw).forEach((f: any) => L.geoJSON(f).eachLayer(layer => fg.addLayer(layer)));
    });
}

function exportGeoJSON(fg: FGType | null) {
    if (!fg) return;
    const layers: any[] = [];
    fg.eachLayer((l: any) => layers.push(l));
    const features = layers.map(l => l.toGeoJSON?.()).filter(Boolean);
    const blob = new Blob([JSON.stringify({ type: 'FeatureCollection', features }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'drawings.geojson';
    a.click();
}

function importGeoJSON(file: File, fg: FGType | null) {
    if (!fg) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        import('leaflet').then((L) => {
            L.geoJSON(JSON.parse(e.target?.result as string)).eachLayer(layer => fg.addLayer(layer));
        });
    };
    reader.readAsText(file);
}

// ─── Main exported component ──────────────────────────────────────────────────
export default function MapClient() {
    const [toolbarOpen, setToolbarOpen] = useState(false);
    const [center] = useState<[number, number]>([28.6139, 77.2090]);
    const [markerIcon, setMarkerIcon] = useState<Icon | null>(null);
    const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
    const [searchMarker, setSearchMarker] = useState<[number, number] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [suggestions, setSuggestions] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
    const Zoom_LEVEL = 9;
    const mapRef = useRef<Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const featureGroupRef = useRef<FGType | null>(null);
    const geoImportRef = useRef<HTMLInputElement>(null);
    const { coords: userCoords, loading: locLoading, error: locError, getLocation } = useGeolocation();

    const [tileLayer, setTileLayer] = useState<keyof typeof TILE_LAYERS>('Street');
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showClusters, setShowClusters] = useState(false);
    const [reverseGeoMode, setReverseGeoMode] = useState(false);
    const [routeMode, setRouteMode] = useState(false);
    const [measureMode, setMeasureMode] = useState(false);
    const [showMiniMap, setShowMiniMap] = useState(false);
    const [zoomFit, setZoomFit] = useState(false);
    const isDrawingShapeRef = useRef(false);
    const mapClickEnabledRef = useRef(true);
    const [drawnPolygon, setDrawnPolygon] = useState<[number, number][] | null>(null);
    const [clickedMarker, setClickedMarker] = useState<[number, number] | null>(null);
    const [clickedShareToken, setClickedShareToken] = useState<string | null>(null);
    const [searchShareToken, setSearchShareToken] = useState<string | null>(null);
    const [currentShareToken, setCurrentShareToken] = useState<string | null>(null);
    const router = useRouter();
    const [saveLocation, { isLoading: isSaving }] = useSaveLocationMutation();
    const [clickedLocationName, setClickedLocationName] = useState("");
    const [currentLocationLabel, setCurrentLocationLabel] = useState("");
    const copyShareLink = (token: string) => {
        const url = `${window.location.origin}/map/share/${token}`;
        navigator.clipboard.writeText(url).then(() => alert('🔗 Share link copied!'));
    };

    const handleSaveCurrentLocation = async () => {
        if (!userCoords) return;
        let label = `${userCoords[0].toFixed(5)}, ${userCoords[1].toFixed(5)}`;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${userCoords[0]}&lon=${userCoords[1]}&format=json`);
            const data = await res.json();
            if (data.display_name) label = data.display_name;
        } catch { /* fallback to coords */ }
        const confirmed = window.confirm(`Do you want to save this location?\n${label}`);
        if (!confirmed) return;
        try {
            const result = await saveLocation({ latitude: userCoords[0], longitude: userCoords[1], label }).unwrap();
            setCurrentShareToken(result.data?.shareToken ?? null);
            alert('✅ Current location saved!');
        } catch {
            alert('❌ Failed to save location');
        }
    };

    const handleSaveClickedLocation = async (pos: [number, number]) => {
        let placeName = `${pos[0].toFixed(5)}, ${pos[1].toFixed(5)}`;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos[0]}&lon=${pos[1]}&format=json`);
            const data = await res.json();
            if (data.display_name) placeName = data.display_name;
        } catch { /* fallback to coords */ }
        const confirmed = window.confirm(`Do you want to save this location?\n${placeName}`);
        if (!confirmed) return;
        try {
            const result = await saveLocation({ latitude: pos[0], longitude: pos[1], label: placeName }).unwrap();
            setClickedShareToken(result.data?.shareToken ?? null);
            alert('✅ Location saved!');
        } catch {
            alert('❌ Failed to save location');
        }
    };

    const handleSaveSearchLocation = async (pos: [number, number], label: string) => {
        const confirmed = window.confirm(`Do you want to save this location?\n${label}`);
        if (!confirmed) return;
        try {
            const result = await saveLocation({ latitude: pos[0], longitude: pos[1], label }).unwrap();
            setSearchShareToken(result.data?.shareToken ?? null);
            alert('✅ Location saved!');
        } catch {
            alert('❌ Failed to save location');
        }
    };

    useEffect(() => {
        if (!isDrawingShapeRef.current)
            mapClickEnabledRef.current = !reverseGeoMode && !routeMode && !measureMode;
    }, [reverseGeoMode, routeMode, measureMode]);

    useEffect(() => {
        import('leaflet').then((L) => {
            setMarkerIcon(new L.Icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconSize: [35, 45], iconAnchor: [17, 46], popupAnchor: [0, -46]
            }));
        });
        const params = new URLSearchParams(window.location.search);
        const lat = params.get('lat'), lng = params.get('lng');
        if (lat && lng) {
            const pos: [number, number] = [parseFloat(lat), parseFloat(lng)];
            setFlyTo(pos);
            setClickedMarker(pos);
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                .then(r => r.json())
                .then(d => setClickedLocationName(d.display_name || 'Unknown Location'))
                .catch(() => setClickedLocationName('Unknown Location'));
        }
    }, []);

    useEffect(() => {
        if (!userCoords) return;

        setFlyTo([...userCoords]);

        const getAddress = async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${userCoords[0]}&lon=${userCoords[1]}&format=json`
                );

                const data = await res.json();

                setCurrentLocationLabel(
                    data.display_name || "Unknown Location"
                );
            } catch {
                setCurrentLocationLabel("Unknown Location");
            }
        };

        getAddress();
    }, [userCoords]);

    useEffect(() => {
        if (!searchQuery.trim()) { setSuggestions([]); setShowDropdown(false); return; }
        if (searchQuery.length < 2) { setSuggestions([]); return; }
        const timer = setTimeout(async () => {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=6`);
            const data = await res.json();
            setSuggestions(data);
            setShowDropdown(data.length > 0);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleCitySelect = (item: { display_name: string; lat: string; lon: string }) => {
        const coords: [number, number] = [parseFloat(item.lat), parseFloat(item.lon)];
        setFlyTo(coords); setSearchMarker(coords);
        setSearchQuery(item.display_name.split(',')[0]);
        setShowDropdown(false); setSuggestions([]);
        setSearchShareToken(null);
    };

    const handleLocationSearch = async () => {
        if (!searchQuery.trim()) return;
        setShowDropdown(false);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
        const data = await res.json();
        if (data.length > 0) { setFlyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)]); setSearchMarker([parseFloat(data[0].lat), parseFloat(data[0].lon)]); }
        else alert('Location not found');
    };

    const handleDownload = async () => {
        if (!mapContainerRef.current) return;
        const canvas = await html2canvas(mapContainerRef.current, { useCORS: true });
        const a = document.createElement('a'); a.download = 'map.png'; a.href = canvas.toDataURL(); a.click();
    };

    const handlePrint = async () => {
        if (!mapContainerRef.current) return;
        const canvas = await html2canvas(mapContainerRef.current, { useCORS: true });
        const win = window.open('');
        if (!win) return;
        win.document.write(`<img src="${canvas.toDataURL()}" onload="window.print();window.close()" style="width:100%" />`);
        win.document.close();
    };

    const allMarkerPositions: [number, number][] = [
        [28.6139, 77.2090],
        ...(userCoords ? [userCoords] : []),
        ...(searchMarker ? [searchMarker] : []),
    ];

    const btn = (active?: boolean) =>
        `px-3 py-1.5 cursor-pointer text-xs rounded border whitespace-nowrap font-medium transition-colors ${active
            ? 'bg-[#1677ff] text-white border-[#1677ff] hover:bg-[#0958d9]'
            : 'bg-white text-[#333] border-[#d9d9d9] hover:border-[#1677ff] hover:text-[#1677ff]'
        }`;

    const btnLabel = (emoji: string, text: string) => (
        <><span style={{ fontStyle: 'normal' }}>{emoji}</span>{' '}{text}</>
    );

    return (
        <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - var(--navbar-height, 64px))' }}>

            {/* ── Page title ── */}
            <div className="px-3 pt-2 pb-0">
                <h1 className="text-base font-semibold text-slate-700">🗺 Map</h1>
            </div>

            {/* ── Search / action bar ── */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-white border-b border-[#e0e0e0] relative">
                <div className="relative flex-1 min-w-40">
                    <input type="text" placeholder="Search city..." value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                        className="w-full px-3 py-1.5 text-sm border border-[#d9d9d9] rounded outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff] box-border transition-colors"
                    />
                    {showDropdown && suggestions.length > 0 && (
                        <ul className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#d9d9d9] list-none m-0 p-0 z-9999 max-h-52 overflow-y-auto shadow-lg rounded-md">
                            {suggestions.map((item, i) => (
                                <li key={i}
                                    onMouseDown={(e) => { e.preventDefault(); handleCitySelect(item); }}
                                    className="px-3 py-2 cursor-pointer text-sm text-[#333] hover:bg-[#e6f4ff] hover:text-[#1677ff] border-b border-[#f0f0f0] last:border-b-0 transition-colors">
                                    <span className="text-[#999] mr-1.5">📍</span>{item.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button onClick={handleLocationSearch} className={btn()}>🔍 Search</button>
                <button onClick={() => { getLocation(); }} disabled={locLoading} className={btn()}>
                    {locLoading ? '⏳...' : '📍 My Location'}
                </button>
                <button
                    onClick={handleSaveCurrentLocation}
                    disabled={!userCoords || isSaving}
                    className={`${btn()} ${!userCoords ? 'opacity-40 cursor-not-allowed!' : ''}`}
                >💾 {isSaving ? 'Saving...' : 'Save'}</button>
                {locError && <span className="text-red-500 text-xs">{locError}</span>}
                <button onClick={() => router.push('/map/saved')} className={btn()}>📋 See Saved Locations</button>
                <button onClick={handleDownload} className={btn()}>⬇️</button>
                <button onClick={handlePrint} className={btn()}>🖨️</button>
                {/* Mobile toolbar toggle */}
                <button
                    onClick={() => setToolbarOpen(o => !o)}
                    className={`${btn(toolbarOpen)} ml-auto sm:hidden`}
                >⚙️ Tools</button>
            </div>

            {/* ── Feature toolbar ── */}
            <div className={`flex flex-wrap gap-1.5 p-2 bg-[#f8f8f8] border-b border-[#e0e0e0] ${toolbarOpen ? 'flex' : 'hidden sm:flex'
                }`}>
                <select value={tileLayer} onChange={e => setTileLayer(e.target.value as keyof typeof TILE_LAYERS)} className={btn()}>
                    {Object.keys(TILE_LAYERS).map(k => <option key={k} value={k}>🗺 {k}</option>)}
                </select>
                <button onClick={() => { setRouteMode(m => !m); setReverseGeoMode(false); setMeasureMode(false); }} className={btn(routeMode)}>
                    {btnLabel('🛣', `Route${routeMode ? ' (2 pts)' : ''}`)}
                </button>
                <button onClick={() => { setReverseGeoMode(m => !m); setRouteMode(false); setMeasureMode(false); }} className={btn(reverseGeoMode)}>
                    {btnLabel('📌', `Rev.Geo${reverseGeoMode ? ' (click)' : ''}`)}
                </button>
                <button onClick={() => { setMeasureMode(m => !m); setRouteMode(false); setReverseGeoMode(false); }} className={btn(measureMode)}>
                    {btnLabel('📏', `Measure${measureMode ? ' (dbl-end)' : ''}`)}
                </button>
                <button onClick={() => setShowClusters(m => !m)} className={btn(showClusters)}>{btnLabel('📍', 'Clusters')}</button>
                <button onClick={() => setShowMiniMap(m => !m)} className={btn(showMiniMap)}>{btnLabel('🗾', 'Mini Map')}</button>
                <button onClick={() => { setZoomFit(true); setTimeout(() => setZoomFit(false), 300); }} className={btn()}>{btnLabel('🔭', 'Zoom Fit')}</button>
                <button onClick={() => exportGeoJSON(featureGroupRef.current)} className={btn()}>{btnLabel('📤', 'Export')}</button>
                <button onClick={() => geoImportRef.current?.click()} className={btn()}>{btnLabel('📥', 'Import')}</button>
                <input ref={geoImportRef} type="file" accept=".geojson,.json" className="hidden"
                    onChange={e => { if (e.target.files?.[0]) importGeoJSON(e.target.files[0], featureGroupRef.current); }} />
            </div>

            <div ref={mapContainerRef} className="relative flex-1 min-h-0">
                <MapContainer center={center} zoom={Zoom_LEVEL} ref={mapRef} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url={TILE_LAYERS[tileLayer].url} attribution={TILE_LAYERS[tileLayer].attribution} />

                    <InvalidateSize />
                    <FlyToLocation position={flyTo} />
                    <MouseCoords />
                    <MapClickHandler enabledRef={mapClickEnabledRef} onClick={async (pos) => {
                        setClickedMarker(pos);
                        setFlyTo(pos);

                        try {
                            const res = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?lat=${pos[0]}&lon=${pos[1]}&format=json`
                            );

                            const data = await res.json();

                            setClickedLocationName(
                                data.display_name || "Unknown Location"
                            );
                        } catch {
                            setClickedLocationName("Unknown Location");
                        }
                    }} />
                    <ReverseGeocode enabled={reverseGeoMode} />
                    <RoutePlanner enabled={routeMode} />
                    <MeasureTool enabled={measureMode} />
                    <ShareLocation />
                    <FullscreenControl />
                    {showMiniMap && <MiniMap />}
                    {showHeatmap && <HeatmapLayer points={HEAT_POINTS} />}
                    <GeofenceAlert polygon={drawnPolygon} markerPos={userCoords} />
                    <ZoomToFit positions={allMarkerPositions} trigger={zoomFit} />

                    {markerIcon && <Marker position={[28.6139, 77.2090]} icon={markerIcon}><Popup>New Delhi</Popup></Marker>}
                    {markerIcon && userCoords && <Marker position={userCoords} icon={markerIcon}><Popup>
                        <div className="min-w-55">
                            <div className="font-semibold mb-1.5">📍 You are here</div>
                            <div className="text-[13px] text-[#555] leading-snug">
                                {currentLocationLabel || "Loading location..."}
                            </div>
                        </div>
                    </Popup></Marker>}
                    {markerIcon && clickedMarker && (
                        <Marker
                            position={clickedMarker}
                            icon={markerIcon}
                            draggable
                            eventHandlers={{
                                dragend(e) {
                                    const { lat, lng } = e.target.getLatLng();
                                    setClickedMarker([lat, lng]);
                                }
                            }}
                        >
                            <Popup>
                                <div className="text-center min-w-40">
                                    <div className="mb-1.5 text-xs">📍 {clickedLocationName || "Loading location..."}</div>
                                    <button
                                        onClick={() => handleSaveClickedLocation(clickedMarker)}
                                        disabled={isSaving}
                                        className="px-2.5 py-1 text-xs cursor-pointer bg-[#1677ff] text-white border-none rounded"
                                    >💾 {isSaving ? 'Saving...' : 'Save this location'}</button>

                                </div>
                            </Popup>
                        </Marker>
                    )}
                    {markerIcon && searchMarker && (
                        <Marker position={searchMarker} icon={markerIcon}>
                            <Popup>
                                <div className="text-center min-w-40">
                                    <div className="mb-1.5 text-xs">🔍 {searchQuery}</div>
                                    <button
                                        onClick={() => handleSaveSearchLocation(searchMarker, searchQuery)}
                                        disabled={isSaving}
                                        className="px-2.5 py-1 text-xs cursor-pointer bg-[#1677ff] text-white border-none rounded"
                                    >💾 {isSaving ? 'Saving...' : 'Save this location'}</button>
                                    {searchShareToken && (
                                        <button
                                            onClick={() => copyShareLink(searchShareToken)}
                                            className="mt-1.5 px-2.5 py-1 text-xs cursor-pointer bg-[#52c41a] text-white border-none rounded block w-full"
                                        >🔗 Share this location</button>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {showClusters && markerIcon && (
                        <MarkerClusterGroup>
                            {CLUSTER_MARKERS.map(([lat, lng, label], i) => (
                                <Marker key={i} position={[lat, lng]} icon={markerIcon}><Popup>{label}</Popup></Marker>
                            ))}
                        </MarkerClusterGroup>
                    )}

                    <FeatureGroup ref={featureGroupRef}>
                        <EditControl
                            position="topright"
                            draw={{ polyline: true, polygon: true, rectangle: true, circle: true, marker: true, circlemarker: false }}
                            onDrawStart={() => { isDrawingShapeRef.current = true; mapClickEnabledRef.current = false; }}
                            onDrawStop={() => { isDrawingShapeRef.current = false; mapClickEnabledRef.current = !reverseGeoMode && !routeMode && !measureMode; }}
                            onCreated={(e: any) => {
                                const { layerType, layer } = e;
                                if (layerType === 'polygon') {
                                    setDrawnPolygon(layer.getLatLngs()[0].map((p: any) => [p.lat, p.lng] as [number, number]));
                                }
                            }}
                        />
                    </FeatureGroup>
                </MapContainer>
            </div>
        </div>
    );
}
