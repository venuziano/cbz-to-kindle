// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';

interface IErrorToastProperties {
  message: string,
  onClose: () => void
  duration?: number
}

const ErrorToast = ({ message, onClose, duration = 3000 }: IErrorToastProperties) => {
  useEffect(() => {
    if (!message) return;

    // Set a timer to automatically close the toast
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    // Clear the timer if the component unmounts or message changes
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div
      className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate-bounce z-50"
      role="alert"
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          className="ml-4 text-white hover:text-gray-200"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;