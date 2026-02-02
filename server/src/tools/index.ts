// Export all tools and the registry
export { toolRegistry, type Tool, type ToolResult } from './types.js';

// Import tools to register them
import './visa.tool.js';
import './hotel.tool.js';
import './flight.tool.js';
import './attraction.tool.js';
import './weather.tool.js';
import './transport.tool.js';
import './tour.tool.js';
import './blog.tool.js';
