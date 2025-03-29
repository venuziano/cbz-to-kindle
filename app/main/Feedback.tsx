import { useCallback, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FaBullhorn } from 'react-icons/fa';
import ErrorToast from './ErrorToast';
import SuccessToast from './SuccessToast';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

interface FormErrors {
  email?: string;
  message?: string;
}

const maxMessageLength: number = 3000

export const Feedback = () => {
  const translation: TFunction = useTranslation('common').t;
 
  const [isFeedbackComponentOpen, setFeedbackComponentOpen] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorToastMessage, setErrorToastMessage] = useState<string>('');
  const [successToastMessage, setSuccessToastMessage] = useState<string>('');
  const [isSendingFeedback, setSendingFeedback] = useState<boolean>(false);

  const closeToast = useCallback(() => setErrorToastMessage(''), []);
  const successToast = useCallback(() => setSuccessToastMessage(''), []);

  const modalVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  };

  const validateForm = (): boolean => {
    const formErrors: { email?: string; message?: string } = {};

    if (!email) {
      formErrors.email = translation('feedback.emailRequired');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      formErrors.email = translation('feedback.invalidEmailAddress');
    }

    if (!message) {
      formErrors.message = translation('feedback.messageRequired');
    } else if (message.length < 10) {
      formErrors.message = translation('feedback.messageMinRequired');
    } else if (message.length > maxMessageLength) {
      formErrors.message = translation('feedback.messageMaxRequired');
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (validateForm()) {
      setSendingFeedback(true)

      const res = await fetch('/api/sendFeedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });

      if (res.ok) {
        setEmail('');
        setMessage('');
        setErrors({});
        setSuccessToastMessage(translation('feedback.successMessage'));
        setFeedbackComponentOpen(false);
      } else {
        setErrorToastMessage(translation('feedback.errorMessage'));
      }

      setSendingFeedback(false)
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
            isSendingFeedback={isSendingFeedback}
            translation={translation}
          />
        )}
      </AnimatePresence>

      <div className="mt-3 md:fixed md:bottom-4 md:right-4 flex items-center space-x-2">
        <span
          onClick={() => setFeedbackComponentOpen(true)}
          className="bg-gray-600 text-white text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-gray-700 hover:scale-105 transition transform duration-200 ease-in-out"
        >
          {translation('feedback.giveFeedback')}
        </span>
        <button
          onClick={() => setFeedbackComponentOpen(true)}
          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 focus:outline-none"
        >
          <FaBullhorn />
        </button>
      </div>

      <ErrorToast message={errorToastMessage} onClose={closeToast} />
      <SuccessToast message={successToastMessage} onClose={successToast} />
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
  isSendingFeedback: boolean;
  translation: TFunction
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
  isSendingFeedback,
  translation
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
      {translation('feedback.feedbackModalDescription')}
    </p>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="flex items-center">
          <label htmlFor="email" className="block text-gray-700">
            {translation('feedback.email')}
          </label>
        </div>
        <input
          type="email"
          name="email"
          id="email"
          placeholder={translation('feedback.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`text-gray-700 mt-1 w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-200' : 'focus:ring-indigo-200'
            }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <label htmlFor="message" className="block text-gray-700">
            {translation('feedback.message')}
          </label>
        </div>
        <textarea
          name="message"
          id="message"
          placeholder={translation('feedback.messagePlaceholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={maxMessageLength}
          className={`text-gray-700 mt-1 w-full px-3 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 ${errors.message ? 'focus:ring-red-200' : 'focus:ring-indigo-200'
            } h-32 resize-none`}
        ></textarea>
        <div className="text-right text-gray-500 text-xs mt-1">
          {message.length} / {maxMessageLength}
        </div>
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
        disabled={isSendingFeedback}
      >
        <span>{isSendingFeedback ? `${translation('feedback.sending')}` : `${translation('feedback.send')}`}</span>

        <svg
          className={`ml-2 h-5 w-5 animate-spin ${isSendingFeedback ? 'visible' : 'invisible'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </button>
    </form>
  </motion.div>
);
