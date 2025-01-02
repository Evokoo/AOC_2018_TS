// Imports
import TOOLS from "tools";
import { BinaryHeap } from "@std/data-structures";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const [depth, target] = parseInput(data);
	return inspectCave(depth, target).risk;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const cave = parseInput(data);

	return 0;
}

type Point = { x: number; y: number };
type CaveReport = {
	risk: number;
	terrain: Map<number, number>;
};

// Functions
function parseInput(data: string): [number, Point] {
	const [depth, target] = data
		.split("\n")
		.map((line) => (line.match(/\d+/g) || []).map(Number));

	return [depth[0], { x: target[0], y: target[1] }];
}
function inspectCave(depth: number, target: Point): CaveReport {
	const terrainCount: [number, number, number] = [0, 0, 0];
	const terrainMap: Map<number, number> = new Map();

	for (let y = 0; y <= target.y; y++) {
		for (let x = 0; x <= target.x; x++) {
			const terrainType = getTerrainType({ x, y }, depth, target);
			terrainCount[terrainType]++;
			terrainMap.set(cantorKey(x, y), terrainType);
		}
	}

	return {
		risk: terrainCount.reduce((acc, cur, i) => acc + cur * i, 0),
		terrain: terrainMap,
	};
}

const erosionCache: Map<number, number> = new Map();

function getTerrainType(point: Point, depth: number, target: Point) {
	function getErosionLevel(x: number, y: number, a: number, b: number): number {
		let geoIndex = depth;

		if (x === 0 && y === 0) geoIndex += 0;
		else if (x === target.x && y === target.y) geoIndex += 0;
		else if (x === 0) geoIndex += y * 48271;
		else if (y === 0) geoIndex += x * 16807;
		else geoIndex += a * b;

		return geoIndex % 20183;
	}

	const key = cantorKey(point.x, point.y);
	const a = erosionCache.get(cantorKey(point.x - 1, point.y)) ?? 0;
	const b = erosionCache.get(cantorKey(point.x, point.y - 1)) ?? 0;
	const erosion = getErosionLevel(point.x, point.y, a, b);

	erosionCache.set(key, erosion);

	return erosion % 3;
}

// Unique Keys from two integers
function cantorKey(x: number, y: number): number {
	return Math.floor(((x + y) * (x + y + 1)) / 2) + y;
}
