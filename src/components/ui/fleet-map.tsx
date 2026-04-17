"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPin {
    lat: number;
    lng: number;
    color: string;
    label?: string;
    popup?: string;
    pulse?: boolean;
    size?: number;
}

interface FleetMapProps {
    center?: [number, number];
    zoom?: number;
    pins?: MapPin[];
    className?: string;
    darkTheme?: boolean;
}

export function FleetMap({
    center = [31.955, 35.945], // Amman, Jordan as default
    zoom = 13,
    pins = [],
    className = "",
    darkTheme = true,
}: FleetMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            center,
            zoom,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
        });

        // Dark map tiles from CartoDB
        L.tileLayer(
            darkTheme
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            { maxZoom: 19 }
        ).addTo(map);

        // Add pins
        pins.forEach((pin) => {
            const size = pin.size || 12;
            const icon = L.divIcon({
                className: "custom-pin",
                html: `<div style="width:${size}px;height:${size}px;background:${pin.color};border-radius:50%;border:2px solid white;box-shadow:0 0 8px ${pin.color}60;${pin.pulse ? "animation:ping 1.5s infinite;" : ""}"></div>${pin.label ? `<div style="position:absolute;top:${size + 4}px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:9px;color:${pin.color};font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,0.8);">${pin.label}</div>` : ""}`,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
            });

            const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);

            if (pin.popup) {
                marker.bindPopup(
                    `<div style="font-size:11px;font-family:system-ui;min-width:160px;">${pin.popup}</div>`,
                    { className: "custom-popup" }
                );
            }
        });

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [center, zoom, pins, darkTheme]);

    return (
        <div className={`relative ${className}`}>
            <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
            <style jsx global>{`
                .custom-pin { background: none !important; border: none !important; }
                .custom-popup .leaflet-popup-content-wrapper { background: rgba(15,23,42,0.95); color: white; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(8px); }
                .custom-popup .leaflet-popup-tip { background: rgba(15,23,42,0.95); }
                .custom-popup .leaflet-popup-close-button { color: #94a3b8; }
                @keyframes ping { 0% { box-shadow: 0 0 0 0 currentColor; } 70% { box-shadow: 0 0 0 8px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
            `}</style>
        </div>
    );
}
