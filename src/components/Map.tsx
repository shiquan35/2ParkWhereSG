import React, { useState, useEffect } from "react";
import "./styles.css";
import ReactMapGL, {
  Marker,
  Popup,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl";
import GeocoderControl from "./GeocoderFiles/geocoder-control";
import "mapbox-gl/dist/mapbox-gl.css";
import { Chip } from "@mui/material";

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

// export interface IAppProps {
//   lotInfo: {
//     Agency: string;
//     Area: string;
//     AvailableLots: number;
//     CarParkID: string;
//     Development: string;
//     Location: string;
//     LotType: string;
//   }[];

type CurrentLocation = {
  longitude: number;
  latitude: number;
  zoom: number;
};

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
};

// export function Map ({ lotInfo }: IAppProps) {
export function Map() {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight - 80,
      });
    };

    // Add event listener to window resize event
    window.addEventListener("resize", handleResize);

    // Call handleResize initially to set the initial screen size
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("screensize", screenSize);
  }, [screenSize]);
  // helper functions for geolocation
  const success = (pos: any): void => {
    const crd = pos.coords;
    setCurrentLocation({
      longitude: crd.longitude,
      latitude: crd.latitude,
      zoom: 15,
    });
  };

  const error = (err: any): void => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    window.location.reload(); // reload page if error
  };

  const options: { enableHighAccuracy: boolean; timeout: number } = {
    enableHighAccuracy: true,
    timeout: 5000,
  };
  // end of helper functions for geolocation

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  // const [currentLocation, setCurrentLocation] = useState<CurrentLocation>({
  //   longitude: 103.8198,
  //   latitude: 1.3521,
  //   zoom: 12,
  // });

  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>(
    null!
  );

  const [viewState, setViewState] = useState<ViewState>({
    longitude: currentLocation?.longitude || 103.8198,
    latitude: currentLocation?.latitude || 1.3521,
    zoom: 15,
  });

  useEffect(() => {
    console.log("currentLocation", currentLocation);
    if (currentLocation) {
      setViewState({
        longitude: currentLocation.longitude,
        latitude: currentLocation.latitude,
        zoom: 15,
      });
    }
    console.log("TOKEN", TOKEN);
  }, [currentLocation]);

  return (
    <>
      {currentLocation && screenSize && (
        <ReactMapGL
          style={{
            width: `${screenSize.width}px`,
            height: `${screenSize.height}px`,
            border: "2px solid black",
          }}
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          mapboxAccessToken={TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          {/* <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          showAccuracyCircle={false}
          position="bottom-right"
        />
        <NavigationControl position="top-right" /> */}
          <div className="geocoderControl">
            <GeocoderControl
              position="top-left"
              mapboxAccessToken={TOKEN}
              zoom={16}
            />
          </div>
        </ReactMapGL>
      )}
    </>
  );
}
