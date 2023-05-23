import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Paper from "@mui/material/Paper";

interface IProps {
  nav: string;
  setNav: React.Dispatch<React.SetStateAction<string>>;
}

const Navigation: React.FC<IProps> = ({ nav, setNav }) => {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setNav(newValue);
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 7, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        sx={{ width: "100%" }}
        value={nav}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Map"
          value="map"
          icon={<LocationOnIcon />}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favourites"
          icon={<FavoriteIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation;
