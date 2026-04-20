"use client";
import React from "react";
import {
  GoogleMap,
  StreetViewPanorama,
  useJsApiLoader,
} from "@react-google-maps/api";
import data from "./data.json";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries = ["geometry", "drawing"];

function MyStreetView({ neighborhood }) {
  console.log(neighborhood);
  const neighborhoodIndex = data.findIndex((n) => n.name === neighborhood);
  console.log('RENDERING STREET VIEW');

  const center = {
    lng: data[neighborhoodIndex].longitude,
    lat: data[neighborhoodIndex].lattitude,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB1kxE-SSBEOkNmw9-vIXvbh37EWBlfHYY",
    libraries: libraries,
  });

  return (
    <div className="flex h-full">
      {isLoaded && (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          <StreetViewPanorama
            position={center}
            pov={{ heading: 100, pitch: 0 }}
            visible={true}
          />
        </GoogleMap>
      )}
    </div>
  );
}

export default React.memo(MyStreetView);
