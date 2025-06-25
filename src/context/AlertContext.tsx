"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "@/components/Alert";
import { type ReactNode as Node } from "react";

type AlertType = "primary" | "success" | "danger" | "warning";

interface AlertOptions {
  message: string;
  type?: AlertType;
  icon?: Node;
  duration?: number; // Auto-dismiss duration in milliseconds
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Animation variants
const alertVariants = {
  hidden: {
    opacity: 0,
    y: -50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertOptions | null>(null);
  const [alertId, setAlertId] = useState<number>(0); // Used to force re-render for animations

  const showAlert = useCallback((options: AlertOptions) => {
    setAlert({ ...options, duration: options.duration || 5000 });
    setAlertId((prev) => prev + 1);

    // Auto-dismiss alert
    if (options.duration !== 0) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, options.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        <AnimatePresence mode="wait">
          {alert && (
            <motion.div
              key={alertId}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={alertVariants}
              layout
            >
              <Alert
                message={alert.message}
                type={alert.type}
                icon={alert.icon}
                onClose={handleClose}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
