/**
 * Tool result interface
 */
export interface ToolResult {
    success: boolean;
    data?: unknown;
    error?: string;
    source: 'api' | 'fallback' | 'cache';
}

/**
 * Tool definition interface
 */
export interface Tool {
    name: string;
    description: string;
    parameters: Record<string, {
        type: string;
        description: string;
        enum?: string[];
    }>;
    required?: string[];
    execute: (params: Record<string, unknown>) => Promise<ToolResult>;
}

/**
 * Tool registry
 */
export class ToolRegistry {
    private tools = new Map<string, Tool>();

    register(tool: Tool): void {
        this.tools.set(tool.name, tool);
    }

    get(name: string): Tool | undefined {
        return this.tools.get(name);
    }

    getAll(): Tool[] {
        return Array.from(this.tools.values());
    }

    getByNames(names: string[]): Tool[] {
        return names
            .map((name) => this.tools.get(name))
            .filter((tool): tool is Tool => tool !== undefined);
    }
}

// Global tool registry
export const toolRegistry = new ToolRegistry();

/**
 * Helper to make HTTP requests to microservices
 */
export async function fetchFromService<T>(
    serviceUrl: string,
    endpoint: string,
    options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
        const url = `${serviceUrl}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            return {
                success: false,
                error: `Service returned ${response.status}: ${response.statusText}`,
            };
        }

        const data = await response.json() as T;
        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
