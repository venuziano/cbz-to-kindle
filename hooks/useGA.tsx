import { useEffect } from "react";
import ReactGA from "react-ga4";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

export const useGA = () => {
  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window !== "undefined" && GA_TRACKING_ID) {
      ReactGA.initialize(GA_TRACKING_ID);
      console.log("GA initialized with ID:", GA_TRACKING_ID);
    } else {
      console.warn("Google Analytics tracking ID is not set or running on the server.");
    }
  }, []);

  const logPageView = (url: string) => {
    if (typeof window !== "undefined" && GA_TRACKING_ID) {
      ReactGA.send({ hitType: "pageview", page: url });
      console.log("Logged page view:", url);
    }
  };

  const logEvent = (category: string, action: string, label = "") => {
    if (typeof window !== "undefined" && GA_TRACKING_ID) {
      ReactGA.event({
        category: category,
        action: action,
        label: label,
      });
      console.log("Logged event:", { category, action, label });
    }
  };

  return { logPageView, logEvent };
};