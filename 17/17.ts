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
	const cave = parseInput(data);
	return simulateWater(cave, { x: 500, y: 0 }, true);
}

type Point = { x: number; y: number };
type Cave = {
	clay: Map<number, Set<number>>;
	limits: {
		x: { min: number; max: number };
		y: { min: number; max: number };
	};
};

// Functions
function parseInput(data: string): Cave {
	const clay: Map<number, Set<number>> = new Map();
	const yLimits = { min: Infinity, max: -Infinity };
	const xLimits = { min: Infinity, max: -Infinity };

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

		yLimits.max = Math.max(yLimits.max, yRange.max);
		yLimits.min = Math.min(yLimits.min, yRange.min);
		xLimits.max = Math.max(xLimits.max, xRange.max);
		xLimits.min = Math.min(xLimits.min, xRange.min);

		for (let x = xRange.min; x <= xRange.max; x++) {
			const yValues = clay.get(x) ?? new Set();

			for (let y = yRange.min; y <= yRange.max; y++) {
				yValues.add(y);
			}

			clay.set(x, yValues);
		}
	}

	return { clay, limits: { x: xLimits, y: yLimits } };
}

function simulateWater(
	{ clay, limits }: Cave,
	spring: Point,
	staticWater: boolean = false
) {
	const queue: Point[] = [];
	const pool: Map<number, Set<number>> = new Map();
	const flow: Map<number, Set<number>> = new Map();

	// Initialize queue
	queue.push(verticalFlow(spring));

	while (queue.length) {
		const { x, y } = queue.pop()!;

		if (y <= limits.y.min || y >= limits.y.max) {
			continue;
		} else {
			horizontalFlow({ x, y });
		}
	}

	const total: Set<string> = new Set();
	const pooled: Set<string> = new Set();

	for (const [x, yValues] of flow) {
		for (const y of yValues) {
			total.add(`${x},${y}`);
		}
	}
	for (const [x, yValues] of pool) {
		for (const y of yValues) {
			total.add(`${x},${y}`);
			pooled.add(`${x}${y}`);
		}
	}

	return staticWater ? pooled.size : total.size;

	function verticalFlow({ x, y }: Point): Point {
		const clayColumn = clay.get(x) ?? new Set();
		const poolColumn = pool.get(x) ?? new Set();
		const flowColumn = flow.get(x) ?? new Set();

		let row = y;

		while (
			!clayColumn.has(row + 1) &&
			!poolColumn.has(row + 1) &&
			row + 1 <= limits.y.max
		) {
			row++;

			if (row >= limits.y.min) {
				flowColumn.add(row);
			}
		}

		flow.set(x, flowColumn);

		return { x, y: row };
	}
	function horizontalFlow({ x, y }: Point): void {
		const left = { index: x, wall: false };
		const right = { index: x, wall: false };

		while (
			clay.get(left.index)?.has(y + 1) ||
			pool.get(left.index)?.has(y + 1)
		) {
			if (clay.get(left.index - 1)?.has(y)) {
				left.wall = true;
				break;
			}

			left.index--;
		}

		while (
			clay.get(right.index)?.has(y + 1) ||
			pool.get(right.index)?.has(y + 1)
		) {
			if (clay.get(right.index + 1)?.has(y)) {
				right.wall = true;
				break;
			}

			right.index++;
		}

		if (left.wall && right.wall) {
			for (let i = left.index; i <= right.index; i++) {
				const poolColumn = pool.get(i) ?? new Set();
				poolColumn.add(y);
				pool.set(i, poolColumn);
			}

			queue.push({ x, y: y - 1 });
		} else {
			for (let i = left.index; i <= right.index; i++) {
				const flowColumn = flow.get(i) ?? new Set();
				flowColumn.add(y);
				flow.set(i, flowColumn);
			}

			if (!left.wall) {
				queue.push(verticalFlow({ x: left.index, y }));
			}
			if (!right.wall) {
				queue.push(verticalFlow({ x: right.index, y }));
			}
		}
	}
}
