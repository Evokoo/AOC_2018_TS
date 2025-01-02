// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const cave = parseInput(data);
	const { risklevel } = exploreCave(cave);
	return risklevel;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const cave = parseInput(data);
	const { terrain } = exploreCave(cave);

	traverseCave(terrain, cave);
	return 0;
}

type Point = { x: number; y: number };
type Cave = {
	depth: number;
	target: Point;
};
type CaveMap = {
	risklevel: number;
	terrain: Map<number, number>;
};

// Functions
function parseInput(data: string): Cave {
	const [depth, target] = data
		.split("\n")
		.map((line) => (line.match(/\d+/g) || []).map(Number));

	return { depth: depth[0], target: { x: target[0], y: target[1] } };
}

function exploreCave({ depth, target }: Cave): CaveMap {
	const erosionMap: Map<number, number> = new Map();
	const terrainMap: Map<number, number> = new Map();
	const terrainCount: [number, number, number] = [0, 0, 0];

	for (let y = 0; y <= target.y; y++) {
		for (let x = 0; x <= target.x; x++) {
			const key = cantorKey(x, y);

			const a = erosionMap.get(cantorKey(x - 1, y)) ?? 0;
			const b = erosionMap.get(cantorKey(x, y - 1)) ?? 0;
			const erosionLevel = getErosionLevel(x, y, a, b, depth, target);
			const terrainType = erosionLevel % 3;

			erosionMap.set(key, erosionLevel);
			terrainMap.set(key, terrainType);

			terrainCount[terrainType]++;
		}
	}

	return {
		risklevel: terrainCount.reduce((acc, cur, i) => acc + cur * i, 0),
		terrain: terrainMap,
	};
}
function getErosionLevel(
	x: number,
	y: number,
	a: number,
	b: number,
	depth: number,
	target: Point
): number {
	if ((x === 0 && y === 0) || (x === target.x && y === target.y)) {
		return depth % 20183;
	} else if (y === 0) {
		return (x * 16807 + depth) % 20183;
	} else if (x === 0) {
		return (y * 48271 + depth) % 20183;
	} else {
		return (a * b + depth) % 20183;
	}
}

function traverseCave(terrain: Map<number, number>, { target }: Cave) {}

// Unique Keys from two integers
function cantorKey(x: number, y: number): number {
	return Math.floor(((x + y) * (x + y + 1)) / 2) + y;
}
