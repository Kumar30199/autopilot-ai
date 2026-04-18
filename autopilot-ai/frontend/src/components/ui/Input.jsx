import { forwardRef } from "react";

const Input = forwardRef(({ className = "", icon: Icon, color = "cyan", ...props }, ref) => {
  const glowClass = color ? `input-focus-${color}` : "input-glow";
  
  return (
    <div className={`relative flex-1 ${className}`}>
      <input
        ref={ref}
        className={`input-base ${glowClass} ${Icon ? "pr-12" : ""}`}
        {...props}
      />
      {Icon && (
        <Icon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
