// Imports
import TOOLS from "../00/tools";
import PQ from "ts-priority-queue";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ depth, target } = parseInput(data),
		riskLevel = navigateCave(depth, target);

	return riskLevel;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ depth, target } = parseInput(data),
		fastestPath = findPath2(depth, target);

	console.log(fastestPath);

	return fastestPath;
}

// Functions
type Point = { x: number; y: number };
type Region = { pos: Point; score: number; tile: string; type: string };
type Cave = Map<string, Region>;

function parseInput(data: string) {
	const lines = data.split("\r\n");
	const depth = +(lines[0].match(/\d+/g) || []).join("");
	const [x, y] = (lines[1].match(/\d+/g) || []).map(Number);

	return { depth, target: { x, y } };
}
function getRegionType({ x, y }: Point, depth: number): Region {
	const cache: Map<string, number> = new Map();

	function getErosionLevel(geoIndex: number): number {
		return (geoIndex + depth) % 20183;
	}

	function getGeologicIndex(point: Point): number {
		const key = `${point.x},${point.y}`;

		if (cache.has(key)) {
			return cache.get(key)!;
		}

		let geoIndex = 0;

		if (point.y === point.x && point.y === 0) {
			geoIndex = 0;
		} else if (point.y === 0) {
			geoIndex = getErosionLevel(point.x * 16807);
		} else if (point.x === 0) {
			geoIndex = getErosionLevel(point.y * 48271);
		} else {
			const a = getGeologicIndex({ x: point.x - 1, y: point.y });
			const b = getGeologicIndex({ x: point.x, y: point.y - 1 });
			geoIndex = getErosionLevel(a * b);
		}

		cache.set(key, geoIndex);
		return geoIndex;
	}

	const score = getGeologicIndex({ x, y }) % 3;

	switch (score) {
		case 0:
			return { pos: { x, y }, score, tile: ".", type: "Rocky" };
		case 1:
			return { pos: { x, y }, score, tile: "=", type: "Wet" };
		case 2:
			return { pos: { x, y }, score, tile: "|", type: "Narrow" };
		default:
			throw Error("Invalid Erosion Level");
	}
}
function navigateCave(depth: number, target: Point, partB: boolean = false) {
	const cave: Cave = new Map();

	let score = 0;

	for (let y = 0; y <= target.y; y++) {
		for (let x = 0; x <= target.x; x++) {
			const key = `${x},${y}`;
			const region = getRegionType({ x, y }, depth);

			if ((y === 0 && x === 0) || (y === target.y && x === target.x)) {
				//Don't add score
			} else {
				score += region.score;
			}

			cave.set(key, region);
		}
	}

	// if (partB) {
	// 	return findPath2(target, depth);
	// }

	return score;
}

// function findPath(cave: Cave, target: Point, depth: number): number {
// 	const seen: Set<string> = new Set();
// 	const queue: Path[] = [
// 		{
// 			pos: { x: 0, y: 0 },
// 			torch: true,
// 			climbingGear: false,
// 			gCost: 0,
// 			hCost: heuristic({ x: 0, y: 0 }),
// 			fCost: heuristic({ x: 0, y: 0 }),
// 		},
// 	];

// 	while (queue.length) {
// 		const current = queue.shift()!;

// 		if (current.pos.x === target.x && current.pos.y === target.y) {
// 			if (!current.torch) current.gCost += 7;
// 			return current.gCost;
// 		}

// 		if (seen.has(`${current.pos.x},${current.pos.y}`)) {
// 			continue;
// 		} else {
// 			seen.add(`${current.pos.x},${current.pos.y}`);
// 		}
// 		// cave.delete(`${current.pos.x},${current.pos.y}`);

// 		for (let region of getAdjacentRegion(current.pos)) {
// 			if (region.type === "Rocky") {
// 				if (!current.torch && !current.climbingGear) {
// 					addToQueue(current, region, 7, true, false);
// 					addToQueue(current, region, 7, false, true);
// 				} else {
// 					addToQueue(current, region, 1, current.torch, current.climbingGear);
// 				}
// 			}

// 			if (region.type === "Wet") {
// 				if (current.torch) {
// 					addToQueue(current, region, 7, false, false);
// 					addToQueue(current, region, 7, false, true);
// 				} else {
// 					addToQueue(current, region, 1, current.torch, current.climbingGear);
// 				}
// 			}

// 			if (region.type === "Narrow") {
// 				if (current.climbingGear) {
// 					addToQueue(current, region, 7, false, false);
// 					addToQueue(current, region, 7, true, false);
// 				} else {
// 					addToQueue(current, region, 1, current.torch, current.climbingGear);
// 				}
// 			}
// 		}

// 		// console.log(cave.size);
// 		queue.sort((a, b) => a.fCost - b.fCost);
// 	}

// 	function getAdjacentRegion(pos: Point): Region[] {
// 		const regions: Region[] = [];

// 		for (let [nx, ny] of [
// 			[1, 0],
// 			[-1, 0],
// 			[0, 1],
// 			[0, -1],
// 		]) {
// 			const [x, y] = [nx + pos.x, ny + pos.y];
// 			const key = `${x},${y}`;

// 			// if (
// 			// 	x < 0 ||
// 			// 	x > target.x ||
// 			// 	y < 0 ||
// 			// 	y > target.y ||
// 			// 	seen.has(key) ||
// 			// 	!cave.has(key)
// 			// ) {
// 			// 	continue;
// 			// } else {
// 			// 	regions.push(cave.get(key) as Region);
// 			// }

// 			// if (!seen.has(key) && cave.has(key)) {
// 			// 	regions.push(cave.get(key) as Region);
// 			// }
// 		}

// 		return regions;
// 	}
// 	function heuristic(pos: Point): number {
// 		return TOOLS.manhattanDistance(pos, target);
// 	}
// 	function addToQueue(
// 		current: Path,
// 		region: Region,
// 		gValue: number,
// 		torch: boolean,
// 		climbingGear: boolean
// 	) {
// 		const gCost = current.gCost + gValue;
// 		const hCost = heuristic(region.pos);
// 		const fCost = gCost + hCost;

// 		const newPath = {
// 			pos: region.pos,
// 			torch,
// 			climbingGear,
// 			gCost,
// 			hCost,
// 			fCost,
// 		};

// 		queue.push(newPath);

// 		// let low = 0;
// 		// let high = queue.length - 1;

// 		// while (low <= high) {
// 		// 	const mid = Math.floor((low + high) / 2);
// 		// 	const midItem = queue[mid];

// 		// 	if (newPath.fCost < midItem.fCost) {
// 		// 		high = mid - 1;
// 		// 	} else if (newPath.fCost > midItem.fCost) {
// 		// 		low = mid + 1;
// 		// 	} else {
// 		// 		// If equal, insert after the equal element (maintaining stable order)
// 		// 		low = mid + 1;
// 		// 	}
// 		// }

// 		// // Insert newPath at the correct position
// 		// queue.splice(low, 0, newPath);
// 	}

// 	throw Error("No Path Found");
// }

//Run
solveB("input", "22");

interface Path {
	pos: Point;
	torch: boolean;
	climbingGear: boolean;
	gCost: number;
	hCost: number;
	fCost: number;
	changes: number;
}

function findPath2(depth: number, target: Point): number {
	const seen: Set<string> = new Set();
	const queue: Path[] = [
		{
			pos: { x: 0, y: 0 },
			torch: true,
			climbingGear: false,
			gCost: 0,
			hCost: heuristic({ x: 0, y: 0 }),
			fCost: heuristic({ x: 0, y: 0 }),
			changes: 0,
		},
	];

	while (queue.length) {
		const current = queue.shift()!;

		if (current.hCost === 0) {
			if (!current.torch) {
				current.gCost += 7;
			}
			console.log(current);
			return current.gCost;
		}

		if (seen.has(`${current.pos.x},${current.pos.y}`)) {
			continue;
		} else {
			seen.add(`${current.pos.x},${current.pos.y}`);
		}
		// cave.delete(`${current.pos.x},${current.pos.y}`);

		for (let region of getAdjacentRegion(current.pos)) {
			if (region.type === "Rocky") {
				if (!current.torch && !current.climbingGear) {
					addToQueue(current, region, 7, true, false);
					addToQueue(current, region, 7, false, true);
				} else {
					addToQueue(current, region, 1, current.torch, current.climbingGear);
				}
			}

			if (region.type === "Wet") {
				if (current.torch) {
					addToQueue(current, region, 7, false, false);
					addToQueue(current, region, 7, false, true);
				} else {
					addToQueue(current, region, 1, current.torch, current.climbingGear);
				}
			}

			if (region.type === "Narrow") {
				if (current.climbingGear) {
					addToQueue(current, region, 7, false, false);
					addToQueue(current, region, 7, true, false);
				} else {
					addToQueue(current, region, 1, current.torch, current.climbingGear);
				}
			}
		}

		// console.log(queue.length, seen.size);
		queue.sort((a, b) => a.fCost - b.fCost);
	}

	function getAdjacentRegion(pos: Point): Region[] {
		const regions: Region[] = [];

		for (let [nx, ny] of [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
		]) {
			const [x, y] = [nx + pos.x, ny + pos.y];
			const key = `${x},${y}`;

			if (x < 0 || y < 0 || x > target.x * 5 || y > target.y || seen.has(key)) {
				continue;
			} else {
				regions.push(getRegionType({ x, y }, depth));
			}
		}

		return regions;
	}
	function heuristic(pos: Point): number {
		return TOOLS.manhattanDistance(pos, target);
	}
	function addToQueue(
		current: Path,
		region: Region,
		gValue: number,
		torch: boolean,
		climbingGear: boolean
	) {
		const gCost = current.gCost + gValue;
		const hCost = heuristic(region.pos);
		const fCost = gCost + hCost;

		const newPath: Path = {
			pos: region.pos,
			torch,
			climbingGear,
			gCost,
			hCost,
			fCost,
			changes: current.changes + (gValue === 7 ? 1 : 0),
		};

		queue.push(newPath);

		// let low = 0;
		// let high = queue.length - 1;

		// while (low <= high) {
		// 	const mid = Math.floor((low + high) / 2);
		// 	const midItem = queue[mid];

		// 	if (newPath.fCost < midItem.fCost) {
		// 		high = mid - 1;
		// 	} else if (newPath.fCost > midItem.fCost) {
		// 		low = mid + 1;
		// 	} else {
		// 		// If equal, insert after the equal element (maintaining stable order)
		// 		low = mid + 1;
		// 	}
		// }

		// // Insert newPath at the correct position
		// queue.splice(low, 0, newPath);
	}

	throw Error("No Path Found");
}
