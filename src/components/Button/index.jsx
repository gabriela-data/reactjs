import { LoaderCircle } from 'lucide-react';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary/90 focus-visible:outline-primary',
  secondary:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-primary',
  danger: 'bg-danger text-white hover:bg-danger/90 focus-visible:outline-danger',
  ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:outline-primary',
};

const sizes = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-12 px-5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
    >
      {loading && (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      )}
      {children}
    </button>
  );
}
