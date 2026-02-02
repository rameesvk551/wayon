import { UIResponseSchema, type UIResponse, type UIBlock } from '../schema/ui-schema.zod.js';

/**
 * Validate UI response against Zod schema
 */
export function validateUIResponse(response: unknown): {
    valid: boolean;
    data: UIResponse | null;
    errors: string[];
} {
    const result = UIResponseSchema.safeParse(response);

    if (result.success) {
        return {
            valid: true,
            data: result.data,
            errors: [],
        };
    }

    const errors = result.error.errors.map(
        (err) => `${err.path.join('.')}: ${err.message}`
    );

    return {
        valid: false,
        data: null,
        errors,
    };
}

/**
 * Parse LLM output and extract JSON
 * Handles markdown code blocks and raw JSON
 */
export function parseJSONFromLLM(text: string): unknown | null {
    // Try to extract JSON from markdown code block
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
        try {
            return JSON.parse(codeBlockMatch[1].trim());
        } catch {
            // Continue to try other methods
        }
    }

    // Try to find JSON object directly
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch {
            // Continue
        }
    }

    // Try parsing the whole text as JSON
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

/**
 * Auto-fix common LLM output issues
 */
export function autoFixResponse(parsed: unknown): UIResponse | null {
    if (!parsed || typeof parsed !== 'object') {
        return null;
    }

    const obj = parsed as Record<string, unknown>;

    // If blocks array exists, validate and filter
    if (Array.isArray(obj.blocks)) {
        const validBlocks: UIBlock[] = [];

        for (const block of obj.blocks) {
            if (block && typeof block === 'object' && 'type' in block) {
                // Try to fix common issues
                const fixed = fixBlockIssues(block as Record<string, unknown>);
                if (fixed) {
                    validBlocks.push(fixed);
                }
            }
        }

        if (validBlocks.length > 0) {
            return { blocks: validBlocks };
        }
    }

    // If no blocks array but has content, wrap in text block
    if ('content' in obj && typeof obj.content === 'string') {
        return {
            blocks: [
                {
                    type: 'text',
                    content: obj.content,
                    format: 'markdown',
                },
            ],
        };
    }

    return null;
}

/**
 * Fix common issues in individual blocks
 */
function fixBlockIssues(block: Record<string, unknown>): UIBlock | null {
    const type = block.type as string;

    try {
        switch (type) {
            case 'title':
                return {
                    type: 'title',
                    text: String(block.text || ''),
                    level: ([1, 2, 3].includes(block.level as number) ? block.level : 1) as 1 | 2 | 3,
                };

            case 'text':
                return {
                    type: 'text',
                    content: String(block.content || ''),
                    format: block.format === 'markdown' ? 'markdown' : 'plain',
                };

            case 'alert':
                const validLevels = ['info', 'success', 'warning', 'error'];
                return {
                    type: 'alert',
                    level: validLevels.includes(block.level as string)
                        ? (block.level as 'info' | 'success' | 'warning' | 'error')
                        : 'info',
                    text: String(block.text || ''),
                    title: block.title ? String(block.title) : undefined,
                    dismissible: block.dismissible === true,
                };

            case 'divider':
                const validSpacings = ['sm', 'md', 'lg'];
                return {
                    type: 'divider',
                    spacing: validSpacings.includes(block.spacing as string)
                        ? (block.spacing as 'sm' | 'md' | 'lg')
                        : 'md',
                };

            case 'card':
            case 'list':
            case 'timeline':
            case 'map':
            case 'image':
            case 'actions':
                // For complex blocks, validate against schema
                // If valid, return as-is; otherwise skip
                const { UIBlockSchema } = require('../schema/ui-schema.zod.js');
                const result = UIBlockSchema.safeParse(block);
                return result.success ? result.data : null;

            default:
                // Unknown block type - skip
                console.warn(`Unknown block type: ${type}`);
                return null;
        }
    } catch {
        return null;
    }
}

/**
 * Create error response block
 */
export function createErrorResponse(message: string): UIResponse {
    return {
        blocks: [
            {
                type: 'alert',
                level: 'error',
                text: message,
                title: 'Error',
            },
        ],
    };
}

/**
 * Create loading/processing response
 */
export function createLoadingResponse(message: string = 'Processing your request...'): UIResponse {
    return {
        blocks: [
            {
                type: 'text',
                content: message,
                format: 'plain',
            },
        ],
    };
}
