/** @format */

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "error";
  showPercentage?: boolean;
}

const ProgressBar = ({
  value,
  max = 100,
  className = "",
  size = "md",
  color = "primary",
  showPercentage = true,
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    xs: "h-1",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`progress progress-${color} ${sizeClasses[size]}`}>
        <div
          className={`progress-${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-center mt-1">{percentage.toFixed(0)}%</div>
      )}
    </div>
  );
};

export default ProgressBar;
