
import React, { ButtonHTMLAttributes, InputHTMLAttributes, useEffect, useState, useRef, HTMLAttributes } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

// --- SPINNER ---
export const Spinner: React.FC<{ className?: string, size?: number }> = ({ className, size = 18 }) => (
  <Loader2 className={cn("animate-spin text-current", className)} size={size} />
);

// --- SKELETON ---
export const Skeleton: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("animate-pulse rounded-md bg-slate-200/80", className)} {...props} />
);

// --- CARD ---
export const Card: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className)} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("p-6 border-b border-slate-100", className)}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("p-6", className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h3 className={cn("text-lg font-semibold text-slate-900 tracking-tight", className)}>
    {children}
  </h3>
);

// --- BADGE ---
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary'; className?: string }> = ({ children, variant = 'neutral', className }) => {
  const variants = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-rose-100 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
    primary: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", variants[variant], className)}>
      {children}
    </span>
  );
};

// --- BUTTON ---
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className, isLoading, disabled, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  const variantsMap = {
    primary: "bg-primary text-white hover:bg-[#4F46E5] focus:ring-primary shadow-md shadow-primary/20",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900 focus:ring-slate-200",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-200",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600"
  };
  const sizesMap = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-2"
  };

  return (
    <button 
      className={cn(baseStyles, variantsMap[variant], sizesMap[size], className)} 
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Spinner className="mr-2" size={size === 'sm' ? 12 : 16} />}
      {children}
    </button>
  );
};

// --- INPUT & TEXTAREA ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
export const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <input 
    className={cn("flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all", className)}
    {...props}
  />
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => (
  <textarea 
    className={cn("flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all", className)}
    {...props}
  />
);

// --- CHECKBOX & LABEL ---
export const Checkbox: React.FC<{ checked?: boolean; onCheckedChange?: (checked: boolean) => void; className?: string; id?: string }> = ({ checked, onCheckedChange, className, id }) => (
  <button
    type="button"
    id={id}
    role="checkbox"
    aria-checked={checked}
    onClick={() => onCheckedChange?.(!checked)}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-slate-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
      checked ? "bg-primary border-primary text-white" : "bg-white",
      className
    )}
  >
    {checked && <Check size={12} strokeWidth={3} />}
  </button>
);

export const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>
    {children}
  </label>
);

// --- POPOVER ---
// Simplified implementation for mock environment (usually requires Radix UI / Floating UI)
interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Popover: React.FC<PopoverProps> = ({ trigger, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-64 md:w-72 origin-top-left rounded-xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100 border border-slate-100">
          {content}
        </div>
      )}
    </div>
  );
};

export const PopoverTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("cursor-pointer", className)}>{children}</div>
);

export const PopoverContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("p-1", className)}>
    {children}
  </div>
);


// --- TABS ---
export const Tabs: React.FC<{ value: string; onValueChange: (v: string) => void; children: React.ReactNode; className?: string }> = ({ value, children, className }) => (
  <div className={cn("w-full", className)} data-value={value}>{children}</div>
);

export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500", className)}>
    {children}
  </div>
);

export const TabsTrigger: React.FC<{ value: string; onClick?: () => void; activeValue?: string; children: React.ReactNode; className?: string }> = ({ value, onClick, activeValue, children, className }) => {
  const isActive = activeValue === value; 
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-white text-slate-950 shadow-sm" : "hover:bg-slate-200/50 hover:text-slate-900",
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{ value: string; activeValue?: string; children: React.ReactNode; className?: string }> = ({ value, activeValue, children, className }) => {
  if (value !== activeValue) return null;
  return <div className={cn("mt-2 ring-offset-white focus-visible:outline-none", className)}>{children}</div>;
};

// --- SHEET (DRAWER) ---
interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md md:max-w-lg h-full bg-white shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300 flex flex-col">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
        >
          <X size={18} />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export const SheetHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-2 p-6 border-b border-slate-100 bg-slate-50/50", className)}>
    {children}
  </div>
);

export const SheetTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h2 className={cn("text-lg font-semibold text-slate-950", className)}>
    {children}
  </h2>
);

export const SheetContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("flex-1 overflow-y-auto p-6", className)}>
    {children}
  </div>
);

// --- DIALOG (MODAL) ---
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6 border-b border-slate-100", className)}>
    {children}
  </div>
);

export const DialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h2 className={cn("text-lg font-semibold text-slate-950", className)}>
    {children}
  </h2>
);

export const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-xl", className)}>
    {children}
  </div>
);

export const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("p-6 overflow-y-auto", className)}>
    {children}
  </div>
);
