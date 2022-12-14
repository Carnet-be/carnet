/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wrapper } from "@googlemaps/react-wrapper";
import React from "react";

const Map = ({
  latitude,
  longitude,
  onClick,
  containerClass,
  options
}: {
  latitude: number;
  longitude: number;
  containerClass:string,
  options?:any
  onClick:(el:any)=>void
}) => {
  const ref = React.useRef(null);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  React.useEffect(() => {
    if (ref.current && !map) {
     
     // maps.addListener("click", (el: any) => onClick(el));
     setMap(new google.maps.Map(ref.current, {
      zoomControl: true,
      // mapTypeControl: false,
      // streetViewControl: false,
   
      center: {
        lat: latitude ?? 0,
        lng: longitude ?? 0,
      },

      zoom: 10,
      ...options,
    }));
    }
  }, [ref, map, latitude, longitude]);

  return (

    <Wrapper apiKey={"AIzaSyBQ1mBJCas2HXTqIYq2CQ3jJ0DsYHfnXNQ"} >
      <div className={containerClass}>
      <div ref={ref} style={{ height: "100%", width: "100%" }} />{" "}
      
      </div>
    </Wrapper>
  );
};

export default Map