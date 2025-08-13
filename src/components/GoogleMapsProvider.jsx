import React from "react";
import { LoadScriptNext } from "@react-google-maps/api";

const libraries = ["places"];

const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScriptNext
      googleMapsApiKey="AIzaSyDnwBHYVZjvlrU2FHW5ZxTs1VFPzNxXDWE"
      libraries={libraries}
    >
      {children}
    </LoadScriptNext>
  );
};

export default GoogleMapsProvider;
