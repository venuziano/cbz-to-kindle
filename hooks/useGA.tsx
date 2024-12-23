/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import ReactGA from "react-ga4";

export interface IRecordGAReturnProperties {
  category: string
  label?: string
  action: string
}

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const useGA = () => {
  useEffect(() => {
    if (GA_TRACKING_ID) {
      ReactGA.initialize(GA_TRACKING_ID);
    } else {
      console.warn("Google Analytics tracking ID is not set or running on the server.");
    }
  }, []);

  const logPageView = (url: string) => {
    ReactGA.send({ hitType: "pageview", page: url });
  };

  const recordGa = (properties: IRecordGAReturnProperties) => {
    const { category, action, label = '' } = properties

    try {
      ReactGA.event({
        category: category,
        action: action,
        label: label,
      });

      console.log('recordGa', category, action)
    } catch (error) {
      console.log('error logEvent', error)
    }
  };

  return { logPageView, recordGa };
};