import ROUTES from "../constants/routes";
import { RouteProps } from "../types";
import Map from "./Map";
import SignIn from "./SignIn";

const screens: RouteProps[] = [
  { path: ROUTES.LANDING, exact: true, component: SignIn, available: true },
  { path: ROUTES.MAP, exact: true, component: Map },
  // { path: ROUTES.CASINO, exact: true, component: CasinoRating },
];

export default screens;
