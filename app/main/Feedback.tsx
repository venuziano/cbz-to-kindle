import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FaBullhorn } from 'react-icons/fa';

interface FormErrors {
  email?: string;
  message?: string;
}

export const Feedback = () => {
  const [isFeedbackComponentOpen, setFeedbackComponentOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const modalVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  };

  const validateForm = (): boolean => {
    const formErrors: { email?: string; message?: string } = {};

    if (!email) {
      formErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      formErrors.email = 'Invalid email address';
    }
    
    if (!message) {
      formErrors.message = 'Message is required';
    } else if (message.length < 10) {
      formErrors.message = 'Message must be at least 10 characters';
    } else if (message.length > 3000) {
      formErrors.message = 'Message cannot exceed 3000 characters';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (validateForm()) {
      console.log({ email, message });
      setEmail('');
      setMessage('');
      setErrors({});
      setFeedbackComponentOpen(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isFeedbackComponentOpen && (
          <FeedbackModal
            key="feedback-modal" // Ensures the component identity is stable
            email={email}
            message={message}
            errors={errors}
            handleSubmit={handleSubmit}
            setFeedbackComponentOpen={setFeedbackComponentOpen}
            setEmail={setEmail}
            setMessage={setMessage}
            modalVariants={modalVariants}
          />
        )}
      </AnimatePresence>

      <div className="mt-3 md:fixed md:bottom-4 md:right-4 flex items-center space-x-2">
        <span
          onClick={() => setFeedbackComponentOpen(true)}
          className="bg-gray-600 text-white text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-gray-700 hover:scale-105 transition transform duration-200 ease-in-out"
        >
          Give Feedback
        </span>
        <button
          onClick={() => setFeedbackComponentOpen(true)}
          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 focus:outline-none"
        >
          <FaBullhorn />
        </button>
      </div>
    </>
  );
};

export interface FeedbackModalProps {
  email: string;
  message: string;
  errors: FormErrors;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFeedbackComponentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  modalVariants: Variants;
}

export const FeedbackModal = ({
  email,
  message,
  errors,
  handleSubmit,
  setFeedbackComponentOpen,
  setEmail,
  setMessage,
  modalVariants,
}: FeedbackModalProps) => (
  <motion.div
    variants={modalVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ duration: 0.3, ease: 'easeOut' }}
    style={{ transformOrigin: 'bottom right' }}
    onClick={(e) => e.stopPropagation()}
    className="fixed bottom-20 md:right-4 max-w-xl bg-white border rounded-lg p-8 shadow-lg"
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium text-gray-900">Feedback</h2>
      <button
        onClick={() => setFeedbackComponentOpen(false)}
        className="text-gray-600 hover:text-gray-800 focus:outline-none text-2xl"
      >
        &times;
      </button>
    </div>
    <p className="mb-5 leading-relaxed text-gray-600">
      If you had any issues or you liked our product, please share with us!
    </p>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="flex items-center">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
        </div>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`text-gray-700 mt-1 w-full px-3 py-2 border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 ${
            errors.email ? 'focus:ring-red-200' : 'focus:ring-indigo-200'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <label htmlFor="message" className="block text-gray-700">
            Message
          </label>
        </div>
        <textarea
          name="message"
          id="message"
          placeholder="Your feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={3000} // Limit to 3000 characters
          className={`text-gray-700 mt-1 w-full px-3 py-2 border ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 ${
            errors.message ? 'focus:ring-red-200' : 'focus:ring-indigo-200'
          } h-32 resize-none`}
        ></textarea>
        <div className="text-right text-gray-500 text-xs mt-1">
          {message.length} / 3000
        </div>
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
      >
        Send
      </button>
    </form>
  </motion.div>
);
