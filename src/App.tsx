import React, { useState, useEffect } from "react";
import "./App.css";
// import { Header } from "./components/Header";
import { Map } from "./components/Map";
// import Navigation from "./components/Navigation";
import { SearchBox } from "./components/SearchBox";

type CurrentLocation = {
  longitude: number;
  latitude: number;
  zoom: number;
};

function App() {
  const [selectPosition, setSelectPosition] = useState<CurrentLocation>(null!);

  return (
    <>
      <div className="container">
        <Map selectPosition={selectPosition} />
        <SearchBox
          selectPosition={selectPosition}
          setSelectPosition={setSelectPosition}
        />
      </div>
      {/* <Navigation nav={nav} setNav={setNav} /> */}
    </>
  );
}

export default App;
