/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import { Skeleton } from "@nextui-org/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { env } from "~/env.mjs";

type PositionState = {
  lat: number | null;
  lng: number | null;
  setData: (pos: { lat: number; lng: number }) => void;
};

const usePositionStore = create<PositionState>()(
  persist(
    (set) => ({
      lat: null,
      lng: null,
      setData: (pos) => set(pos),
    }),
    {
      name: "position",
    },
  ),
);

type Props = {
  disabled?: boolean;
  className?: string;
  center?: {
    lat: number;
    lng: number;
  };
  onClick?: (pos: { lat: number; lng: number }) => void;
  markers?: {
    lat: number;
    lng: number;
  }[];
};

function Map({ center, className, onClick, markers, disabled }: Props) {
  const { lat, lng, setData } = usePositionStore();

  useEffect(() => {
    if (lat && lng) {
      return;
    }
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setData({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);
  const { isLoaded } = useJsApiLoader({
    id: "carnet-map",
    region: "BE",
    language: "en",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  });
  //const { onLoad, onError, onUnmount, filter: locations, loading, } = useMapStore()

  return isLoaded ? (
    <GoogleMap
      mapContainerClassName={className}
      center={
        center ?? {
          lat: lat ?? 50.5039,
          lng: lng ?? 4.4699,
        }
      }
      zoom={14}
      onClick={(e) => {
        if (onClick && !disabled) {
          const lat = e?.latLng?.lat();
          const lng = e?.latLng?.lng();
          if (lat && lng) {
            onClick({
              lat,
              lng,
            });
          }
        }
      }}
      options={{
        clickableIcons: false,
        disableDefaultUI: true,
        fullscreenControl: true,
        zoomControl: false,
      }}
    >
      {markers?.map((m, i) => <Marker key={i} position={m} />)}
    </GoogleMap>
  ) : (
    <Skeleton className={className} />
  );
}

export default Map;
