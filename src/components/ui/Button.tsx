import { buttonVariants, type ButtonVariantProps } from '@/components/ui/button-variants';
import { cn } from '@/utils/cn';

import type { ComponentPropsWithRef, MouseEvent } from 'react';

interface IButtonProps extends ComponentPropsWithRef<'button'>, ButtonVariantProps {}

/**
 * `disabled` renders as `aria-disabled` instead of the native attribute: the button stays
 * focusable, so keyboard and screen-reader users don't lose their place when it becomes
 * disabled while focused (e.g. "Next" on the last slide, "Try again" while retrying).
 */
export const Button = ({
  className,
  variant,
  size,
  type = 'button',
  disabled = false,
  onClick,
  ...props
}: IButtonProps) => (
  <button
    type={type}
    aria-disabled={disabled || undefined}
    onClick={(event: MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    }}
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
);
