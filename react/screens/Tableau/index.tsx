import React from "react";
import styled from "styled-components";
import Page from "../../components/Page";
import { MAPBOX_TOKEN } from "../../services/mapbox";
import Button from "../../components/Layout/Button";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Terminal } from "../../types";

mapboxgl.accessToken = MAPBOX_TOKEN;

const Map: React.FC = () => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<mapboxgl.Map | null>(null);
  const [currentPositionMarker, setCurrentPositionMarker] =
    React.useState<mapboxgl.Marker | null>(null);
  const [terminals, setTerminals] = React.useState<Terminal[] | null>(null);

  React.useEffect(() => {
    const createTerminalsMarker = async (currentTerminals: Terminal[]) => {
      console.log("createTerminalsMarker", "starting...");
      if (currentTerminals)
        currentTerminals.forEach((terminal: Terminal) => {
          const el = document.createElement("div");
          el.style.width = "10px";
          el.style.height = "10px";
          el.style.borderRadius = "5px";
          el.style.backgroundColor = "#2ecc71";
          el.style.border = "1px solid #ffffff";
          el.className = "marker";
          const marker = new mapboxgl.Marker(el)
            .setLngLat(terminal.geometry.coordinates)
            .setPopup(
              new mapboxgl.Popup().setHTML(`
              ${`<p>gml_id: ${terminal.properties.gml_id}</p>`}
              ${`<p>OBJECTID: ${terminal.properties.OBJECTID}</p>`}
              ${`<p>Identifiant: ${terminal.properties.Identifiant}</p>`}
              ${
                terminal.properties.Adresse
                  ? `<p>Adresse: ${terminal.properties.Adresse}</p>`
                  : ""
              }
              ${`<p>Commune: ${terminal.properties.Commune}</p>`}
              ${
                terminal.properties.Observation
                  ? `<p>Observation: ${terminal.properties.Observation}</p>`
                  : ""
              }
              `)
            )
            .addTo(currentMap);

          console.log("createTerminalsMarker marker", marker.getLngLat());
        });
      console.log("createTerminalsMarker", "done", currentMap);
    };

    const updateTerminalsData = async () => {
      console.log("updateTerminalsData", "starting...");
      const res = await fetch(
        "https://www.data.gouv.fr/fr/datasets/r/3f154ac8-f2a5-4788-8eba-0753dcc2390d"
      );
      const data = await res.json();
      const currentTerminals: Terminal[] = data?.features;
      setTerminals(currentTerminals);
      console.log("updateTerminalsData", "finished");
      createTerminalsMarker(currentTerminals);
    };

    console.log("createMap", "starting...");
    const currentMap = new mapboxgl.Map({
      container: mapRef.current || "",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [2.35, 48.85],
      zoom: 5,
    });
    currentMap.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    setMap(currentMap);

    console.log("createMap", "finished");
    updateTerminalsData();
  }, [setMap]);

  const handleCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (map) {
        map.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 15,
          bearing: 0,
          essential: true,
        });
        if (currentPositionMarker) currentPositionMarker.remove();
        const el = document.createElement("div");
        el.style.width = "10px";
        el.style.height = "10px";
        el.style.borderRadius = "5px";
        el.style.backgroundColor = "#e74c3c";
        el.style.border = "1px solid #ffffff";
        el.className = "marker";
        const marker = new mapboxgl.Marker(el)
          .setLngLat([position.coords.longitude, position.coords.latitude])
          .addTo(map);
        setCurrentPositionMarker(marker);
      }
    });
  };

  return (
    <Page
      title={"Map"}
      buttons={
        <Button onClick={handleCurrentPosition}>Current Location</Button>
      }
    >
      <Mapbox ref={mapRef} />
    </Page>
  );
};

const Mapbox = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export default Map;
