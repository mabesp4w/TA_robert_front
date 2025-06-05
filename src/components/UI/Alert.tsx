/** @format */

import { ReactNode } from "react";
import {
  CheckCircleIcon,
  InfoIcon,
  TriangleDashedIcon,
  XCircleIcon,
} from "lucide-react";

interface AlertProps {
  type: "info" | "success" | "warning" | "error";
  title?: string;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}

const Alert = ({
  type,
  title,
  children,
  className = "",
  onClose,
}: AlertProps) => {
  const icons = {
    info: InfoIcon,
    success: CheckCircleIcon,
    warning: TriangleDashedIcon,
    error: XCircleIcon,
  };

  const Icon = icons[type];

  return (
    <div className={`alert alert-${type} ${className}`}>
      <Icon className="h-6 w-6 shrink-0" />
      <div className="flex-1">
        {title && <h3 className="font-bold">{title}</h3>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
          <XCircleIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
