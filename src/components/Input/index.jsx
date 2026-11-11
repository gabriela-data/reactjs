import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(function Input(
  {
    id,
    label,
    icon: Icon,
    error,
    type = 'text',
    disabled = false,
    className = '',
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputId = id ?? props.name ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const isPassword = type === 'password';
  const inputType = isPassword && isPasswordVisible ? 'text' : type;
  const describedBy =
    [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-center rounded-lg border bg-white transition focus-within:ring-2 ${
          error
            ? 'border-danger focus-within:border-danger focus-within:ring-danger/20'
            : 'border-gray-300 focus-within:border-primary focus-within:ring-primary/20'
        } ${disabled ? 'cursor-not-allowed bg-gray-100 opacity-70' : ''}`}
      >
        {Icon && (
          <Icon
            aria-hidden="true"
            className="ml-3 size-5 shrink-0 text-gray-400"
          />
        )}

        <input
          {...props}
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
        />

        {isPassword && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="mr-2 rounded p-1 text-gray-500 transition hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed"
            aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={isPasswordVisible}
          >
            {isPasswordVisible ? (
              <EyeOff aria-hidden="true" className="size-5" />
            ) : (
              <Eye aria-hidden="true" className="size-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
