/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client"

import { Skeleton } from '@nextui-org/react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { env } from '~/env.mjs';





type Props = {
    disabled?: boolean
    className?: string
    center?: {
        lat: number,
        lng: number
    }
    onClick?: (pos: {
        lat: number,
        lng: number
    }) => void
    markers?: {
        lat: number,
        lng: number
    }[]
}

function Map({ center, className, onClick, markers, disabled }: Props) {
    const { isLoaded } = useJsApiLoader({
        id: 'carnet-map',
        region: 'MA',
        language: 'en',
        googleMapsApiKey:env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,

    });
    //const { onLoad, onError, onUnmount, filter: locations, loading, } = useMapStore()

    return isLoaded ? <GoogleMap

        mapContainerClassName={className}
        center={center ?? {
            lat:  30.4333,
            lng: -9.6
        }}
        zoom={12}
        onClick={(e) => {
            if (onClick && !disabled) {
                const lat = e?.latLng?.lat()
                const lng = e?.latLng?.lng()
                if (lat && lng) {
                    onClick({
                        lat,
                        lng
                    })
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

        {
            markers?.map((m, i) => <Marker key={i} position={m} />)
        }
        
    </GoogleMap> : <Skeleton className={className} />

}


export default Map;