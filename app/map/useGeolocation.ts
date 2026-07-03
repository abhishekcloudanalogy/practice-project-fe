import { useState } from 'react';

export function useGeolocation() {
    const [coords, setCoords] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }
        setLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords([pos.coords.latitude, pos.coords.longitude]);
                setLoading(false);
            },
            () => {
                setError('Location access denied');
                setLoading(false);
            }
        );
    };

    return { coords, loading, error, getLocation };
}
