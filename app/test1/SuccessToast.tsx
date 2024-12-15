// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';

interface ISuccessToastProperties {
  message: string,
  onClose: () => void
  duration?: number
}

const SuccessToast = ({ message, onClose, duration = 3000 }: ISuccessToastProperties) => {
  useEffect(() => {
    if (!message) return;

    // Set a timer to automatically close the toast
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); // Cleanup timer
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div
      className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
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

export default SuccessToast;