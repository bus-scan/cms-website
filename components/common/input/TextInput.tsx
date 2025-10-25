import { forwardRef } from "react";

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  multiline?: boolean;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TextInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextInputProps>(
  ({ label, error, icon, iconPosition = "right", className = "", multiline = false, rows = 3, ...props }, ref) => {
    const baseInputClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900";
    const errorClasses = error ? "border-red-300 focus:ring-red-500" : "border-gray-300";
    const iconClasses = icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "";

    // Separate props for input and textarea
    const inputProps = multiline ? {
      ...props,
      rows,
    } : props;

    return (
      <div className="mb-4 text-sm">
        {label && (
          <label htmlFor={props.id} className="block text-gray-700 font-medium mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={`${baseInputClasses} ${errorClasses} ${iconClasses} ${className}`}
              {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={`${baseInputClasses} ${errorClasses} ${iconClasses} ${className}`}
              {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {icon && iconPosition === "right" && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
