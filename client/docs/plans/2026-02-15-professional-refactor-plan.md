# Professional Codebase Refactor Plan

## Overview

Refactor the AI Trip Planning client from a mixed-structure codebase to a professional, maintainable, feature-based architecture with complete separation of concerns.

**Goals:**
1. Feature-based folder structure
2. Complete separation of logic from UI (no business logic in components)
3. Convert all CSS to Tailwind utilities
4. Mobile-first responsive design that scales to desktop
5. Reusable shared components and hooks

**Current State:** 159 source files, Atomic Design structure, mixed CSS + Tailwind, logic embedded in components

**Target State:** Feature modules, pure UI components, custom hooks for logic, Tailwind-only styling

---

## Phase 1: Foundation Setup

### Task 1.1: Create New Folder Structure

Create the following folders:

```
src/
├── app/
├── features/
│   ├── hotels/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── pages/
│   ├── tours/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── pages/
│   ├── attractions/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── pages/
│   ├── visa/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── pages/
│   ├── chat/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── pages/
│   ├── itinerary/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── pages/
│   └── trip-assistant/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── store/
│       ├── types/
│       └── pages/
├── shared/
│   ├── components/
│   │   ├── ui/
│   │   └── layout/
│   ├── hooks/
│   └── utils/
└── styles/
```

**Commands to run:**
```bash
mkdir -p src/app
mkdir -p src/features/hotels/{components,hooks,services,store,types,pages}
mkdir -p src/features/tours/{components,hooks,services,store,types,pages}
mkdir -p src/features/attractions/{components,hooks,services,store,types,pages}
mkdir -p src/features/visa/{components,hooks,services,store,types,pages}
mkdir -p src/features/chat/{components,hooks,services,store,types,pages}
mkdir -p src/features/itinerary/{components,hooks,services,store,types,pages}
mkdir -p src/features/trip-assistant/{components,hooks,services,store,types,pages}
mkdir -p src/shared/components/ui
mkdir -p src/shared/components/layout
mkdir -p src/shared/hooks
mkdir -p src/shared/utils
mkdir -p src/styles
```

---

### Task 1.2: Create globals.css with CSS Variables Only

Create `src/styles/globals.css`:

```css
@import "tailwindcss";

/* ===== DESIGN TOKENS ===== */
:root {
  /* Primary Colors - Lagoon Teal */
  --color-primary: #0B7C7A;
  --color-primary-hover: #086462;
  --color-primary-light: #CFF4F2;
  --color-primary-subtle: #EFFBFA;

  /* Secondary Colors - Deep Sea Blue */
  --color-secondary: #118AB2;
  --color-secondary-hover: #0C6E8F;
  --color-secondary-light: #D9F0FA;

  /* Accent Colors - Coral */
  --color-accent: #FF7A59;
  --color-accent-hover: #F25F3A;
  --color-accent-light: #FFF1EB;

  /* Status Colors */
  --color-success: #10B981;
  --color-success-light: #D1FAE5;
  --color-warning: #F59E0B;
  --color-warning-light: #FEF3C7;
  --color-error: #EF4444;
  --color-error-light: #FEE2E2;

  /* Background Colors */
  --color-bg-primary: #F6F7FB;
  --color-bg-secondary: #FFFFFF;
  --color-bg-tertiary: #EEF2F6;

  /* Text Colors */
  --color-text-primary: #0F172A;
  --color-text-secondary: #334155;
  --color-text-muted: #64748B;
  --color-text-light: #94A3B8;

  /* Border Colors */
  --color-border: #E1E8F0;
  --color-border-light: #F0F4F8;
  --color-border-focus: #0B7C7A;

  /* Shadows */
  --shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 16px -4px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 32px -8px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 24px 48px -12px rgba(0, 0, 0, 0.12);

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;

  /* Spacing */
  --spacing-page: 16px;
  --spacing-page-lg: 20px;

  /* Safe Areas */
  --safe-area-top: env(safe-area-inset-top, 0px);
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
}

/* ===== BASE STYLES ===== */
* {
  box-sizing: border-box;
}

html {
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: 'Sora', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== GOOGLE FONTS ===== */
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

/* ===== SCROLLBAR STYLING ===== */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}
```

---

### Task 1.3: Create Shared UI Components

#### 1.3.1: Create Button Component

Create `src/shared/components/ui/Button.tsx`:

```tsx
import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `bg-[var(--color-primary)] text-white
            hover:bg-[var(--color-primary-hover)]
            active:bg-[var(--color-primary-hover)]`,
  secondary: `bg-gray-100 text-gray-900
              hover:bg-gray-200
              active:bg-gray-300`,
  ghost: `bg-transparent text-gray-600
          hover:bg-gray-100
          active:bg-gray-200`,
  danger: `bg-[var(--color-error)] text-white
           hover:bg-red-600
           active:bg-red-700`,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center
          font-semibold rounded-xl
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
```

#### 1.3.2: Create IconButton Component

Create `src/shared/components/ui/IconButton.tsx`:

```tsx
import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

type IconButtonVariant = 'solid' | 'ghost' | 'outline';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  'aria-label': string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  solid: `bg-gray-100 text-gray-700
          hover:bg-gray-200
          active:bg-gray-300`,
  ghost: `bg-transparent text-gray-600
          hover:bg-gray-100
          active:bg-gray-200`,
  outline: `bg-transparent text-gray-600
            border border-gray-200
            hover:bg-gray-50
            active:bg-gray-100`,
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizes: Record<IconButtonSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'solid',
      size = 'md',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center
          rounded-full
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {icon}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';
```

#### 1.3.3: Create Card Component

Create `src/shared/components/ui/Card.tsx`:

```tsx
import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const variantStyles = {
  elevated: 'bg-white shadow-[var(--shadow-md)]',
  outlined: 'bg-white border border-[var(--color-border)]',
  flat: 'bg-[var(--color-bg-tertiary)]',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      padding = 'md',
      hoverable = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -2, boxShadow: 'var(--shadow-lg)' } : undefined}
        whileTap={hoverable ? { scale: 0.99 } : undefined}
        className={`
          rounded-2xl overflow-hidden
          transition-shadow duration-200
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hoverable ? 'cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
```

#### 1.3.4: Create Badge Component

Create `src/shared/components/ui/Badge.tsx`:

```tsx
import { type ReactNode } from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ai';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
  secondary: 'bg-gray-100 text-gray-700',
  success: 'bg-[var(--color-success-light)] text-green-700',
  warning: 'bg-[var(--color-warning-light)] text-amber-700',
  error: 'bg-[var(--color-error-light)] text-red-700',
  ai: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  icon,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        font-semibold rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
```

#### 1.3.5: Create Chip Component (Removable Filter Chip)

Create `src/shared/components/ui/Chip.tsx`:

```tsx
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'primary';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onRemove,
  variant = 'default',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5 rounded-full
        text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0.5 rounded-full hover:bg-black/10 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X size={12} />
        </button>
      )}
    </motion.span>
  );
};
```

#### 1.3.6: Create Modal Component (Bottom Sheet on Mobile, Modal on Desktop)

Create `src/shared/components/ui/Modal.tsx`:

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { IconButton } from './IconButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const sizeStyles = {
  sm: 'max-h-[50vh]',
  md: 'max-h-[70vh]',
  lg: 'max-h-[85vh]',
  full: 'max-h-[95vh]',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Bottom Sheet (Mobile) / Modal (Desktop) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`
              fixed bottom-0 left-0 right-0 z-50
              bg-white rounded-t-3xl
              ${sizeStyles[size]}
              overflow-hidden
              flex flex-col
              lg:bottom-auto lg:top-1/2 lg:left-1/2
              lg:-translate-x-1/2 lg:-translate-y-1/2
              lg:rounded-2xl lg:max-w-lg lg:w-full
            `}
          >
            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-3 pb-2 lg:hidden">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <IconButton
                  icon={<X size={20} />}
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  aria-label="Close modal"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

#### 1.3.7: Create Input Component

Create `src/shared/components/ui/Input.tsx`:

```tsx
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3
              bg-gray-50 border border-gray-200 rounded-xl
              text-gray-900 placeholder:text-gray-400
              transition-all duration-200
              focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

#### 1.3.8: Create Skeleton Component

Create `src/shared/components/ui/Skeleton.tsx`:

```tsx
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
}) => {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl h-48',
  };

  return (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${variantStyles[variant]}
        ${className}
      `}
      style={{ width, height }}
    />
  );
};

// Pre-built skeleton for cards
export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
    <Skeleton variant="rectangular" className="h-40 rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" className="w-16 h-6" />
        <Skeleton variant="rectangular" className="w-16 h-6" />
      </div>
    </div>
  </div>
);
```

#### 1.3.9: Create UI Components Index

Create `src/shared/components/ui/index.ts`:

```tsx
export { Button } from './Button';
export { IconButton } from './IconButton';
export { Card } from './Card';
export { Badge } from './Badge';
export { Chip } from './Chip';
export { Modal } from './Modal';
export { Input } from './Input';
export { Skeleton, SkeletonCard } from './Skeleton';
```

---

### Task 1.4: Create Shared Hooks

#### 1.4.1: Create useDisclosure Hook

Create `src/shared/hooks/useDisclosure.ts`:

```tsx
import { useState, useCallback } from 'react';

interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: (value: boolean) => void;
}

export const useDisclosure = (initialState = false): UseDisclosureReturn => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle, setIsOpen };
};
```

#### 1.4.2: Create useDebounce Hook

Create `src/shared/hooks/useDebounce.ts`:

```tsx
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

#### 1.4.3: Create useInfiniteScroll Hook

Create `src/shared/hooks/useInfiniteScroll.ts`:

```tsx
import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 0.1,
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore();
          }
        },
        { threshold }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasMore, onLoadMore, threshold]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef };
};
```

#### 1.4.4: Create usePullToRefresh Hook

Create `src/shared/hooks/usePullToRefresh.ts`:

```tsx
import { useState, useRef, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 100,
}: UsePullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchEnd = useCallback(
    async (e: React.TouchEvent) => {
      const diff = e.changedTouches[0].clientY - touchStartY.current;
      if (
        diff > threshold &&
        containerRef.current &&
        containerRef.current.scrollTop === 0
      ) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
    },
    [onRefresh, threshold]
  );

  return {
    containerRef,
    isRefreshing,
    pullToRefreshProps: {
      ref: containerRef,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  };
};
```

#### 1.4.5: Create useMediaQuery Hook

Create `src/shared/hooks/useMediaQuery.ts`:

```tsx
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

// Convenience hooks
export const useIsMobile = () => useMediaQuery('(max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
```

#### 1.4.6: Create Hooks Index

Create `src/shared/hooks/index.ts`:

```tsx
export { useDisclosure } from './useDisclosure';
export { useDebounce } from './useDebounce';
export { useInfiniteScroll } from './useInfiniteScroll';
export { usePullToRefresh } from './usePullToRefresh';
export { useMediaQuery, useIsMobile, useIsDesktop } from './useMediaQuery';
```

---

### Task 1.5: Create Layout Components

#### 1.5.1: Create AppShell Component

Create `src/shared/components/layout/AppShell.tsx`:

```tsx
import { type ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-[var(--color-bg-primary)] ${className}`}>
      {/* Centered container: full width on mobile, max-width on desktop */}
      <div className="mx-auto max-w-full lg:max-w-md xl:max-w-lg">
        {children}
      </div>
    </div>
  );
};
```

#### 1.5.2: Create BottomNav Component

Create `src/shared/components/layout/BottomNav.tsx`:

```tsx
import { motion } from 'framer-motion';
import { Home, Compass, Hotel, Map, Bot } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

const tabs: Tab[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'planner', label: 'Planner', icon: Map },
  { id: 'bot', label: 'AI', icon: Bot },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-30
        bg-white border-t border-gray-100
        pb-[var(--safe-area-bottom)]
        lg:left-1/2 lg:-translate-x-1/2 lg:max-w-md lg:rounded-t-2xl lg:border-x
      "
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-full"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={isActive ? 'text-[var(--color-primary)]' : 'text-gray-400'}
                />
              </motion.div>
              <span
                className={`
                  text-[10px] mt-1 font-medium
                  ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-400'}
                `}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 w-8 h-0.5 bg-[var(--color-primary)] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
```

#### 1.5.3: Create Layout Index

Create `src/shared/components/layout/index.ts`:

```tsx
export { AppShell } from './AppShell';
export { BottomNav } from './BottomNav';
```

---

## Phase 2: Hotels Feature Refactor (Template for All Features)

### Task 2.1: Create Hotel Types

Create `src/features/hotels/types/hotel.types.ts`:

```tsx
export interface Hotel {
  id: string;
  name: string;
  location: string;
  landmark: string;
  distance: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  amenities: string[];
  badges: string[];
  isAIRecommended: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type SortOption =
  | 'recommended'
  | 'price_low'
  | 'price_high'
  | 'rating'
  | 'reviews'
  | 'distance';

export interface HotelFilters {
  priceRange: [number, number];
  minRating: number;
  amenities: string[];
  badges: string[];
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}
```

### Task 2.2: Create Hotel Store (State Only, No Business Logic)

Create `src/features/hotels/store/hotelStore.ts`:

```tsx
import { create } from 'zustand';
import type { Hotel, HotelFilters, SortOption, HotelSearchParams } from '../types/hotel.types';

interface HotelState {
  // Data
  hotels: Hotel[];

  // Search
  searchParams: HotelSearchParams;
  searchQuery: string;

  // Filters
  filters: HotelFilters;
  sortBy: SortOption;

  // UI State
  viewMode: 'list' | 'map';
  wishlist: Set<string>;

  // Loading State
  page: number;
  pageSize: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

interface HotelActions {
  // Data Actions
  setHotels: (hotels: Hotel[]) => void;
  appendHotels: (hotels: Hotel[]) => void;

  // Search Actions
  setSearchParams: (params: Partial<HotelSearchParams>) => void;
  setSearchQuery: (query: string) => void;

  // Filter Actions
  setFilters: (filters: Partial<HotelFilters>) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;

  // UI Actions
  setViewMode: (mode: 'list' | 'map') => void;
  toggleWishlist: (id: string) => void;

  // Loading Actions
  setPage: (page: number) => void;
  setIsLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setError: (error: string | null) => void;
}

const DEFAULT_FILTERS: HotelFilters = {
  priceRange: [0, 1000],
  minRating: 0,
  amenities: [],
  badges: [],
};

const DEFAULT_SEARCH_PARAMS: HotelSearchParams = {
  destination: '',
  checkIn: '',
  checkOut: '',
  guests: 2,
};

export const useHotelStore = create<HotelState & HotelActions>((set) => ({
  // Initial State
  hotels: [],
  searchParams: DEFAULT_SEARCH_PARAMS,
  searchQuery: '',
  filters: DEFAULT_FILTERS,
  sortBy: 'recommended',
  viewMode: 'list',
  wishlist: new Set(),
  page: 1,
  pageSize: 10,
  isLoading: false,
  hasMore: true,
  error: null,

  // Data Actions
  setHotels: (hotels) => set({ hotels, page: 1 }),
  appendHotels: (hotels) => set((state) => ({
    hotels: [...state.hotels, ...hotels]
  })),

  // Search Actions
  setSearchParams: (params) => set((state) => ({
    searchParams: { ...state.searchParams, ...params },
    page: 1,
  })),
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),

  // Filter Actions
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    page: 1,
  })),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  resetFilters: () => set({
    filters: DEFAULT_FILTERS,
    sortBy: 'recommended',
    page: 1
  }),

  // UI Actions
  setViewMode: (viewMode) => set({ viewMode }),
  toggleWishlist: (id) => set((state) => {
    const next = new Set(state.wishlist);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return { wishlist: next };
  }),

  // Loading Actions
  setPage: (page) => set({ page }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setHasMore: (hasMore) => set({ hasMore }),
  setError: (error) => set({ error }),
}));
```

### Task 2.3: Create Hotel Service (Business Logic)

Create `src/features/hotels/services/hotelService.ts`:

```tsx
import type { Hotel, HotelFilters, SortOption } from '../types/hotel.types';

// Import mock data (will be replaced with API calls)
import { mockHotels } from '../../../data/hotelListingData';

export const hotelService = {
  /**
   * Filter hotels based on criteria
   */
  filterHotels(
    hotels: Hotel[],
    filters: HotelFilters,
    searchQuery: string
  ): Hotel[] {
    let results = [...hotels];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.landmark.toLowerCase().includes(q)
      );
    }

    // Price range filter
    results = results.filter(
      (h) => h.price >= filters.priceRange[0] && h.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.minRating > 0) {
      results = results.filter((h) => h.rating >= filters.minRating);
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      results = results.filter((h) =>
        filters.amenities.every((a) => h.amenities.includes(a))
      );
    }

    // Badges filter
    if (filters.badges.length > 0) {
      results = results.filter((h) =>
        filters.badges.some((b) => h.badges.includes(b))
      );
    }

    return results;
  },

  /**
   * Sort hotels
   */
  sortHotels(hotels: Hotel[], sortBy: SortOption): Hotel[] {
    const sorted = [...hotels];

    switch (sortBy) {
      case 'price_low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'distance':
        sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'recommended':
      default:
        sorted.sort((a, b) => (b.isAIRecommended ? 1 : 0) - (a.isAIRecommended ? 1 : 0));
        break;
    }

    return sorted;
  },

  /**
   * Paginate hotels
   */
  paginateHotels(hotels: Hotel[], page: number, pageSize: number): Hotel[] {
    return hotels.slice(0, page * pageSize);
  },

  /**
   * Calculate active filter count
   */
  getActiveFilterCount(filters: HotelFilters, sortBy: SortOption): number {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.minRating > 0) count++;
    count += filters.amenities.length;
    count += filters.badges.length;
    if (sortBy !== 'recommended') count++;
    return count;
  },

  /**
   * Build active filter chips
   */
  buildActiveChips(
    filters: HotelFilters,
    sortBy: SortOption,
    onRemoveFilter: (type: string, value?: string) => void
  ): Array<{ label: string; onRemove: () => void }> {
    const chips: Array<{ label: string; onRemove: () => void }> = [];

    if (sortBy !== 'recommended') {
      chips.push({
        label: `Sort: ${sortBy.replace('_', ' ')}`,
        onRemove: () => onRemoveFilter('sort'),
      });
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      chips.push({
        label: `$${filters.priceRange[0]}–$${filters.priceRange[1]}${filters.priceRange[1] >= 1000 ? '+' : ''}`,
        onRemove: () => onRemoveFilter('priceRange'),
      });
    }

    if (filters.minRating > 0) {
      chips.push({
        label: `${filters.minRating}+ Stars`,
        onRemove: () => onRemoveFilter('rating'),
      });
    }

    filters.amenities.forEach((amenity) => {
      chips.push({
        label: amenity,
        onRemove: () => onRemoveFilter('amenity', amenity),
      });
    });

    return chips;
  },

  /**
   * Fetch hotels (mock implementation - replace with real API)
   */
  async fetchHotels(): Promise<Hotel[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockHotels as Hotel[];
  },
};
```

### Task 2.4: Create Hotel Hooks

#### 2.4.1: Create useHotelList Hook

Create `src/features/hotels/hooks/useHotelList.ts`:

```tsx
import { useMemo, useCallback } from 'react';
import { useHotelStore } from '../store/hotelStore';
import { hotelService } from '../services/hotelService';

export const useHotelList = () => {
  const {
    hotels,
    filters,
    sortBy,
    searchQuery,
    page,
    pageSize,
    isLoading,
    hasMore,
    error,
    setPage,
    setIsLoading,
    setHasMore,
  } = useHotelStore();

  // Filtered hotels (memoized)
  const filteredHotels = useMemo(() => {
    const filtered = hotelService.filterHotels(hotels, filters, searchQuery);
    return hotelService.sortHotels(filtered, sortBy);
  }, [hotels, filters, searchQuery, sortBy]);

  // Displayed hotels (paginated)
  const displayedHotels = useMemo(() => {
    return hotelService.paginateHotels(filteredHotels, page, pageSize);
  }, [filteredHotels, page, pageSize]);

  // Load more
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate async loading
    setTimeout(() => {
      const nextPage = page + 1;
      const hasMoreItems = nextPage * pageSize < filteredHotels.length;

      setPage(nextPage);
      setHasMore(hasMoreItems);
      setIsLoading(false);
    }, 500);
  }, [isLoading, hasMore, page, pageSize, filteredHotels.length, setIsLoading, setPage, setHasMore]);

  return {
    hotels: displayedHotels,
    totalCount: filteredHotels.length,
    isLoading,
    hasMore,
    error,
    loadMore,
  };
};
```

#### 2.4.2: Create useHotelFilters Hook

Create `src/features/hotels/hooks/useHotelFilters.ts`:

```tsx
import { useMemo, useCallback } from 'react';
import { useHotelStore } from '../store/hotelStore';
import { hotelService } from '../services/hotelService';

export const useHotelFilters = () => {
  const {
    filters,
    sortBy,
    setFilters,
    setSortBy,
    resetFilters,
  } = useHotelStore();

  // Active filter count
  const activeFilterCount = useMemo(() => {
    return hotelService.getActiveFilterCount(filters, sortBy);
  }, [filters, sortBy]);

  // Handle filter removal
  const removeFilter = useCallback((type: string, value?: string) => {
    switch (type) {
      case 'sort':
        setSortBy('recommended');
        break;
      case 'priceRange':
        setFilters({ priceRange: [0, 1000] });
        break;
      case 'rating':
        setFilters({ minRating: 0 });
        break;
      case 'amenity':
        if (value) {
          setFilters({
            amenities: filters.amenities.filter((a) => a !== value),
          });
        }
        break;
    }
  }, [filters.amenities, setFilters, setSortBy]);

  // Active filter chips
  const activeChips = useMemo(() => {
    return hotelService.buildActiveChips(filters, sortBy, removeFilter);
  }, [filters, sortBy, removeFilter]);

  return {
    filters,
    sortBy,
    activeFilterCount,
    activeChips,
    setFilters,
    setSortBy,
    resetFilters,
    removeFilter,
  };
};
```

#### 2.4.3: Create useHotelWishlist Hook

Create `src/features/hotels/hooks/useHotelWishlist.ts`:

```tsx
import { useCallback } from 'react';
import { useHotelStore } from '../store/hotelStore';

export const useHotelWishlist = () => {
  const { wishlist, toggleWishlist } = useHotelStore();

  const isWishlisted = useCallback(
    (hotelId: string) => wishlist.has(hotelId),
    [wishlist]
  );

  return {
    wishlist,
    isWishlisted,
    toggleWishlist,
  };
};
```

#### 2.4.4: Create Hooks Index

Create `src/features/hotels/hooks/index.ts`:

```tsx
export { useHotelList } from './useHotelList';
export { useHotelFilters } from './useHotelFilters';
export { useHotelWishlist } from './useHotelWishlist';
```

### Task 2.5: Create Hotel Components (Pure UI)

#### 2.5.1: Create HotelCard Component

Create `src/features/hotels/components/HotelCard.tsx`:

```tsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Star, MapPin, Wifi, UtensilsCrossed, Waves, Car,
  Sparkles, ChevronRight, Bot, Navigation,
} from 'lucide-react';
import { Badge } from '../../../shared/components/ui';
import type { Hotel } from '../types/hotel.types';

interface HotelCardProps {
  hotel: Hotel;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onViewDetails?: (id: string) => void;
  index?: number;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'wifi': <Wifi size={12} />,
  'pool': <Waves size={12} />,
  'spa': <Sparkles size={12} />,
  'breakfast': <UtensilsCrossed size={12} />,
  'parking': <Car size={12} />,
};

const getAmenityIcon = (amenity: string) => {
  const lower = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(amenityIcons)) {
    if (lower.includes(key)) return icon;
  }
  return null;
};

export const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  isWishlisted,
  onToggleWishlist,
  onViewDetails,
  index = 0,
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImage < hotel.images.length - 1) {
        setCurrentImage((p) => p + 1);
      } else if (diff < 0 && currentImage > 0) {
        setCurrentImage((p) => p - 1);
      }
    }
  };

  const discount = hotel.originalPrice
    ? Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onViewDetails?.(hotel.id)}
      className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-md)] cursor-pointer"
    >
      {/* Image Carousel */}
      <div
        className="relative h-44 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={hotel.images[currentImage]}
            alt={hotel.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {hotel.isAIRecommended && (
            <Badge variant="ai" icon={<Bot size={10} />}>
              AI Pick
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="error">-{discount}%</Badge>
          )}
        </div>

        {/* Wishlist button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(hotel.id);
          }}
          className={`
            absolute top-3 right-3 w-9 h-9 rounded-full
            flex items-center justify-center
            backdrop-blur-md shadow-lg transition-all
            ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-600 hover:text-rose-500'}
          `}
        >
          <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </motion.button>

        {/* Carousel dots */}
        {hotel.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {hotel.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentImage(i); }}
                className={`
                  rounded-full transition-all
                  ${i === currentImage ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}
                `}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-bold text-gray-900 leading-tight line-clamp-1">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="font-bold text-sm text-gray-800">{hotel.rating}</span>
            <span className="text-[11px] text-gray-400">({hotel.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin size={13} className="text-[var(--color-primary)] flex-shrink-0" />
          <span className="text-xs text-gray-500 font-medium truncate">{hotel.location}</span>
          <span className="text-gray-300">•</span>
          <Navigation size={11} className="text-gray-400 flex-shrink-0" />
          <span className="text-[11px] text-gray-400">{hotel.distance}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {hotel.amenities.slice(0, 4).map((amenity, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg text-[11px] text-gray-600 font-medium"
            >
              <span className="text-[var(--color-primary)]">{getAmenityIcon(amenity)}</span>
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="text-[11px] text-gray-400 font-medium flex items-center">
              +{hotel.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3" />

        {/* Price + CTA */}
        <div className="flex items-end justify-between">
          <div>
            {hotel.originalPrice && (
              <span className="text-xs text-gray-400 line-through mr-1.5">
                {hotel.currency}{hotel.originalPrice}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                {hotel.currency}{hotel.price}
              </span>
              <span className="text-xs text-gray-400 font-medium">/ night</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={(e) => { e.stopPropagation(); onViewDetails?.(hotel.id); }}
            className="
              flex items-center gap-1 px-4 py-2
              bg-[var(--color-primary)] text-white
              text-sm font-semibold rounded-xl
              hover:bg-[var(--color-primary-hover)] transition-colors
            "
          >
            View Details
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
```

#### 2.5.2: Create HotelList Component

Create `src/features/hotels/components/HotelList.tsx`:

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, RefreshCw, WifiOff } from 'lucide-react';
import { useInfiniteScroll } from '../../../shared/hooks';
import { Button, SkeletonCard } from '../../../shared/components/ui';
import { HotelCard } from './HotelCard';
import type { Hotel } from '../types/hotel.types';

interface HotelListProps {
  hotels: Hotel[];
  totalCount: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  isWishlisted: (id: string) => boolean;
  onToggleWishlist: (id: string) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  onResetFilters: () => void;
  onViewDetails?: (id: string) => void;
}

export const HotelList: React.FC<HotelListProps> = ({
  hotels,
  totalCount,
  isLoading,
  hasMore,
  error,
  isWishlisted,
  onToggleWishlist,
  onLoadMore,
  onRefresh,
  onResetFilters,
  onViewDetails,
}) => {
  const { lastElementRef } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading,
  });

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <WifiOff size={48} className="text-gray-300" />
        <h3 className="text-base font-bold text-gray-700 mt-3">Something went wrong</h3>
        <p className="text-sm text-gray-400 mt-1">{error}</p>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw size={14} />}
          onClick={onRefresh}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!isLoading && hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Building2 size={56} className="text-gray-200" />
        <h3 className="text-base font-bold text-gray-700 mt-3">No hotels found</h3>
        <p className="text-sm text-gray-400 mt-1 text-center px-8">
          Try adjusting your filters or searching for a different destination.
        </p>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw size={14} />}
          onClick={onResetFilters}
          className="mt-4"
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="px-1">
        <span className="text-xs font-semibold text-gray-400">
          {totalCount} hotel{totalCount !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Hotel cards */}
      {hotels.map((hotel, index) => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          index={index}
          isWishlisted={isWishlisted(hotel.id)}
          onToggleWishlist={onToggleWishlist}
          onViewDetails={onViewDetails}
        />
      ))}

      {/* Loading skeletons */}
      {hasMore && (
        <div ref={lastElementRef} className="space-y-4">
          {isLoading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}
        </div>
      )}

      {/* End of list */}
      {!hasMore && hotels.length > 0 && (
        <p className="text-center text-xs text-gray-400 py-6">
          You've seen all {totalCount} hotels
        </p>
      )}
    </div>
  );
};
```

#### 2.5.3: Create HotelFilterBar Component

Create `src/features/hotels/components/HotelFilterBar.tsx`:

```tsx
import { motion } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, List, Map } from 'lucide-react';
import { IconButton } from '../../../shared/components/ui';

interface HotelFilterBarProps {
  viewMode: 'list' | 'map';
  activeFilterCount: number;
  onOpenFilters: () => void;
  onOpenSort: () => void;
  onToggleView: () => void;
}

export const HotelFilterBar: React.FC<HotelFilterBarProps> = ({
  viewMode,
  activeFilterCount,
  onOpenFilters,
  onOpenSort,
  onToggleView,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2">
        {/* Filter button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenFilters}
          className="
            flex items-center gap-2 px-3.5 py-2
            bg-gray-50 rounded-xl text-sm font-medium text-gray-700
            hover:bg-gray-100 transition-colors relative
          "
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="
              absolute -top-1.5 -right-1.5 w-5 h-5
              bg-[var(--color-primary)] text-white
              text-[10px] font-bold rounded-full
              flex items-center justify-center
            ">
              {activeFilterCount}
            </span>
          )}
        </motion.button>

        {/* Sort button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSort}
          className="
            flex items-center gap-2 px-3.5 py-2
            bg-gray-50 rounded-xl text-sm font-medium text-gray-700
            hover:bg-gray-100 transition-colors
          "
        >
          <ArrowUpDown size={16} />
          Sort
        </motion.button>
      </div>

      {/* View toggle */}
      <IconButton
        icon={viewMode === 'list' ? <Map size={18} /> : <List size={18} />}
        variant="outline"
        size="sm"
        onClick={onToggleView}
        aria-label={viewMode === 'list' ? 'Switch to map view' : 'Switch to list view'}
      />
    </div>
  );
};
```

#### 2.5.4: Create HotelActiveFilters Component

Create `src/features/hotels/components/HotelActiveFilters.tsx`:

```tsx
import { AnimatePresence } from 'framer-motion';
import { Chip } from '../../../shared/components/ui';

interface ActiveChip {
  label: string;
  onRemove: () => void;
}

interface HotelActiveFiltersProps {
  chips: ActiveChip[];
}

export const HotelActiveFilters: React.FC<HotelActiveFiltersProps> = ({ chips }) => {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      <AnimatePresence>
        {chips.map((chip, i) => (
          <Chip
            key={`${chip.label}-${i}`}
            label={chip.label}
            onRemove={chip.onRemove}
            variant="primary"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
```

#### 2.5.5: Create Components Index

Create `src/features/hotels/components/index.ts`:

```tsx
export { HotelCard } from './HotelCard';
export { HotelList } from './HotelList';
export { HotelFilterBar } from './HotelFilterBar';
export { HotelActiveFilters } from './HotelActiveFilters';
```

### Task 2.6: Create Hotel Page (Thin Wrapper)

Create `src/features/hotels/pages/HotelListingPage.tsx`:

```tsx
import { useDisclosure } from '../../../shared/hooks';
import { AppShell } from '../../../shared/components/layout';
import { Modal } from '../../../shared/components/ui';
import { useHotelList, useHotelFilters, useHotelWishlist } from '../hooks';
import { useHotelStore } from '../store/hotelStore';
import {
  HotelList,
  HotelFilterBar,
  HotelActiveFilters,
} from '../components';

export const HotelListingPage: React.FC = () => {
  // Hooks for logic
  const { hotels, totalCount, isLoading, hasMore, error, loadMore } = useHotelList();
  const { activeChips, activeFilterCount, resetFilters } = useHotelFilters();
  const { isWishlisted, toggleWishlist } = useHotelWishlist();

  // UI state
  const filterSheet = useDisclosure();
  const sortSheet = useDisclosure();
  const { viewMode, setViewMode } = useHotelStore();

  const handleRefresh = () => {
    // Refresh logic
  };

  const handleViewDetails = (id: string) => {
    // Navigate to hotel details
    console.log('View details:', id);
  };

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-20">
        {/* Filter Bar */}
        <HotelFilterBar
          viewMode={viewMode}
          activeFilterCount={activeFilterCount}
          onOpenFilters={filterSheet.open}
          onOpenSort={sortSheet.open}
          onToggleView={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
        />

        {/* Active Filter Chips */}
        <HotelActiveFilters chips={activeChips} />

        {/* Main Content */}
        <div className="flex-1 px-4 py-3">
          {viewMode === 'list' ? (
            <HotelList
              hotels={hotels}
              totalCount={totalCount}
              isLoading={isLoading}
              hasMore={hasMore}
              error={error}
              isWishlisted={isWishlisted}
              onToggleWishlist={toggleWishlist}
              onLoadMore={loadMore}
              onRefresh={handleRefresh}
              onResetFilters={resetFilters}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <div>Map View (TODO)</div>
          )}
        </div>

        {/* Filter Modal */}
        <Modal
          isOpen={filterSheet.isOpen}
          onClose={filterSheet.close}
          title="Filters"
          size="lg"
        >
          {/* Filter content here */}
          <div>Filter content TODO</div>
        </Modal>

        {/* Sort Modal */}
        <Modal
          isOpen={sortSheet.isOpen}
          onClose={sortSheet.close}
          title="Sort By"
          size="sm"
        >
          {/* Sort options here */}
          <div>Sort options TODO</div>
        </Modal>
      </div>
    </AppShell>
  );
};

export default HotelListingPage;
```

### Task 2.7: Create Feature Index

Create `src/features/hotels/index.ts`:

```tsx
// Pages
export { HotelListingPage } from './pages/HotelListingPage';

// Components (for use in other features if needed)
export { HotelCard, HotelList } from './components';

// Hooks (for external use)
export { useHotelList, useHotelFilters, useHotelWishlist } from './hooks';

// Types
export type { Hotel, HotelFilters, SortOption } from './types/hotel.types';
```

---

## Phase 3: Remaining Features

Repeat the Phase 2 pattern for each feature:

### 3.1: Tours Feature
- Copy hotels structure to `src/features/tours/`
- Move `useTourStore.ts` → `src/features/tours/store/tourStore.ts`
- Move tour components → `src/features/tours/components/`
- Create hooks: `useTourList`, `useTourFilters`
- Convert all CSS classes to Tailwind

### 3.2: Attractions Feature
- Copy hotels structure to `src/features/attractions/`
- Move `useAttractionStore.ts` → `src/features/attractions/store/`
- Move discovery components → `src/features/attractions/components/`
- Create hooks: `useAttractionSearch`, `useAttractionFilters`

### 3.3: Visa Feature
- Copy hotels structure to `src/features/visa/`
- Move visa components → `src/features/visa/components/`
- Create hooks: `useVisaChecker`, `useVisaExplorer`

### 3.4: Chat Feature
- Copy hotels structure to `src/features/chat/`
- Move chat components → `src/features/chat/components/`
- Move chat cards → `src/features/chat/components/cards/`
- Create hooks: `useChatMessages`, `useChatInput`

### 3.5: Itinerary Feature
- Copy hotels structure to `src/features/itinerary/`
- Move `useItineraryEditorStore.ts` → `src/features/itinerary/store/`
- Move itinerary-editor components → `src/features/itinerary/components/`
- Create hooks: `useItineraryEditor`, `useItineraryDrag`

### 3.6: Trip Assistant Feature
- Already exists at `src/features/trip-assistant/`
- Refactor to match new pattern
- Create hooks: `useBudgetTracker`, `usePackingList`

---

## Phase 4: Update App Entry Points

### Task 4.1: Create App Providers

Create `src/app/providers.tsx`:

```tsx
import { BrowserRouter } from 'react-router-dom';
import { MapProvider } from '../store/MapContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <MapProvider>
        {children}
      </MapProvider>
    </BrowserRouter>
  );
};
```

### Task 4.2: Create Routes Configuration

Create `src/app/routes.tsx`:

```tsx
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { SkeletonCard } from '../shared/components/ui';

// Lazy load pages
const HotelListingPage = lazy(() => import('../features/hotels/pages/HotelListingPage'));
const ToursListingPage = lazy(() => import('../features/tours/pages/ToursListingPage'));
// ... add other pages

const PageLoader = () => (
  <div className="p-4 space-y-4">
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/hotels" element={<HotelListingPage />} />
        <Route path="/tours" element={<ToursListingPage />} />
        {/* Add other routes */}
      </Routes>
    </Suspense>
  );
};
```

### Task 4.3: Update App.tsx

Update `src/App.tsx`:

```tsx
import { Providers } from './app/providers';
import { AppRoutes } from './app/routes';
import './styles/globals.css';

function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default App;
```

### Task 4.4: Update main.tsx

Update `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## Phase 5: Cleanup

### Task 5.1: Delete Old CSS Files
- Delete `src/index.css` (replaced by `src/styles/globals.css`)
- Delete `src/App.css`
- Delete `src/styles/attraction-detail.css`
- Delete `src/styles/itinerary-editor.css`
- Delete `src/features/trip-assistant/styles/tripAssistant.css`

### Task 5.2: Delete Old Component Folders
After all features are migrated:
- Delete `src/components/atoms/`
- Delete `src/components/molecules/`
- Delete `src/components/organisms/`
- Delete `src/components/blocks/`
- Delete `src/components/chat/`
- Delete `src/components/discovery/`
- Delete `src/components/itinerary-editor/`
- Delete `src/components/layouts/`
- Delete `src/components/renderer/`
- Delete `src/components/visa/`

### Task 5.3: Delete Old Store Files
After stores are moved to features:
- Delete `src/store/useHotelStore.ts`
- Delete `src/store/useTourStore.ts`
- Delete `src/store/useAttractionStore.ts`
- Delete `src/store/useItineraryEditorStore.ts`

### Task 5.4: Delete Old Pages Folder
After pages are moved to features:
- Delete `src/pages/`

### Task 5.5: Update All Imports
Run through all files and update imports to use new paths:
- `@/features/hotels` instead of `../components/...`
- `@/shared/components/ui` instead of `../components/atoms/...`
- `@/shared/hooks` instead of inline hook definitions

---

## Testing Checklist

After each phase, verify:

- [ ] App compiles without errors (`npm run build`)
- [ ] App runs without console errors (`npm run dev`)
- [ ] Mobile UI looks identical to before
- [ ] Desktop UI is centered with max-width
- [ ] All interactive elements work (buttons, filters, navigation)
- [ ] Infinite scroll works
- [ ] Pull-to-refresh works on mobile
- [ ] Animations are smooth

---

## Summary

**Files to create:** ~50 new files
**Files to modify:** ~120 files
**Files to delete:** ~60 files

**Estimated phases:**
1. Foundation: Create shared components, hooks, layout
2. Hotels: Complete refactor as template
3. Other features: Follow hotels pattern
4. App setup: Update entry points
5. Cleanup: Remove old files

**Key principles to follow:**
- Components receive data via props only
- Hooks contain all business logic
- Stores hold state, not logic
- All styling via Tailwind utilities
- No CSS classes except globals.css
- Mobile-first, desktop scales up
