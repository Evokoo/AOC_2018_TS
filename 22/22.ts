// Imports
import TOOLS from "tools";
import { BinaryHeap } from "@std/data-structures";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const [depth, target] = parseInput(data);
	return assessCave(depth, target);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const [depth, target] = parseInput(data);

	//Generate Terrain Map
	assessCave(depth, target);

	return findShortestPath(target);
}

type Point = { x: number; y: number };
type Neighhbour = Point & { type: number };

interface Path {
	x: number;
	y: number;
	cost: number;
	tool: number;
}

//Gobals
const EROSION_CACHE: Map<number, number> = new Map();
const TERRAIN_CACHE: Map<number, number> = new Map();
const X_OFFSET: number = 100;
const Y_OFFSET: number = 100;

// Functions
function parseInput(data: string): [number, Point] {
	const [depth, target] = data
		.split("\n")
		.map((line) => (line.match(/\d+/g) || []).map(Number));

	return [depth[0], { x: target[0], y: target[1] }];
}
function assessCave(depth: number, target: Point): number {
	let risk = 0;

	for (let y = 0; y <= target.y + Y_OFFSET; y++) {
		for (let x = 0; x <= target.x + X_OFFSET; x++) {
			const terrainType = getTerrainType({ x, y }, depth, target);

			if (x >= 0 && x <= target.x && y >= 0 && y <= target.y) {
				risk += terrainType;
			}

			TERRAIN_CACHE.set(cantorKey(x, y), terrainType);
		}
	}

	return risk;

	function getTerrainType(point: Point, depth: number, target: Point): number {
		function getErosionLevel(x: number, y: number): number {
			let geoIndex = depth;

			if (x === 0 && y === 0) {
				geoIndex += 0;
			} else if (x === target.x && y === target.y) {
				geoIndex += 0;
			} else if (x === 0) {
				geoIndex += y * 48271;
			} else if (y === 0) {
				geoIndex += x * 16807;
			} else {
				const a = getErosionCacheOrCalculate(x - 1, y);
				const b = getErosionCacheOrCalculate(x, y - 1);
				geoIndex += a * b;
			}
			return geoIndex % 20183;
		}

		function getErosionCacheOrCalculate(x: number, y: number): number {
			const key = cantorKey(x, y);

			if (EROSION_CACHE.has(key)) {
				return EROSION_CACHE.get(key)!;
			} else {
				const erosion = getErosionLevel(x, y);
				EROSION_CACHE.set(key, erosion);

				return erosion;
			}
		}

		const key = cantorKey(point.x, point.y);
		const erosion = getErosionLevel(point.x, point.y);

		EROSION_CACHE.set(key, erosion);

		return erosion % 3;
	}
}
function findShortestPath(target: Point) {
	function isValid(type: number, tool: number): boolean {
		if (type === 0 && (tool === 0 || tool === 1)) return true;
		if (type === 1 && (tool === 1 || tool === 2)) return true;
		if (type === 2 && (tool === 0 || tool === 2)) return true;
		return false;
	}

	const seen: Set<string> = new Set();
	const queue: BinaryHeap<Path> = new BinaryHeap((a, b) => a.cost - b.cost);

	queue.push({ x: 0, y: 0, cost: 0, tool: 0 });

	while (queue.length) {
		const { x, y, cost, tool } = queue.pop()!;
		const stateKey = `${x},${y},${tool}`;

		if (x === target.x && y === target.y && tool === 0) {
			return cost;
		}

		if (seen.has(stateKey)) {
			continue;
		} else {
			seen.add(stateKey);
		}

		//Check for tool change
		const currentTerrainType = TERRAIN_CACHE.get(cantorKey(x, y))!;

		for (let i = 0; i < 3; i++) {
			if (isValid(currentTerrainType, i)) {
				queue.push({ x, y, cost: cost + 7, tool: i });
			}
		}

		for (const { x: nx, y: ny, type } of getNeighbours(x, y)) {
			if (isValid(type, tool)) {
				queue.push({ x: nx, y: ny, cost: cost + 1, tool });
			}
		}
	}

	function getNeighbours(x: number, y: number): Neighhbour[] {
		const neighbours: Neighhbour[] = [];

		for (const [dx, dy] of [
			[0, 1],
			[0, -1],
			[1, 0],
			[-1, 0],
		]) {
			const [nx, ny] = [dx + x, dy + y];

			if (nx < 0 || ny < 0 || nx >= target.x + 100 || ny >= target.y + 100) {
				continue;
			}

			neighbours.push({
				x: nx,
				y: ny,
				type: TERRAIN_CACHE.get(cantorKey(nx, ny))!,
			});
		}

		return neighbours;
	}

	throw Error("Path Not Found");
}

// Unique Keys from two integers
function cantorKey(x: number, y: number): number {
	return Math.floor(((x + y) * (x + y + 1)) / 2) + y;
}
