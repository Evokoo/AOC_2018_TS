// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ environment, size } = parseInput(data);

	runSimulation({ x: 500, y: 0 }, environment, size);
	return 0;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

//Run
solveA("example_a", "17");

// Functions
type Size = { [axis: string]: { min: number; max: number } };
type Point = { x: number; y: number };

function parseInput(data: string) {
	const environment: Set<string> = new Set();
	const size: Size = {
		x: { min: Infinity, max: -Infinity },
		y: { min: Infinity, max: -Infinity },
	};

	for (let line of data.split("\r\n")) {
		const [_a, b, c] = line.match(/(?<=x=)(\d+)\.{0,2}(\d+)*/)!.map(Number);
		const [_d, e, f] = line.match(/(?<=y=)(\d+)\.{0,2}(\d+)*/)!.map(Number);

		if (c) {
			size.x.min = Math.min(size.x.min, b);
			size.x.max = Math.max(size.x.max, c);

			for (let i = b; i <= c; i++) {
				environment.add(JSON.stringify({ x: i, y: e }));
			}
		} else if (f) {
			size.y.min = Math.min(size.y.min, e);
			size.y.max = Math.max(size.y.max, f);

			for (let i = e; i <= f; i++) {
				environment.add(JSON.stringify({ x: b, y: i }));
			}
		} else {
			size.x.min = Math.min(size.x.min, b);
			size.x.max = Math.max(size.x.max, b);
			size.y.min = Math.min(size.y.min, e);
			size.y.max = Math.max(size.y.max, e);

			environment.add(JSON.stringify({ x: b, y: e }));
		}
	}

	return { environment, size };
}
function canDrop(point: Point, environment: Set<string>, water: Set<string>) {
	const next = JSON.stringify({ x: point.x, y: point.y + 1 });

	return environment.has(next) || water.has(next);
}

function runSimulation(start: Point, environment: Set<string>, size: Size) {
	const queue: Point[] = [start];
	const falling: Set<string> = new Set();
	const pooled: Set<string> = new Set();

	while (queue.length) {
		const dropping = [];
	}
}

//Debug
function drawGrid(points: Set<string>, size: Size) {
	const grid: string[][] = Array.from(
		{ length: size.y.max - size.y.min + 2 },
		() => {
			return Array.from({ length: size.x.max - size.x.min + 7 }, () => ".");
		}
	);

	for (let point of [...points]) {
		const { x, y } = JSON.parse(point);

		console.log({ x: x - size.x.min, y: y - size.y.min });
		grid[y - size.y.min + 1][x - size.x.min + 2] = "#";
	}

	const output = grid.map((row) => row.join("")).join("\n");

	console.log(output);
}
