import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GoogleMapsProvider from "./components/GoogleMapsProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleMapsProvider>
      <App />
    </GoogleMapsProvider>
  </React.StrictMode>
);
