import { Result } from "../utils/result.js";
import { ValidationError } from "../utils/result.js";

/**
 * GeoPoint value object — immutable lat/lng pair with validation.
 */
export class GeoPoint {
    /** @param {{ lat: number, lng: number }} props */
    constructor(props) {
        this.props = Object.freeze(props);
    }

    static create(lat, lng) {
        if (lat < -90 || lat > 90) {
            return Result.fail(new ValidationError("Latitude must be between -90 and 90"));
        }
        if (lng < -180 || lng > 180) {
            return Result.fail(new ValidationError("Longitude must be between -180 and 180"));
        }
        return Result.ok(new GeoPoint({ lat, lng }));
    }

    get lat() { return this.props.lat; }
    get lng() { return this.props.lng; }
}

/**
 * TimeWindow value object — immutable open/close pair (HH:MM).
 */
export class TimeWindow {
    /** @param {{ open: string, close: string }} props */
    constructor(props) {
        this.props = Object.freeze(props);
    }

    static create(open, close) {
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(open) || !timeRegex.test(close)) {
            return Result.fail(new ValidationError("Time must be in HH:MM format"));
        }
        return Result.ok(new TimeWindow({ open, close }));
    }

    get open() { return this.props.open; }
    get close() { return this.props.close; }
}

/**
 * Attraction entity.
 */
export class Attraction {
    /** @param {string} id  @param {{ name: string, location: GeoPoint, priority?: number, visitDuration?: number, timeWindow?: TimeWindow, category?: string, imageUrl?: string, description?: string }} props */
    constructor(id, props) {
        this.id = id;
        this.props = props;
    }

    get name() { return this.props.name; }
    get location() { return this.props.location; }
    get priority() { return this.props.priority || 5; }
    get visitDuration() { return this.props.visitDuration || 60; }
    get timeWindow() { return this.props.timeWindow; }
}

/**
 * OptimizationJob entity.
 */
export class OptimizationJob {
    /** @param {string} id  @param {{ requestPayload: any, status: string, createdAt: Date, updatedAt: Date, result?: any }} props */
    constructor(id, props) {
        this.id = id;
        this.props = props;
    }

    complete(result, processingTimeMs) {
        this.props.status = "COMPLETED";
        this.props.result = result;
        this.props.processingTimeMs = processingTimeMs;
        this.props.updatedAt = new Date();
    }

    fail() {
        this.props.status = "FAILED";
        this.props.updatedAt = new Date();
    }
}
