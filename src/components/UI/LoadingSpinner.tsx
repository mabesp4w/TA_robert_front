/** @format */

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({
  size = "md",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <span
        className={`loading loading-spinner ${sizeClasses[size]} text-primary`}
      ></span>
    </div>
  );
};

export default LoadingSpinner;
