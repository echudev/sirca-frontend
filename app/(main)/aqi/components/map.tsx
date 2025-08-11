"use client";

import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRef, useState } from "react";
import type { StyleSpecification } from "maplibre-gl";

type NativeMarker = {
  setScale?: (scale: number) => void;
  getElement?: () => HTMLElement;
};

export default function AQIMap() {
  const positions = [
    {
      latitude: -34.60622428692798,
      longitude: -58.43259391518152,
      label: "Centenario",
    },
    {
      latitude: -34.59966556048902,
      longitude: -58.39135459883036,
      label: "Córdoba",
    },
    {
      latitude: -34.62529851309217,
      longitude: -58.36553634939128,
      label: "Catalinas",
    },
    {
      latitude: -34.664058753484206,
      longitude: -58.466630925182876,
      label: "CIFA",
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const markerRefs = useRef<Array<NativeMarker | null>>([]);

  const aqiValue = 250;
  const getAqiColor = (aqi: number): string => {
    if (aqi <= 50) return "green";
    if (aqi <= 100) return "yellow";
    if (aqi <= 150) return "orange";
    if (aqi <= 200) return "red";
    if (aqi <= 300) return "purple";
    return "maroon";
  };

  // Estilo válido de MapLibre con tiles OSM (raster)
  const defaultStyle: StyleSpecification = {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors",
      },
    },
    layers: [
      {
        id: "osm",
        type: "raster",
        source: "osm",
      },
    ],
  };

  const getScaleFromZoom = (currentZoom: number) => {
    const scaled = 0.3 + currentZoom * 0.12;
    return Math.max(0.8, Math.min(2, scaled));
  };

  return (
    <div className="h-full w-full">
      <Map
        initialViewState={{
          longitude: positions[0]?.longitude,
          latitude: positions[0]?.latitude,
          zoom: 11,
        }}
        mapStyle={defaultStyle}
      >
        {positions.map((p, i) => (
          <Marker
            key={`${p.latitude},${p.longitude}`}
            latitude={p.latitude}
            longitude={p.longitude}
            anchor="bottom"
            color="#EA4335"
            scale={getScaleFromZoom(11)}
            ref={(instance) => {
              markerRefs.current[i] =
                (instance as unknown as NativeMarker) || null;
            }}
            onClick={() => setSelectedIndex(i)}
          />
        ))}

        {selectedIndex !== null && (
          <Popup
            latitude={positions[selectedIndex].latitude}
            longitude={positions[selectedIndex].longitude}
            closeOnClick={false}
            onClose={() => setSelectedIndex(null)}
            anchor="top"
          >
            {/*<div style={{ color: getAqiColor(aqiValue), fontWeight: "bold" }}>
              Calidad del aire: {aqiValue} (Moderada)
            </div>*/}
            <div className="">
              Ubicación: {positions[selectedIndex].label}, Buenos Aires
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
