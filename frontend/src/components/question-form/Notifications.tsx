import React, { useCallback, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const NOTIFICATION_TTL = 3000;

interface NotificationProps extends React.PropsWithChildren {
  removeNotif: () => void;
}

interface ErrorNotificationProps {
  errorMessage: string;
  removeNotif: () => void;
}

const Notification = ({ children, removeNotif }: NotificationProps) => {
  const removeNotificationCallback = useCallback(removeNotif, [removeNotif]);

  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      removeNotificationCallback();
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, [removeNotificationCallback]);

  return (
    <motion.div
      layout
      initial={{ y: -15, scale: 0.95 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="p-4 flex items-center border-2 border-black gap-2 text-sm font-medium shadow-lg text-white bg-red-500 pointer-events-auto fixed top-4 w-128"
    >
      {children}
      <button
        onClick={() => removeNotificationCallback()}
        className="ml-auto mt-0.5"
      >
        <FiX />
      </button>
    </motion.div>
  );
};

export const FormSubmissionErrorNotification = ({
  errorMessage,
  removeNotif,
}: ErrorNotificationProps) => {
  return (
    <Notification removeNotif={removeNotif}>
      {/* TODO: Can add an icon here? */}
      <span>{errorMessage}</span>
    </Notification>
  );
};
