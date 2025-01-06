/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import ReactGA from "react-ga4";
import * as Sentry from "@sentry/nextjs";
import ga4 from "react-ga4";

export interface IRecordGAReturnProperties {
  category: string
  label?: string
  action: string
}

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const useGA = () => {
  useEffect(() => {
    if (GA_TRACKING_ID) {
      ReactGA.initialize(GA_TRACKING_ID, {
        gaOptions: {
          cookieDomain: 'none',
          transport: 'xhr', // Send data via the API route instead of direct GA servers
        }
      });
    } else {
      console.warn("Google Analytics tracking ID is not set or running on the server.");
    }
  }, []);

  const logPageView = (url: string) => {
    ReactGA.send({ hitType: "pageview", page: url });
  };

  const recordGa = async (properties: IRecordGAReturnProperties): Promise<void> => {
    try {
      const response: Response = await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: properties.category,
          action: properties.action,
          label: properties.label || '',
        }),
      });
      console.log('record ga4 response', response.body)
    } catch (error) {
      console.error('GA Event Error:', error);
      Sentry.captureException(error);
    }
  };

  return { logPageView, recordGa };
};