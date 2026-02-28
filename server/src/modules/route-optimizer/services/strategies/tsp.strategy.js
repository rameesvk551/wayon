/**
 * TSP Strategy — Nearest Neighbor, 2-Opt, and Genetic Algorithm
 * Converted from route-optimizer domain/services/strategies/TSPStrategy.ts
 */

import { haversineDistance } from "../../utils/distance.js";

export class TSPStrategy {

    static optimize(attractions, algorithm = "TSP_2OPT") {
        const mappedAttractions = attractions.map(a => ({
            id: a.id,
            latitude: a.location.lat,
            longitude: a.location.lng,
            priority: a.priority,
            visitDuration: a.visitDuration,
            timeWindow: a.timeWindow ? { open: a.timeWindow.open, close: a.timeWindow.close } : undefined,
        }));

        let optimizedIndices = [];

        switch (algorithm) {
            case "GREEDY":
                optimizedIndices = this.nearestNeighborTSP(mappedAttractions);
                break;
            case "GENETIC":
                optimizedIndices = this.geneticAlgorithmTSP(mappedAttractions);
                break;
            case "TSP_2OPT":
            default: {
                const initial = this.nearestNeighborTSP(mappedAttractions);
                optimizedIndices = this.twoOptOptimization(mappedAttractions, initial);
                break;
            }
        }

        return optimizedIndices.map(index => attractions[index]);
    }

    static nearestNeighborTSP(attractions, startIndex = 0) {
        const n = attractions.length;
        const visited = new Set();
        const route = [];

        let current = startIndex;
        route.push(current);
        visited.add(current);

        while (visited.size < n) {
            let nearest = -1;
            let minDistance = Infinity;

            for (let i = 0; i < n; i++) {
                if (!visited.has(i)) {
                    const dist = haversineDistance(
                        { latitude: attractions[current].latitude, longitude: attractions[current].longitude },
                        { latitude: attractions[i].latitude, longitude: attractions[i].longitude }
                    );
                    if (dist < minDistance) {
                        minDistance = dist;
                        nearest = i;
                    }
                }
            }

            if (nearest !== -1) {
                route.push(nearest);
                visited.add(nearest);
                current = nearest;
            }
        }

        return route;
    }

    static twoOptOptimization(attractions, initialRoute, maxIterations = 100) {
        let route = [...initialRoute];
        let improved = true;
        let iteration = 0;

        const coords = route.map((idx) => ({
            latitude: attractions[idx].latitude,
            longitude: attractions[idx].longitude,
        }));

        while (improved && iteration < maxIterations) {
            improved = false;
            iteration++;

            for (let i = 1; i < route.length - 2; i++) {
                for (let j = i + 1; j < route.length - 1; j++) {
                    const currentDist =
                        haversineDistance(coords[i - 1], coords[i]) +
                        haversineDistance(coords[j], coords[j + 1]);

                    const newDist =
                        haversineDistance(coords[i - 1], coords[j]) +
                        haversineDistance(coords[i], coords[j + 1]);

                    if (newDist < currentDist) {
                        route = [...route.slice(0, i), ...route.slice(i, j + 1).reverse(), ...route.slice(j + 1)];
                        coords.splice(i, j - i + 1, ...route.slice(i, j + 1).map((idx) => ({
                            latitude: attractions[idx].latitude,
                            longitude: attractions[idx].longitude,
                        })));
                        improved = true;
                    }
                }
            }
        }

        return route;
    }

    static geneticAlgorithmTSP(attractions, populationSize = 50, generations = 100, mutationRate = 0.01) {
        let population = this.initializePopulation(attractions.length, populationSize);

        for (let gen = 0; gen < generations; gen++) {
            const fitness = population.map((route) => {
                const totalDist = this.calculateRouteTotalDistance(attractions, route);
                return 1 / (totalDist + 1);
            });

            const selected = this.selection(population, fitness, populationSize / 2);
            const offspring = this.crossover(selected, populationSize);
            const mutated = offspring.map((route) =>
                Math.random() < mutationRate ? this.mutate(route) : route
            );

            population = mutated;
        }

        const bestRoute = population.reduce((best, route) => {
            const bestDist = this.calculateRouteTotalDistance(attractions, best);
            const routeDist = this.calculateRouteTotalDistance(attractions, route);
            return routeDist < bestDist ? route : best;
        });

        return bestRoute;
    }

    static initializePopulation(size, popSize) {
        const population = [];
        const baseRoute = Array.from({ length: size }, (_, i) => i);

        for (let i = 0; i < popSize; i++) {
            const route = [...baseRoute];
            for (let j = route.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [route[j], route[k]] = [route[k], route[j]];
            }
            population.push(route);
        }
        return population;
    }

    static selection(population, fitness, count) {
        const selected = [];
        const totalFitness = fitness.reduce((sum, f) => sum + f, 0);

        for (let i = 0; i < count; i++) {
            let random = Math.random() * totalFitness;
            let sum = 0;

            for (let j = 0; j < population.length; j++) {
                sum += fitness[j];
                if (sum >= random) {
                    selected.push([...population[j]]);
                    break;
                }
            }
        }
        return selected;
    }

    static crossover(parents, offspringSize) {
        const offspring = [];
        while (offspring.length < offspringSize) {
            const parent1 = parents[Math.floor(Math.random() * parents.length)];
            const parent2 = parents[Math.floor(Math.random() * parents.length)];
            offspring.push(this.orderCrossover(parent1, parent2));
        }
        return offspring;
    }

    static orderCrossover(parent1, parent2) {
        const size = parent1.length;
        const start = Math.floor(Math.random() * size);
        const end = start + Math.floor(Math.random() * (size - start));
        const child = Array(size).fill(-1);

        for (let i = start; i <= end; i++) child[i] = parent1[i];

        let childPos = (end + 1) % size;
        let parent2Pos = (end + 1) % size;

        while (child.includes(-1)) {
            if (!child.includes(parent2[parent2Pos])) {
                child[childPos] = parent2[parent2Pos];
                childPos = (childPos + 1) % size;
            }
            parent2Pos = (parent2Pos + 1) % size;
        }
        return child;
    }

    static mutate(route) {
        const mutated = [...route];
        const i = Math.floor(Math.random() * route.length);
        const j = Math.floor(Math.random() * route.length);
        [mutated[i], mutated[j]] = [mutated[j], mutated[i]];
        return mutated;
    }

    static calculateRouteTotalDistance(attractions, route) {
        let total = 0;
        for (let i = 0; i < route.length - 1; i++) {
            const a = attractions[route[i]];
            const b = attractions[route[i + 1]];
            total += haversineDistance(
                { latitude: a.latitude, longitude: a.longitude },
                { latitude: b.latitude, longitude: b.longitude }
            );
        }
        return total;
    }
}
