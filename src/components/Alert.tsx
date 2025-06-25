import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { XCircle, CheckCircle, AlertCircle, InfoIcon } from "lucide-react";

const alertVariants = cva(
  "relative flex items-center p-4 rounded-lg shadow-md border border-l-4 text-sm font-medium",
  {
    variants: {
      type: {
        primary: "bg-gray-900 border-[#330d69] text-[#30c9cd]",
        success: "bg-gray-900 border-green-300 text-green-300",
        danger: "bg-gray-900 border-red-500 text-red-500",
        warning: "bg-gray-900 border-yellow-400 text-yellow-400",
      },
    },
    defaultVariants: {
      type: "primary",
    },
  }
);

export interface AlertProps extends VariantProps<typeof alertVariants> {
  message: string;
  type?: "primary" | "success" | "danger" | "warning";
  icon?: ReactNode;
  onClose?: () => void;
}

const DefaultIcons: Record<string, ReactNode> = {
  primary: <InfoIcon size={18} className="text-blue-500" />,
  success: <CheckCircle size={18} className="text-green-500" />,
  danger: <XCircle size={18} className="text-red-500" />,
  warning: <AlertCircle size={18} className="text-yellow-500" />,
};

const Alert = ({ message, type = "primary", icon, onClose }: AlertProps) => {
  const defaultIcon = DefaultIcons[type];

  return (
    <div className={alertVariants({ type })}>
      {/* Icon */}
      <div className="mr-3">{icon || defaultIcon}</div>

      {/* Message */}
      <div className="flex-1">{message}</div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close alert"
        >
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
