export type BudgetCategoryId =
  | 'flights'
  | 'stays'
  | 'food'
  | 'transport'
  | 'activities'
  | 'shopping';

export interface Expense {
  id: string;
  categoryId: BudgetCategoryId;
  amount: number;
  date: string;
  note?: string;
}

export interface BudgetCategory {
  id: BudgetCategoryId;
  label: string;
  allocated: number;
  color: string;
  icon: 'Plane' | 'Hotel' | 'UtensilsCrossed' | 'Car' | 'Ticket' | 'ShoppingBag';
}

export type WeatherType = 'sunny' | 'rainy' | 'cloudy' | 'storm';

export interface WeatherDay {
  id: string;
  dayLabel: string;
  dateISO: string;
  type: WeatherType;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  windKph: number;
  sunrise: string;
  feelsLike: number;
  rainChance: number;
}

export type PackingCategoryId = 'essentials' | 'clothing' | 'gadgets' | 'documents' | 'health';

export interface PackingItem {
  id: string;
  label: string;
  categoryId: PackingCategoryId;
  checked: boolean;
  suggestedByWeather?: boolean;
}

export interface PackingCategory {
  id: PackingCategoryId;
  label: string;
}
