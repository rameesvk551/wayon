// ═══════════════════════════════════════════════════════════════════════════
// BUDGET TRACKER — API Client Layer
// ═══════════════════════════════════════════════════════════════════════════

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4333';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error || `API error: ${res.status}`);
    }
    return json.data;
}

export interface ExpensePayload {
    id?: string;
    categoryId: string;
    amount: number;
    date: string;
    note?: string;
}

export interface BudgetExpensesResult {
    tripId: string;
    expenses: ExpensePayload[];
    budgetSettings?: any;
}

export interface BudgetSettingsResult {
    tripId: string;
    budgetSettings: any;
}

// ── Get all expenses for a trip ──────────────────────────────────────────
export async function getExpenses(tripId: string): Promise<BudgetExpensesResult> {
    return request<BudgetExpensesResult>(`/api/budget/${tripId}/expenses`);
}

// ── Add an expense ───────────────────────────────────────────────────────
export async function addExpense(tripId: string, expense: ExpensePayload): Promise<BudgetExpensesResult> {
    return request<BudgetExpensesResult>(`/api/budget/${tripId}/expenses`, {
        method: 'POST',
        body: JSON.stringify(expense),
    });
}

// ── Remove an expense ────────────────────────────────────────────────────
export async function removeExpense(tripId: string, expenseId: string): Promise<BudgetExpensesResult> {
    return request<BudgetExpensesResult>(`/api/budget/${tripId}/expenses/${expenseId}`, {
        method: 'DELETE',
    });
}

// ── Update budget settings ───────────────────────────────────────────────
export async function updateBudgetSettings(tripId: string, settings: any): Promise<BudgetSettingsResult> {
    return request<BudgetSettingsResult>(`/api/budget/${tripId}/settings`, {
        method: 'PUT',
        body: JSON.stringify(settings),
    });
}
