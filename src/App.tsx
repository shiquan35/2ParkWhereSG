import React, { useState, useEffect } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Map } from "./components/Map";
import Navigation from "./components/Navigation";

function App() {
  const [nav, setNav] = useState<string>("map");
  return (
    <>
      {/* <Header /> */}
      <Map />
      <Navigation nav={nav} setNav={setNav} />
    </>
  );
}

export default App;
