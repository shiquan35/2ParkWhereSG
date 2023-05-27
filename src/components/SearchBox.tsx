import React, { useState } from "react";
import "./styles.css";
import {
  OutlinedInput,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

const NOMANATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const params = {
  q: "",
  format: "json",
  addressdetails: "addressdetails",
};

type CurrentLocation = {
  longitude: number;
  latitude: number;
  zoom: number;
};

interface IProps {
  selectPosition: CurrentLocation;
  setSelectPosition: React.Dispatch<React.SetStateAction<CurrentLocation>>;
}

export function SearchBox(props: IProps) {
  const { selectPosition, setSelectPosition } = props;
  const [searchText, setSearchText] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Array<any>>([]);

  return (
    <>
      <div
        className="searchbox"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "75%",
          overflow: "scroll",
          maxHeight: "30vh",
        }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, height: "40px" }}>
            <OutlinedInput
              style={{ width: "100%" }}
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
              }}
            />
          </div>
        </div>
        {searchResult && (
          <div>
            <List component="nav">
              {searchResult.map((item) => {
                return (
                  <div key={item?.osm_id}>
                    <ListItem
                      button
                      onClick={() => {
                        setSearchText(item?.display_name);
                        setSearchResult([]);
                        setSelectPosition({
                          longitude: Number(item.lon),
                          latitude: Number(item.lat),
                          zoom: 20,
                        });
                      }}
                    >
                      <ListItemButton>
                        <ListItemText primary={item?.display_name} />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </div>
                );
              })}
            </List>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          right: "5%",
          top: "3%",
          zIndex: "3",
        }}
      >
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            // search
            const params = {
              q: searchText,
              format: "json",
              addressdetails: "1",
            };
            const queryString = new URLSearchParams(params).toString();
            const requestOptions = {
              method: "GET",
              redirect: "follow" as RequestRedirect,
            };
            fetch(`${NOMANATIM_BASE_URL}${queryString}`, requestOptions)
              .then((response) => response.text())
              .then((result) => {
                console.log(JSON.parse(result));
                setSearchResult(JSON.parse(result));
              })
              .catch((err) => console.log("search error", err));
          }}
        >
          Search
        </Button>
      </div>
    </>
  );
}
