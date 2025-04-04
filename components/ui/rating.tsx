import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Rating({ value, onChange, readOnly = false, size = "md" }: RatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const filled = value >= star;
        const half = value >= star - 0.5 && value < star;

        return (
          <button
            key={star}
            type="button"
            onClick={() => !readOnly && onChange?.(star)}
            className={cn(
              "text-yellow-400 hover:text-yellow-500 transition-colors",
              readOnly && "cursor-default hover:text-yellow-400"
            )}
            disabled={readOnly}
          >
            {half ? (
              <StarHalf className={sizeClasses[size]} />
            ) : (
              <Star
                className={sizeClasses[size]}
                fill={filled ? "currentColor" : "none"}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}