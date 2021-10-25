import type { RouteProps as RouterRouteProps } from "react-router-dom";

export type RouteProps = RouterRouteProps & {
  available?: boolean;
};

export type Terminal = {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    Adresse?: string;
    Commune: string;
    OBJECTID: number;
    Observation?: string;
    gml_id: string;
    Identifiant: string;
  };
};
