/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wrapper } from "@googlemaps/react-wrapper";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal } from "antd";

import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { useLang } from "../../pages/hooks";
import { BiLocationPlus } from "react-icons/bi";
import { set } from "lodash";
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

export const MapDialog = ({
  latitude,
  longitude,
  onClick,
  containerClass,
}: {
  latitude?: number;
  longitude?: number;
  containerClass: string;
  onClick: (el: any) => void;
}) => {
  const libraries = useMemo(() => ["places"], []);
  //coord usestate
  const [marker, setMarker] = React.useState({ lat: latitude, lng: longitude });
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
          setPermision(true);
          setCoord({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        function () {
          setPermision(false);
          setCoord({
            lat: 50.503887,
            lng: 4.469936,
          });
        }
      );
    }
  }, []);

  const [open, setOpen] = useState(false);
  const { text: common } = useLang(undefined);
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className={containerClass}>
      {permision ? (
        <>
          {latitude && longitude ? (
            <div className="relative h-full w-full">
              <button
                onClick={(e) => {
                  setOpen(true);
                }}
                className="absolute top-0 left-0 z-10 h-full w-full"
              ></button>
              <GoogleMap
                //  options={mapOptions}
                options={{
                  clickableIcons: false,
                  fullscreenControl: false,
                  disableDefaultUI: false,
                  zoomControl: false,

                  scaleControl: false,
                  streetViewControl: false,
                  rotateControl: false,
                  mapTypeControl: false,
                  draggable: false,
                }}
                onClick={(e) => {
                  setOpen(true);
                }}
                zoom={14}
                center={{ lat: latitude, lng: longitude }}
                // mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
              >
                {
                  // <Marker
                  marker.lat && marker.lng && (
                    <MarkerF
                      key={0}
                      onLoad={() => {
                        console.log("marker loaded");
                      }}
                      position={{ lat: marker.lat, lng: marker.lng }}
                    ></MarkerF>
                  )
                }
              </GoogleMap>
            </div>
          ) : (
            <Button
              type="primary"
              onClick={() => setOpen(true)}
              className="flex flex-row gap-3"
            >
              <BiLocationPlus className="text-xl" />
              Location
            </Button>
          )}
          <Modal
            title="Pick a location"
            centered
            open={open}
            onOk={() => {
              onClick(marker);
              setOpen(false);
            }}
            onCancel={() => {
              setOpen(false);
            }}
            width={900}
          >
            <div className="h-[600px] w-full">
              <GoogleMap
                //  options={mapOptions}
                options={{
                  clickableIcons: false,
                  fullscreenControl: false,
                  disableDefaultUI: false,
                }}
                //no icons

                onClick={(e) => {
                  setMarker({
                    lat: e.latLng?.lat(),
                    lng: e.latLng?.lng(),
                  });

                  setCoord({
                    lat: e.latLng?.lat(),
                    lng: e.latLng?.lng(),
                  });
                }}
                zoom={16}
                center={
                  coord.lat == undefined || coord.lng == undefined
                    ? { lat: 50.503887, lng: 4.469936 }
                    : (coord as any)
                }
                // mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                onLoad={() => {
                  console.log("map loaded");
                }}
              >
                {
                  // <Marker
                  marker.lat && marker.lng && (
                    <MarkerF
                      key={0}
                      onLoad={() => {
                        console.log("marker loaded");
                      }}
                      position={{ lat: marker.lat, lng: marker.lng }}
                    ></MarkerF>
                  )
                }
              </GoogleMap>
            </div>
          </Modal>
        </>
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
