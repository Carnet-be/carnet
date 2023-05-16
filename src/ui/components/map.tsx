/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wrapper } from "@googlemaps/react-wrapper";
import React, { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { useLang } from "../../pages/hooks";
const Map = ({
  latitude,
  longitude,
  onClick,
  containerClass,
  options,
}: {
  latitude: number;
  longitude: number;
  containerClass: string;
  options?: any;
  onClick: (el: any) => void;
}) => {
  const libraries = useMemo(() => ["places"], []);
  //coord usestate
  const [coord, setCoord] = React.useState({ lat: latitude, lng: longitude });
  const [permision, setPermision] = React.useState(true);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  useEffect(() => {
    if (latitude == 0 && longitude == 0) {
      console.log("getting location");
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log("position", position);
          // setPermision(true);
          setCoord({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        function () {
          //  setPermision(false);
          setCoord({
            lat: 50.503887,
            lng: 4.469936,
          });
        }
      );
    }
  }, []);

  const { text: common } = useLang(undefined);
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className={containerClass}>
      {permision ? (
        <GoogleMap
          //  options={mapOptions}
          options={{
            clickableIcons: false,
          }}
          onClick={onClick}
          zoom={20}
          center={coord}
          // mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={() => {
            console.log("map loaded");
          }}
        >
          <MarkerF
            key={0}
            onLoad={() => {
              console.log("marker loaded");
            }}
            position={{ lat: latitude, lng: longitude }}
          ></MarkerF>
        </GoogleMap>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="italic text-red-500">
            {common("text.map request denied")}
          </p>
        </div>
      )}
    </div>
  );
};

export default Map;
