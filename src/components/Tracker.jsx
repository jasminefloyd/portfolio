import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-XZL9XRVD9M"); // Replace with your Measurement ID
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};
