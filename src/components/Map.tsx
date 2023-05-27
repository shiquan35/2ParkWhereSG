import React, { useState, useEffect } from "react";
import "./styles.css";
import ReactMapGL, {
  Marker,
  Popup,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl";
import GeocoderControl from "./GeocoderFiles/geocoder-control";
import carparkMarker from "./carparkMarker.png";
import { v4 as uuid } from "uuid";
import "mapbox-gl/dist/mapbox-gl.css";
import { Chip, Table } from "@mui/material";
import { Text, Title } from "@mantine/core";

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

interface IAppProps {
  ltaCarparks: {
    Agency: string;
    Area: string;
    AvailableLots: number;
    CarParkID: string;
    Development: string;
    Location: string;
    LotType: string;
  }[];
}

type CarparkInfo = {
  Agency: string;
  Area: string;
  AvailableLots: number;
  CarParkID: string;
  Development: string;
  Location: string;
  LotType: string;
};

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
export function Map({ ltaCarparks }: IAppProps) {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>(
    null!
  );
  const [selectedCarpark, setSelectedCarpark] = useState<CarparkInfo | null>(
    null
  );

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
          }}
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          mapboxAccessToken={TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          <div className="geocoderControl">
            <GeocoderControl
              position="top-left"
              mapboxAccessToken={TOKEN}
              zoom={16}
            />
          </div>

          {Array.isArray(ltaCarparks) &&
            ltaCarparks.map(
              (lot) =>
                Math.sqrt(
                  (viewState.latitude - Number(lot.Location.split(" ")[0])) **
                    2 +
                    (viewState.longitude -
                      Number(lot.Location.split(" ")[1])) **
                      2
                ) <= 0.0035 &&
                lot.LotType === "C" && (
                  <Marker
                    key={uuid()}
                    latitude={Number(lot.Location.split(" ")[0])}
                    longitude={Number(lot.Location.split(" ")[1])}
                  >
                    <button
                      className="markerButton"
                      onClick={(event) => {
                        event.preventDefault();
                        setSelectedCarpark(lot);
                      }}
                    >
                      <img src={carparkMarker} alt="Carpark" />
                    </button>
                  </Marker>
                )
            )}

          {selectedCarpark && (
            <Popup
              style={{ width: `300px` }}
              longitude={Number(selectedCarpark.Location.split(" ")[1])}
              latitude={Number(selectedCarpark.Location.split(" ")[0])}
              closeOnClick={false}
              onClose={() => setSelectedCarpark(null)}
            >
              <div
                onClick={(event) => {
                  event.preventDefault();
                  setSelectedCarpark(null);
                }}
              >
                {/* <Title order={4}>{selectedCarpark.Development}</Title> */}
                <h3>{selectedCarpark.Development}</h3>
                {/* <Text fw={700} fz="md">
                  Lots available: {selectedCarpark.AvailableLots}
                </Text> */}
                <h6>Lots available: {selectedCarpark.AvailableLots}</h6>
              </div>
            </Popup>
          )}
        </ReactMapGL>
      )}
    </>
  );
}
