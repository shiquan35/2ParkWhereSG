import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Header } from "./components/Header";
import { Map } from "./components/Map";
import Navigation from "./components/Navigation";
import { useQuery } from "@tanstack/react-query";

type CarparkDetails = {
  Agency: string;
  Area: string;
  AvailableLots: number;
  CarParkID: string;
  Development: string;
  Location: string;
  LotType: string;
};

function App() {
  // const [nav, setNav] = useState<string>("map");
  const [ltaCarparks, setLtaCarparks] = useState<CarparkDetails[]>([]);

  // useEffect(() => {
  //   axios
  //     .get("https://fierce-puce-shark.cyclic.app/")
  //     .then((res) => setLtaCarparks(res.data))
  //     .catch((err) => console.log("fetch carpark err", err));
  // }, []);

  const { isLoading, error, data, isFetching } = useQuery(
    ["ltaCarparks"],
    () =>
      axios
        .get("https://fierce-puce-shark.cyclic.app/")
        .then((res) => setLtaCarparks(res.data))
    // .catch((err) => console.log("fetch carpark err", err))
  );

  return (
    <>
      {/* <Header /> */}
      <Map ltaCarparks={ltaCarparks} isFetching={isFetching} />
      {/* <Navigation nav={nav} setNav={setNav} /> */}
    </>
  );
}

export default App;
