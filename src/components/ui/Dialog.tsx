import { X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { cn } from '@/utils/cn';

import type { ReactNode } from 'react';

export const Dialog = DialogPrimitive.Root;

interface IDialogContentProps {
  children: ReactNode;
  className?: string;
  closeLabel?: string;
  /** Where focus goes on close; defaults to the Radix trigger (if any). */
  onCloseAutoFocus?: (event: Event) => void;
}

/**
 * Centered dialog on every screen size: 1rem from the screen edges on phones, up to `max-w-xl`
 * wide from tablets up. Content taller than the screen scrolls inside the dialog.
 * Radix traps focus inside, closes on Esc/overlay click and returns focus to the trigger
 * (or wherever `onCloseAutoFocus` sends it when the dialog is opened without a Radix trigger).
 */
export const DialogContent = ({
  children,
  className,
  closeLabel = 'Close',
  onCloseAutoFocus,
}: IDialogContentProps) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      onCloseAutoFocus={onCloseAutoFocus}
      className={cn(
        // inset-0 + m-auto + h-fit centers it without transforms, which the zoom animation uses.
        'fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl flex-col overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface text-fg shadow-2xl',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        className,
      )}
    >
      {children}
      <DialogPrimitive.Close
        aria-label={closeLabel}
        className="absolute top-3 right-3 flex size-11 cursor-pointer items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg"
      >
        <X aria-hidden="true" className="size-5" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

interface IDialogTextProps {
  children: ReactNode;
  className?: string;
}

export const DialogTitle = ({ children, className }: IDialogTextProps) => (
  <DialogPrimitive.Title className={cn('font-display text-3xl leading-tight font-bold', className)}>
    {children}
  </DialogPrimitive.Title>
);

export const DialogDescription = ({ children, className }: IDialogTextProps) => (
  <DialogPrimitive.Description className={cn('text-fg-muted', className)}>
    {children}
  </DialogPrimitive.Description>
);
