import { Check, ChevronDown, type LucideIcon } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';
import { useId } from 'react';

/** `TValue` narrows the values to a union (e.g. `'asc' | 'desc'`) when needed; defaults to any string. */
export interface ISelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

interface ISelectProps<TValue extends string> {
  label: string;
  /** Decorative icon shown before the label. */
  icon?: LucideIcon;
  value: TValue;
  options: readonly ISelectOption<TValue>[];
  onChange: (value: TValue) => void;
  disabled?: boolean;
}

/**
 * Accessible, animated dropdown (Radix Select): full keyboard support, type-ahead, screen-reader labels.
 * Generic over the value type, so `onChange` receives exactly the type of the options passed in.
 */
export const Select = <TValue extends string>({
  label,
  icon: Icon,
  value,
  options,
  onChange,
  disabled = false,
}: ISelectProps<TValue>) => {
  const labelId = useId();

  // Radix reports a plain string; map it back to the typed option instead of casting.
  const handleValueChange = (next: string) => {
    const option = options.find((item) => item.value === next);

    if (option) {
      onChange(option.value);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className="flex items-center gap-1.5 text-sm font-medium text-fg-muted">
        {Icon ? <Icon aria-hidden="true" className="size-4 shrink-0" /> : null}
        {label}
      </span>
      <SelectPrimitive.Root value={value} onValueChange={handleValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          aria-labelledby={labelId}
          className="group flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-border-strong bg-surface px-3 text-left text-base text-fg transition-colors hover:border-fg-muted disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-fg"
        >
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon asChild>
            <ChevronDown
              aria-hidden="true"
              className="size-5 text-fg-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={6}
            className="z-50 max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-hidden rounded-lg border border-border bg-surface text-fg shadow-xl data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex min-h-11 cursor-pointer items-center rounded-md py-2 pr-3 pl-9 text-base outline-none select-none data-highlighted:bg-surface-muted data-[state=checked]:font-semibold"
                >
                  <SelectPrimitive.ItemIndicator className="absolute left-2.5 inline-flex">
                    <Check aria-hidden="true" className="size-4 text-brand-text" />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
};
