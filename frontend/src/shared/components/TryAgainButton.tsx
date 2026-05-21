import { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@shared/utils/cn';

// ---------------------------------------------------------------------------
// Variant & size maps
// ---------------------------------------------------------------------------

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white border-transparent hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500',
  secondary:
    'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400',
  danger:
    'bg-red-600 text-white border-transparent hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500',
  ghost:
    'bg-transparent text-blue-600 border-transparent hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-blue-400',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

const ICON_SIZE_CLASSES: Record<Size, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TryAgainButtonProps {
  /** Async (or sync) callback to invoke on each retry attempt. */
  onClick: () => void | Promise<void>;
  /** Visible button text in the idle state. */
  label?: string;
  /** Visible button text while the callback is running. */
  loadingLabel?: string;
  /** Visible button text once `maxRetries` has been reached. */
  maxRetriesLabel?: string;
  /** Controls colour scheme. */
  variant?: Variant;
  /** Controls height and padding. */
  size?: Size;
  /** Maximum number of allowed retries before the button locks. Defaults to Infinity. */
  maxRetries?: number;
  /** Programmatically disable the button regardless of retry state. */
  disabled?: boolean;
  /** Makes the button full-width on screens narrower than `sm` (640 px). */
  fullWidthOnMobile?: boolean;
  /** Show the rotating refresh icon. */
  showIcon?: boolean;
  /** Extra Tailwind classes for one-off style overrides. */
  className?: string;
  /** id of an element that provides additional context (WAI-ARIA). */
  'aria-describedby'?: string;
}

// ---------------------------------------------------------------------------
// TryAgainButton
// ---------------------------------------------------------------------------

/**
 * A reusable "Try Again" button designed for error/retry scenarios.
 *
 * Features
 * --------
 * - Animated spinning icon while `onClick` resolves (async-aware).
 * - Optional `maxRetries` cap with a disabled + hint state once reached.
 * - Fully keyboard accessible with visible focus ring.
 * - ARIA attributes communicate state to screen readers.
 * - Responsive: fills its container on small screens (`fullWidthOnMobile`).
 * - Three variants (primary, secondary, danger, ghost) and three sizes.
 * - Accepts an arbitrary `className` for one-off overrides.
 *
 * Usage
 * -----
 * ```
 * <TryAgainButton onClick={fetchData} />
 * <TryAgainButton onClick={fetchData} variant="secondary" size="lg" maxRetries={3} />
 * ```
 */
const TryAgainButton = ({
  onClick,
  label = 'Try Again',
  loadingLabel = 'Retrying…',
  maxRetriesLabel = 'Max retries reached',
  variant = 'primary',
  size = 'md',
  maxRetries = Infinity,
  disabled = false,
  fullWidthOnMobile = false,
  showIcon = true,
  className = '',
  'aria-describedby': ariaDescribedBy,
}: TryAgainButtonProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const isExhausted = retryCount >= maxRetries;
  const isDisabled = disabled || isPending || isExhausted;

  const handleClick = useCallback(async () => {
    if (isDisabled) return;

    setIsPending(true);
    try {
      await onClick?.();
      setRetryCount((c) => c + 1);
    } catch {
      // The caller is responsible for handling their own errors.
      // The button simply returns to an enabled idle state so the user
      // can retry again after a failure.
    } finally {
      setIsPending(false);
    }
  }, [isDisabled, onClick]);

  // Determine what the button says right now
  const currentLabel = isPending
    ? loadingLabel
    : isExhausted
    ? maxRetriesLabel
    : label;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isPending}
      aria-label={currentLabel}
      aria-describedby={ariaDescribedBy}
      className={cn(
        // Base
        'inline-flex items-center justify-center font-medium border rounded-md',
        'transition-colors duration-150 ease-in-out',
        // Focus ring — only on keyboard navigation (focus-visible)
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        // Disabled / exhausted state
        isDisabled && !isPending && 'opacity-50 cursor-not-allowed',
        isPending && 'cursor-wait',
        // Responsive width
        fullWidthOnMobile ? 'w-full sm:w-auto' : '',
        // Variant & size
        VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary,
        SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
        className,
      )}
    >
      {showIcon && (
        <RefreshCw
          className={cn(
            ICON_SIZE_CLASSES[size] ?? ICON_SIZE_CLASSES.md,
            'shrink-0',
            isPending && 'animate-spin',
          )}
          aria-hidden="true"
        />
      )}

      <span>{currentLabel}</span>

      {/* Retry counter badge — hidden from sighted users but announced by screen readers */}
      {maxRetries !== Infinity && (
        <span className="sr-only">
          {isExhausted
            ? 'Maximum number of retries reached.'
            : `Attempt ${retryCount + 1} of ${maxRetries}.`}
        </span>
      )}
    </button>
  );
};

export default TryAgainButton;
