import React, { useState, useEffect } from "react";
import "./styles.css";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Chip } from "@mui/material";

// const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const icon = L.icon({
  iconUrl: "./carparkMarker.png",
  iconSize: [30, 30],
});

function ResetCenterView(props: any) {
  const { selectPosition } = props;
  const map = useMap();

  useEffect(() => {
    if (selectPosition) {
      map.setView(
        L.latLng(selectPosition?.latitude, selectPosition?.longitude),
        map.getZoom(),
        {
          animate: true,
        }
      );
    }
  }, [selectPosition]);

  return null;
}

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

interface IProps {
  selectPosition: CurrentLocation;
}

// export function Map ({ lotInfo }: IAppProps) {
export function Map(props: IProps) {
  const { selectPosition } = props;
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>(
    null!
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        // height: window.innerHeight - 80,
        height: window.innerHeight,
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
  }, [currentLocation]);

  // update currentLocation based on Searched
  useEffect(() => {
    setCurrentLocation(selectPosition);
  }, [selectPosition]);

  return (
    <>
      {currentLocation && screenSize && (
        <MapContainer
          center={[currentLocation.latitude, currentLocation.longitude]}
          zoom={15}
          scrollWheelZoom={true}
          style={{
            width: `${screenSize.width}px`,
            height: `${screenSize.height}px`,
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[currentLocation.latitude, currentLocation.longitude]}
            icon={icon}
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <ResetCenterView selectPosition={selectPosition} />
        </MapContainer>
      )}
    </>
  );
}
