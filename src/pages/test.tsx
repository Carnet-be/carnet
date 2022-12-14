// import React from 'react'
// import GoogleMapReact from 'google-map-react';
// import {FaMapMarkerAlt} from 'react-icons/fa'
// import {useEffect, useState, useContext} from 'react'


// const Map = ({ defaultProps, markers,position }) => {


//   return (

//     <GoogleMapReact
//       bootstrapURLKeys={{ key:"AIzaSyBQ1mBJCas2HXTqIYq2CQ3jJ0DsYHfnXNQ" }}
//       defaultCenter={defaultProps.center}
//       defaultZoom={defaultProps.zoom}
//       center={position.center}
//       yesIWantToUseGoogleMapApiInternals
//       onClick={(v)=>{
//         console.log(v)
//       }}
//       // onClickChild={a => {
//       //   console.log('onClickChild', a);
//       // }}

      
//       onGoogleApiLoaded={({ map, maps }) => {
//         //Loading
//         console.log("map",map);
//         console.log('maps',maps)
//       }}
//     >
        
//       {/* {markers && markers.map((m, i) => <Marker key={i} active={active===m.uid} text={i} {...m.position} onClick={()=>onClickChild(m.uid)}/>)} */}
//     </GoogleMapReact>

//   )
// }

// const Marker = ({ text,onClick,active }) => {
//   return <button onClick={onClick} className={`text-2xl  ${active?"text-purple-800":"text-orange-900"}`}><FaMapMarkerAlt/></button>
// }

// export default function Maps() {

//   const defaultProps={
//     center: {
//       lat: 33.98087546234331,
//       lng: -6.85962617941780
//     },
//     zoom: 14
//   }
//   const [position, setdefaultProps] = useState(defaultProps)
 
//   return (
//     <div className="w-screen h-sreen">
//       <Map defaultProps={defaultProps} position={position}  markers={[]}/>
//     </div>
//   );
// }

import {Wrapper} from '@googlemaps/react-wrapper';
import React from 'react';

const App = () => {
  return (
    <Wrapper apiKey={"AIzaSyBQ1mBJCas2HXTqIYq2CQ3jJ0DsYHfnXNQ"}>
    <div className='h-screen w-screen'>
    <Map latitude={0} longitude={0} />
    </div>
    </Wrapper>
  );
};

export default App
const Map = ({latitude, longitude}: {latitude: number; longitude: number}) => {
  const ref = React.useRef(null);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new google.maps.Map(ref.current, {
          zoomControl:false,
          mapTypeControl: false,
         
          isFractionalZoomEnabled:false,
          scaleControl:false,
          
          streetViewControl: false,
          center: {
            lat: latitude ?? 0,
            lng: longitude ?? 0,
          },
          zoom: 11,
        })
      );
    }
  }, [ref, map, latitude, longitude]);

  return <div ref={ref} style={{height: '100%', width: '100%'}} />
}