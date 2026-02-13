import type { LucideIcon } from 'lucide-react';
import {
  Car,
  CloudSun,
  Cloudy,
  Hotel,
  Plane,
  ShoppingBag,
  Sun,
  Ticket,
  Umbrella,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import type { BudgetCategory, WeatherType } from '../types/tripAssistant.types';

const budgetIconMap: Record<BudgetCategory['icon'], LucideIcon> = {
  Plane,
  Hotel,
  UtensilsCrossed,
  Car,
  Ticket,
  ShoppingBag,
};

export const getBudgetCategoryIcon = (icon: BudgetCategory['icon']): LucideIcon => budgetIconMap[icon];

export const weatherVisualMap: Record<
  WeatherType,
  { icon: LucideIcon; gradient: string; textClass: string }
> = {
  sunny: {
    icon: Sun,
    gradient: 'from-amber-100/90 to-orange-100/70',
    textClass: 'text-amber-900',
  },
  rainy: {
    icon: Umbrella,
    gradient: 'from-sky-100/90 to-blue-100/70',
    textClass: 'text-sky-900',
  },
  cloudy: {
    icon: Cloudy,
    gradient: 'from-slate-100/95 to-blue-50/80',
    textClass: 'text-slate-800',
  },
  storm: {
    icon: Zap,
    gradient: 'from-indigo-100/90 to-slate-200/80',
    textClass: 'text-indigo-900',
  },
};

export const weatherStripIconMap: Record<WeatherType, LucideIcon> = {
  sunny: Sun,
  rainy: Umbrella,
  cloudy: CloudSun,
  storm: Zap,
};
