// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const cave = parseInput(data);
	return simulateWater(cave, { x: 500, y: 0 });
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type Point = { x: number; y: number };
type Cave = { clay: Map<number, Set<number>>; depth: number };
type Flow = Point & { direction?: string };

// Functions
function parseInput(data: string): Cave {
	const clay: Map<number, Set<number>> = new Map();
	let depth: number = 0;

	for (const line of data.split("\n")) {
		const xRange = { min: 0, max: 0 };
		const yRange = { min: 0, max: 0 };

		for (const section of line.split(", ")) {
			const values = (section.match(/\d+/g) || []).map(Number);

			if (section[0] === "x") {
				xRange.min = values[0];
				xRange.max = values[1] ?? values[0];
			} else {
				yRange.min = values[0];
				yRange.max = values[1] ?? values[0];
			}
		}

		depth = Math.max(depth, yRange.max);

		for (let x = xRange.min; x <= xRange.max; x++) {
			const yValues = clay.get(x) ?? new Set();

			for (let y = yRange.min; y <= yRange.max; y++) {
				yValues.add(y);
			}

			clay.set(x, yValues);
		}
	}

	return { clay, depth };
}

function simulateWater({ clay, depth }: Cave, spring: Point) {
	const queue: Point[] = [];
	const pool: Map<number, Set<number>> = new Map();
	const flowing: Map<number, Set<number>> = new Map();

	//Initialize queue
	verticalFlow(spring);

	while (queue.length) {
		const { x, y } = queue.pop()!;
		const clayColumn = clay.get(x);
		const poolColumn = pool.get(x);
		const flowColumn = flowing.get(x);

		if (clayColumn?.has(y + 1) || poolColumn?.has(y + 1)) {
			horizontalFlow({ x, y });
		} else if (flowColumn?.has(y + 1)) {
			flowColumn.add(y);
			flowing.set(x, flowColumn);
		}
	}

	let total: number = 0;

	for (const [_, yValues] of pool) {
		total += yValues.size;
	}

	for (const [_, yValues] of flowing) {
		total += yValues.size;
	}

	printGrid(15, clay, flowing, pool);

	return total - 1;

	// console.log({ total: pool.size + flowing.size });

	function verticalFlow({ x, y }: Point): void {
		for (let i = 0; i + y <= depth; i++) {
			if (clay.get(x)?.has(i + y)) {
				break;
			} else {
				queue.push({ x, y: y + i });
			}
		}
	}

	function horizontalFlow(origin: Point): void {
		const points: Flow[] = [origin];
		const visited: Map<number, Set<number>> = new Map();
		let isFlowing = false;

		while (points.length) {
			const { x, y, direction } = points.shift()!;
			const clayColumn = clay.get(x) ?? new Set();
			const poolColumn = pool.get(x) ?? new Set();
			const visitedColumn = visited.get(x) ?? new Set();

			if (clayColumn.has(y) || visitedColumn.has(y)) {
				continue;
			} else {
				visitedColumn.add(y);
				visited.set(x, visitedColumn);
			}

			if (clayColumn.has(y + 1) || poolColumn.has(y + 1)) {
				if (direction === ">") {
					points.push({ x: x + 1, y, direction });
				} else if (direction === "<") {
					points.push({ x: x - 1, y, direction });
				} else {
					points.push({ x: x + 1, y, direction: ">" });
					points.push({ x: x - 1, y, direction: "<" });
				}
			} else {
				verticalFlow({ x, y });
				isFlowing = true;
			}
		}

		for (const [x, yValues] of visited) {
			const xFlowing = flowing.get(x) ?? new Set();
			const xPool = pool.get(x) ?? new Set();

			for (const y of yValues) {
				if (isFlowing) {
					xFlowing.add(y);
					flowing.set(x, xFlowing);
				} else {
					xPool.add(y);
					pool.set(x, xPool);
				}
			}
		}
	}
}

function printGrid(
	size: number,
	clay: Map<number, Set<number>>,
	flowing: Map<number, Set<number>>,
	pool: Map<number, Set<number>>
): void {
	const grid = Array.from({ length: size }, () =>
		Array.from({ length: size }, () => ".")
	);

	for (const [x, yValues] of clay) {
		for (const y of yValues) {
			grid[y][x - 494] = "#";
		}
	}

	for (const [x, yValues] of flowing) {
		for (const y of yValues) {
			grid[y][x - 494] = "|";
		}
	}

	for (const [x, yValues] of pool) {
		for (const y of yValues) {
			grid[y][x - 494] = "~";
		}
	}

	const flatGrid = grid.map((row) => row.join("")).join("\n");

	console.log(flatGrid);
}
