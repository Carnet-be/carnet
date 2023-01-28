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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  useEffect(()=> {
    if (latitude == 0 && longitude == 0) {   
      console.log("getting location");
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
        setCoord({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  },[])
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className={containerClass}>
      <GoogleMap
        //  options={mapOptions}
        options={{
          clickableIcons: false,
        }}
        onClick={onClick}
        zoom={14}
        center={coord}
        // mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        onLoad={() => {
        
          console.log("map loaded");
        }}
      >
        <MarkerF key={0} onLoad={()=>{
          console.log("marker loaded")
         
        }} position={{ lat: latitude, lng:longitude }}>
       
        </MarkerF>
      </GoogleMap>
    </div>
  );
};

export default Map;
