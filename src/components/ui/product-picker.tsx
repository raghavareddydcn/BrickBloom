import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Option = { name: string; hint?: string };

interface ProductPickerProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Touch-friendly replacement for <input list> / <datalist>, which is unreliable on
 * mobile browsers and gets clipped inside horizontally scrolling tables.
 * The menu is portalled to <body> with fixed positioning so it is never clipped.
 */
export function ProductPicker({ value, options, onChange, disabled, placeholder, className }: ProductPickerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(false);
  const [rect, setRect] = useState<{ left: number; top: number; width: number; maxHeight: number; above: boolean } | null>(null);

  const query = typed ? value.trim().toLowerCase() : '';
  const filtered = query ? options.filter(option => option.name.toLowerCase().includes(query)) : options;

  const place = () => {
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return;
    const below = window.innerHeight - box.bottom - 8;
    const above = box.top - 8;
    const showAbove = below < 200 && above > below;
    const width = Math.min(Math.max(box.width, 240), window.innerWidth - 16);
    setRect({
      left: Math.max(8, Math.min(box.left, window.innerWidth - width - 8)),
      top: showAbove ? box.top - 4 : box.bottom + 4,
      width,
      maxHeight: Math.min(280, showAbove ? above : below),
      above: showAbove,
    });
  };

  useLayoutEffect(() => { if (open) place(); }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!wrapRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    const reposition = () => place();
    document.addEventListener('pointerdown', close);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      document.removeEventListener('pointerdown', close);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [open]);

  const select = (name: string) => { onChange(name); setTyped(false); setOpen(false); };

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => { setTyped(false); setOpen(true); }}
        onChange={event => { onChange(event.target.value); setTyped(true); setOpen(true); }}
        onKeyDown={event => {
          if (event.key === 'Escape') setOpen(false);
          if (event.key === 'Enter' && open && filtered[0]) { event.preventDefault(); select(filtered[0].name); }
        }}
        className="h-9 w-full rounded border border-slate-200 bg-white pl-2 pr-8 text-sm disabled:bg-slate-50 disabled:text-slate-500"
      />
      {!disabled && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Show products"
          onPointerDown={event => event.preventDefault()}
          onClick={() => { setTyped(false); setOpen(current => !current); }}
          className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-slate-400 hover:text-slate-700"
        >
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        </button>
      )}
      {open && !disabled && rect && createPortal(
        <div
          ref={menuRef}
          role="listbox"
          style={{ position: 'fixed', left: rect.left, width: rect.width, maxHeight: rect.maxHeight, ...(rect.above ? { bottom: window.innerHeight - rect.top } : { top: rect.top }) }}
          className="z-[1000] overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-xl"
        >
          {filtered.length ? filtered.map(option => (
            <button
              key={option.name}
              type="button"
              role="option"
              aria-selected={option.name === value}
              onPointerDown={event => event.preventDefault()}
              onClick={() => select(option.name)}
              className={cn('flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-emerald-50 active:bg-emerald-100', option.name === value && 'bg-emerald-50 font-semibold text-emerald-900')}
            >
              <Check className={cn('h-4 w-4 shrink-0 text-emerald-700', option.name !== value && 'invisible')} />
              <span className="min-w-0 flex-1 truncate">{option.name}</span>
              {option.hint && <span className="shrink-0 text-xs text-slate-400">{option.hint}</span>}
            </button>
          )) : <div className="px-3 py-2.5 text-slate-500">No match — "{value}" will be used as a custom item</div>}
        </div>,
        document.body,
      )}
    </div>
  );
}
