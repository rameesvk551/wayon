/**
 * RouteOptimizerService — wraps use-cases and domain services into a single service class.
 * Merged from: OptimizeRouteUseCase, GenerateItineraryUseCase, GetOptimizationJobUseCase, and RouteOptimizer.
 */

import { Attraction, GeoPoint, TimeWindow } from "../models/route-optimizer.models.js";
import { Result } from "../utils/result.js";
import { TSPStrategy } from "./strategies/tsp.strategy.js";
import { TOPTWStrategy } from "./strategies/toptw.strategy.js";
import { ItineraryAssembler } from "./itinerary-assembler.service.js";

let jobCounter = 0;

function generateJobId() {
    jobCounter++;
    return `job-${Date.now()}-${jobCounter}`;
}

export class RouteOptimizerService {
    /** In-memory job store */
    #jobs = new Map();

    /**
     * Optimize a route (TSP-based).
     * @param {*} request
     */
    async optimizeRoute(request) {
        try {
            if (!request.attractions || !Array.isArray(request.attractions) || request.attractions.length < 2) {
                return Result.fail("At least 2 attractions are required");
            }

            const attractions = request.attractions.map(a => new Attraction(a.id, {
                name: a.name,
                location: new GeoPoint({ lat: a.lat, lng: a.lng }),
                priority: a.priority,
                visitDuration: a.visitDuration,
            }));

            const algorithm = request.options?.algorithm || "TSP_2OPT";

            let orderedAttractions;
            if (algorithm === "auto") {
                if (attractions.length > 50) {
                    orderedAttractions = TSPStrategy.optimize(attractions, "GENETIC");
                } else {
                    orderedAttractions = TSPStrategy.optimize(attractions, "TSP_2OPT");
                }
            } else {
                orderedAttractions = TSPStrategy.optimize(attractions, algorithm);
            }

            const jobId = generateJobId();
            const job = {
                id: jobId,
                status: "COMPLETED",
                requestPayload: request,
                result: {
                    orderedAttractions: orderedAttractions.map(a => ({
                        id: a.id,
                        name: a.name,
                        location: { lat: a.location.lat, lng: a.location.lng },
                    })),
                    totalDistance: 0,
                    totalDuration: 0,
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            this.#jobs.set(jobId, job);

            return Result.ok({
                jobId,
                orderedAttractions: job.result.orderedAttractions,
                totalDistance: 0,
                totalDuration: 0,
                stats: {},
            });
        } catch (error) {
            return Result.fail(error);
        }
    }

    /**
     * Generate a multi-day itinerary (TOPTW-based).
     * @param {*} request
     */
    async generateItinerary(request) {
        try {
            console.log(`Generating itinerary for ${request.destination}`);

            if (!request.attractions || !Array.isArray(request.attractions)) {
                return Result.fail("Invalid attractions list. Must be an array.");
            }

            const attractions = [];
            for (const dto of request.attractions) {
                const geoResult = GeoPoint.create(dto.lat, dto.lng);
                if (geoResult.isFailure) {
                    console.warn(`Skipping attraction ${dto.id} due to invalid location: ${geoResult.getErrorValue()}`);
                    continue;
                }

                let timeWindow;
                if (dto.timeWindow && dto.timeWindow.open && dto.timeWindow.close) {
                    const twResult = TimeWindow.create(dto.timeWindow.open, dto.timeWindow.close);
                    if (twResult.isSuccess) {
                        timeWindow = twResult.getValue();
                    }
                }

                const attraction = new Attraction(dto.id, {
                    name: dto.name,
                    location: geoResult.getValue(),
                    priority: dto.priority,
                    visitDuration: dto.visitDuration,
                    timeWindow,
                    category: dto.category,
                    imageUrl: dto.image,
                    description: dto.description,
                });
                attractions.push(attraction);
            }

            if (attractions.length === 0) {
                return Result.fail("No valid attractions provided.");
            }

            const solverInput = {
                attractions,
                numDays: request.numDays,
                maxDailyMinutes: request.preferences?.maxDailyMinutes,
                dayStartTime: request.preferences?.dayStartTime,
                startLocation: request.startLocation,
                avgSpeedKmh: request.preferences?.avgSpeedKmh,
            };

            const result = TOPTWStrategy.solve(solverInput);
            const jobId = generateJobId();
            const response = ItineraryAssembler.assemble(result, request, jobId);

            this.#jobs.set(jobId, {
                id: jobId,
                status: "COMPLETED",
                requestPayload: request,
                result: response,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return Result.ok(response);
        } catch (error) {
            console.error("Error generating itinerary", error);
            return Result.fail(error);
        }
    }

    /**
     * Get a job by ID.
     * @param {string} jobId
     */
    async getJob(jobId) {
        const job = this.#jobs.get(jobId);
        if (!job) {
            return Result.fail("Job not found");
        }
        return Result.ok(job);
    }
}
