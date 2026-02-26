import { create } from 'zustand';
import type {
  BudgetCategory,
  BudgetCategoryId,
  Expense,
  PackingCategory,
  PackingCategoryId,
  PackingItem,
  WeatherDay,
} from '../types/tripAssistant.types';
import { getTripsByUser, updateTrip } from '../../../api/itineraryEditorApi';
import type { EditableTrip } from '../../../types/itinerary-editor';

interface AddExpensePayload {
  categoryId: BudgetCategoryId;
  amount: number;
  date: string;
  note?: string;
}

interface AddPackingItemPayload {
  label: string;
  categoryId: PackingCategoryId;
}

interface TripAssistantState {
  trips: EditableTrip[];
  activeTripId: string | null;
  isLoadingTrips: boolean;
  fetchTrips: (userId: string) => Promise<void>;
  selectTrip: (tripId: string) => void;

  totalBudget: number;
  budgetCategories: BudgetCategory[];
  expenses: Expense[];
  expandedBudgetCategories: Record<BudgetCategoryId, boolean>;
  weatherDays: WeatherDay[];
  selectedWeatherDayId: string;
  packingCategories: PackingCategory[];
  packingItems: PackingItem[];
  expandedPackingCategories: Record<PackingCategoryId, boolean>;
  addExpense: (payload: AddExpensePayload) => void;
  toggleBudgetCategory: (categoryId: BudgetCategoryId) => void;
  selectWeatherDay: (dayId: string) => void;
  togglePackingCategory: (categoryId: PackingCategoryId) => void;
  togglePackingItem: (itemId: string) => void;
  addPackingItem: (payload: AddPackingItemPayload) => void;
  addWeatherSuggestionsToPacking: () => void;
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const budgetCategories: BudgetCategory[] = [
  { id: 'flights', label: 'Flights', allocated: 42000, color: '#4F46E5', icon: 'Plane' },
  { id: 'stays', label: 'Stay', allocated: 28000, color: '#0EA5A4', icon: 'Hotel' },
  { id: 'food', label: 'Food', allocated: 12000, color: '#F59E0B', icon: 'UtensilsCrossed' },
  { id: 'transport', label: 'Transport', allocated: 9000, color: '#3B82F6', icon: 'Car' },
  { id: 'activities', label: 'Activities', allocated: 11000, color: '#EC4899', icon: 'Ticket' },
  { id: 'shopping', label: 'Shopping', allocated: 8000, color: '#8B5CF6', icon: 'ShoppingBag' },
];



const weatherDays: WeatherDay[] = [
  { id: 'w1', dayLabel: 'Thu', dateISO: '2026-02-12', type: 'sunny', minTemp: 21, maxTemp: 29, humidity: 56, windKph: 8, sunrise: '6:21 AM', feelsLike: 30, rainChance: 6 },
  { id: 'w2', dayLabel: 'Fri', dateISO: '2026-02-13', type: 'cloudy', minTemp: 20, maxTemp: 27, humidity: 62, windKph: 12, sunrise: '6:20 AM', feelsLike: 28, rainChance: 18 },
  { id: 'w3', dayLabel: 'Sat', dateISO: '2026-02-14', type: 'rainy', minTemp: 19, maxTemp: 24, humidity: 81, windKph: 15, sunrise: '6:20 AM', feelsLike: 25, rainChance: 74 },
  { id: 'w4', dayLabel: 'Sun', dateISO: '2026-02-15', type: 'rainy', minTemp: 18, maxTemp: 23, humidity: 86, windKph: 18, sunrise: '6:19 AM', feelsLike: 24, rainChance: 78 },
  { id: 'w5', dayLabel: 'Mon', dateISO: '2026-02-16', type: 'cloudy', minTemp: 20, maxTemp: 26, humidity: 66, windKph: 10, sunrise: '6:19 AM', feelsLike: 27, rainChance: 22 },
  { id: 'w6', dayLabel: 'Tue', dateISO: '2026-02-17', type: 'sunny', minTemp: 21, maxTemp: 30, humidity: 54, windKph: 7, sunrise: '6:18 AM', feelsLike: 31, rainChance: 4 },
  { id: 'w7', dayLabel: 'Wed', dateISO: '2026-02-18', type: 'sunny', minTemp: 22, maxTemp: 31, humidity: 51, windKph: 8, sunrise: '6:18 AM', feelsLike: 32, rainChance: 5 },
];

const packingCategories: PackingCategory[] = [
  { id: 'essentials', label: 'Essentials' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'gadgets', label: 'Gadgets' },
  { id: 'documents', label: 'Documents' },
  { id: 'health', label: 'Health' },
];

const packingItems: PackingItem[] = [
  { id: uid(), label: 'Passport', categoryId: 'documents', checked: true },
  { id: uid(), label: 'Travel insurance copy', categoryId: 'documents', checked: false },
  { id: uid(), label: 'Phone charger', categoryId: 'gadgets', checked: true },
  { id: uid(), label: 'Power adapter', categoryId: 'gadgets', checked: false },
  { id: uid(), label: 'Walking shoes', categoryId: 'clothing', checked: true },
  { id: uid(), label: 'Light jacket', categoryId: 'clothing', checked: false },
  { id: uid(), label: 'Toiletry pouch', categoryId: 'essentials', checked: true },
  { id: uid(), label: 'Medication kit', categoryId: 'health', checked: false },
];

export const useTripAssistantStore = create<TripAssistantState>((set, get) => ({
  trips: [],
  activeTripId: null,
  isLoadingTrips: false,
  fetchTrips: async (userId: string) => {
    set({ isLoadingTrips: true });
    try {
      const trips = await getTripsByUser(userId);
      set({ trips, isLoadingTrips: false });
      if (trips.length > 0 && !get().activeTripId) {
        get().selectTrip(trips[0].tripId);
      }
    } catch (e) {
      console.error('Failed to fetch trips', e);
      set({ isLoadingTrips: false });
    }
  },
  selectTrip: (tripId: string) => {
    const trip = get().trips.find(t => t.tripId === tripId);
    if (trip) {
      set({
        activeTripId: tripId,
        expenses: (trip.budget as any) || [],
        packingItems: (trip.packing as any) || packingItems,
      });
    }
  },

  totalBudget: 110000,
  budgetCategories,
  expenses: [],
  expandedBudgetCategories: {
    flights: false,
    stays: false,
    food: false,
    transport: false,
    activities: false,
    shopping: false,
  },
  weatherDays,
  selectedWeatherDayId: 'w1',
  packingCategories,
  packingItems: [],
  expandedPackingCategories: {
    essentials: true,
    clothing: true,
    gadgets: false,
    documents: true,
    health: false,
  },
  addExpense: ({ categoryId, amount, date, note }) => {
    set((state) => ({
      expenses: [
        {
          id: uid(),
          categoryId,
          amount: Math.max(0, amount),
          date,
          note: note?.trim() || undefined,
        },
        ...state.expenses,
      ],
      expandedBudgetCategories: {
        ...state.expandedBudgetCategories,
        [categoryId]: true,
      },
    }));

    const { activeTripId, expenses } = get();
    if (activeTripId) {
      updateTrip(activeTripId, { budget: expenses as any });
    }
  },
  toggleBudgetCategory: (categoryId) =>
    set((state) => ({
      expandedBudgetCategories: {
        ...state.expandedBudgetCategories,
        [categoryId]: !state.expandedBudgetCategories[categoryId],
      },
    })),
  selectWeatherDay: (dayId) => set({ selectedWeatherDayId: dayId }),
  togglePackingCategory: (categoryId) =>
    set((state) => ({
      expandedPackingCategories: {
        ...state.expandedPackingCategories,
        [categoryId]: !state.expandedPackingCategories[categoryId],
      },
    })),
  togglePackingItem: (itemId) => {
    set((state) => ({
      packingItems: state.packingItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));

    const { activeTripId, packingItems } = get();
    if (activeTripId) {
      updateTrip(activeTripId, { packing: packingItems as any });
    }
  },
  addPackingItem: ({ label, categoryId }) => {
    set((state) => ({
      packingItems: [
        ...state.packingItems,
        {
          id: uid(),
          label: label.trim(),
          categoryId,
          checked: false,
        },
      ],
      expandedPackingCategories: {
        ...state.expandedPackingCategories,
        [categoryId]: true,
      },
    }));

    const { activeTripId, packingItems } = get();
    if (activeTripId) {
      updateTrip(activeTripId, { packing: packingItems as any });
    }
  },
  addWeatherSuggestionsToPacking: () => {
    const { weatherDays, packingItems } = get();
    const rainyDays = weatherDays.filter((day) => day.rainChance >= 60);
    if (rainyDays.length === 0) return;

    const suggestions: Array<{ label: string; categoryId: PackingCategoryId }> = [
      { label: 'Raincoat', categoryId: 'clothing' },
      { label: 'Waterproof shoes', categoryId: 'clothing' },
    ];

    const existingNames = new Set(packingItems.map((item) => item.label.toLowerCase()));
    const additions = suggestions
      .filter((suggestion) => !existingNames.has(suggestion.label.toLowerCase()))
      .map((suggestion) => ({
        id: uid(),
        label: suggestion.label,
        categoryId: suggestion.categoryId,
        checked: false,
        suggestedByWeather: true,
      }));

    if (additions.length === 0) return;

    set((state) => ({
      packingItems: [...state.packingItems, ...additions],
      expandedPackingCategories: {
        ...state.expandedPackingCategories,
        clothing: true,
      },
    }));

    const { activeTripId, packingItems: updatedPacking } = get();
    if (activeTripId) {
      updateTrip(activeTripId, { packing: updatedPacking as any });
    }
  },
}));

export interface BudgetCategorySummary {
  category: BudgetCategory;
  spent: number;
  remaining: number;
  progress: number;
  isOverBudget: boolean;
  expenses: Expense[];
}

export const selectBudgetSummary = (state: TripAssistantState) => {
  const totalSpent = state.expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = Math.max(0, state.totalBudget - totalSpent);
  const percentUsed = state.totalBudget > 0 ? Math.min(100, (totalSpent / state.totalBudget) * 100) : 0;
  return {
    totalBudget: state.totalBudget,
    totalSpent,
    remaining,
    percentUsed,
    isOverBudget: totalSpent > state.totalBudget,
  };
};

export const selectBudgetBreakdown = (state: TripAssistantState): BudgetCategorySummary[] =>
  state.budgetCategories.map((category) => {
    const categoryExpenses = state.expenses.filter((expense) => expense.categoryId === category.id);
    const spent = categoryExpenses.reduce((sum, item) => sum + item.amount, 0);
    const progress = category.allocated > 0 ? (spent / category.allocated) * 100 : 0;
    return {
      category,
      spent,
      remaining: category.allocated - spent,
      progress,
      isOverBudget: spent > category.allocated,
      expenses: categoryExpenses,
    };
  });

export const selectSelectedWeatherDay = (state: TripAssistantState) =>
  state.weatherDays.find((day) => day.id === state.selectedWeatherDayId) ?? state.weatherDays[0];

export const selectRainInsight = (state: TripAssistantState) => {
  const rainyDays = state.weatherDays.filter((day) => day.rainChance >= 60);
  if (rainyDays.length === 0) {
    return {
      hasRainAlert: false,
      message: 'Weather looks stable this week.',
    };
  }

  return {
    hasRainAlert: true,
    message: `Rain expected on ${rainyDays.map((day) => day.dayLabel).join(', ')}. Keep rain-ready plans.`,
  };
};

export const selectPackingProgress = (state: TripAssistantState) => {
  const total = state.packingItems.length;
  const packed = state.packingItems.filter((item) => item.checked).length;
  return {
    total,
    packed,
    percent: total > 0 ? (packed / total) * 100 : 0,
  };
};

export const selectPackingByCategory = (state: TripAssistantState) =>
  state.packingCategories.map((category) => {
    const items = state.packingItems.filter((item) => item.categoryId === category.id);
    return {
      category,
      items,
      packedCount: items.filter((item) => item.checked).length,
      totalCount: items.length,
      isExpanded: state.expandedPackingCategories[category.id],
    };
  });
