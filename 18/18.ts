// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ grid, max } = parseInput(data),
		resourceValue = runSimulation(grid, max, 10);

	return resourceValue;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ grid, max } = parseInput(data),
		resourceValue = runSimulation(grid, max, 600, true);

	return resourceValue;
}

//Run
solveB("example_b", "18");

// Functions
type Point = { x: number; y: number };

function parseInput(data: string): { grid: string[][]; max: Point } {
	const rows = data.split("\r\n");
	const max = { x: rows[0].length, y: rows.length };

	return {
		grid: rows.map((row) => [...row]),
		max,
	};
}
function getNewTile(point: Point, grid: string[][], max: Point) {
	const count = { ".": 0, "|": 0, "#": 0 };
	const current = grid[point.y][point.x];

	for (let [nx, ny] of [
		[-1, -1],
		[0, -1],
		[1, -1],
		[-1, 0],
		[1, 0],
		[-1, 1],
		[0, 1],
		[1, 1],
	]) {
		const [x, y] = [point.x + nx, point.y + ny];

		if (x < 0 || x >= max.x || y < 0 || y >= max.y) continue;

		switch (grid[y][x]) {
			case ".":
				count["."]++;
				break;
			case "|":
				count["|"]++;
				break;
			case "#":
				count["#"]++;
				break;
			default:
				throw Error("Invalid Tile");
		}
	}

	if (current === ".") return count["|"] >= 3 ? "|" : current;
	if (current === "|") return count["#"] >= 3 ? "#" : current;
	if (current === "#") return count["#"] >= 1 && count["|"] >= 1 ? "#" : ".";

	throw Error("No condition met");
}
function getResourceValue(grid: string[][], max: Point) {
	let lumber = 0;
	let yards = 0;

	for (let y = 0; y < max.y; y++) {
		for (let x = 0; x < max.x; x++) {
			switch (grid[y][x]) {
				case "|":
					lumber++;
					break;
				case "#":
					yards++;
					break;
				case ".":
					break;
				default:
					throw Error("Invalid Tile");
			}
		}
	}

	return lumber * yards;
}
function runSimulation(
	grid: string[][],
	max: Point,
	cycles: number,
	partB: boolean = false
) {
	const updates: Map<string, string> = new Map();
	const resourceCycle: number[] = [];

	for (let cycle = 0; cycle < cycles; cycle++) {
		// Check Grid
		for (let y = 0; y < max.y; y++) {
			for (let x = 0; x < max.x; x++) {
				const currentTile = grid[y][x];
				const newTile = getNewTile({ x, y }, grid, max);

				if (currentTile === newTile) {
					continue;
				} else {
					updates.set(JSON.stringify({ x, y }), newTile);
				}
			}
		}

		//Update Grid
		updates.forEach((tile, location) => {
			const { x, y } = JSON.parse(location);
			grid[y][x] = tile;
		});

		updates.clear();

		if (partB) {
			resourceCycle.push(getResourceValue(grid, max));
		}
	}

	return partB
		? TOOLS.nthInteration(resourceCycle, 1000000000)
		: getResourceValue(grid, max);
}

//Debug
function printGrid(grid: string[][]): void {
	const ascii = grid.map((row) => row.join("")).join("\n");

	console.log(ascii);
}
