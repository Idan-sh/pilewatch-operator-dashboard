import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";

export type DropdownSelectOption = {
  value: string;
  label: string;
};

export type DropdownSelectProps = {
  /** Stable id prefix (e.g. from `useId()`). */
  id: string;
  label: string;
  value: string;
  options: DropdownSelectOption[];
  onChange: (value: string) => void;
};

export default function DropdownSelect({
  id,
  label,
  value,
  options,
  onChange
}: DropdownSelectProps) {
  const triggerId = `${id}-trigger`;
  const listboxId = `${id}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const displayLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? "",
    [options, value]
  );

  const handleToggle = useCallback(() => {
    setIsOpen((o) => !o);
  }, []);

  const handleOptionClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const next = event.currentTarget.dataset.value;
      if (next != null) {
        onChange(next);
        setIsOpen(false);
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <label
        htmlFor={triggerId}
        className="text-muted-foreground mb-2 block text-xs font-semibold uppercase tracking-wider"
      >
        {label}
      </label>
      <button
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={handleToggle}
        className={[
          "border-border bg-background text-foreground flex w-full min-h-[2.5rem] cursor-pointer items-center justify-between gap-3 rounded-control border px-3 py-2 text-left text-sm font-medium",
          "focus-visible:ring-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        ].join(" ")}
      >
        <span className="min-w-0 flex-1 truncate">{displayLabel}</span>
        <ChevronDown
          className={[
            "text-muted-foreground size-4 shrink-0 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          ].join(" ")}
          aria-hidden
        />
      </button>
      {isOpen ? (
        <ul
          id={listboxId}
          role="listbox"
          className="border-border bg-card absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-auto rounded-control border py-1 shadow-panel"
        >
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <li key={opt.value} role="presentation" className="m-0 list-none p-0">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  data-value={opt.value}
                  onClick={handleOptionClick}
                  className={[
                    "text-foreground hover:bg-accent-soft w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors",
                    selected ? "bg-accent-soft font-medium" : "font-normal"
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
