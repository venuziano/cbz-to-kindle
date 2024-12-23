/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import ReactGA from "react-ga4";

export interface IRecordGAReturnProperties {
  category: string
  // label: string
  action: string
  // userInfo: any
  // reactDeviceInfo: any
}

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const useGA = () => {
  useEffect(() => {
    // Ensure this runs only in the browser
    if (GA_TRACKING_ID) {
      ReactGA.initialize(GA_TRACKING_ID);
    } else {
      console.warn("Google Analytics tracking ID is not set or running on the server.");
    }
  }, []);

  const logPageView = (url: string) => {
    ReactGA.send({ hitType: "pageview", page: url });
  };

  const logEvent = (category: string, action: string, label = "") => {
    try {
      ReactGA.event({
        category: category,
        action: action,
        label: label,
      });
      console.log("Logged event:", { category, action, label });
    } catch (error) {
      console.log('error logEvent', error)
    }
  };

  const recordGa = async (properties: IRecordGAReturnProperties): Promise<void> => {
    const { category, action } = properties
    console.log("User Location:", category, action);
    logEvent(category, action);
  };

  return { logPageView, logEvent, recordGa };
};