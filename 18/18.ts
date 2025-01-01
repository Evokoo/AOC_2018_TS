// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return simulate(parseInput(data), 10);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return simulate(parseInput(data), 1000);
}

type Grid = { grid: string[][]; size: number };
type Update = { x: number; y: number; tile: string };

// Functions
function parseInput(data: string): Grid {
	const grid = data.split("\n").map((row) => [...row]);
	return { grid, size: grid.length };
}
function simulate({ grid, size }: Grid, time: number) {
	const resourcesValues: number[] = [];

	for (let minute = 0; minute < time; minute++) {
		const updates: Update[] = [];

		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				const update = tileUpdate(x, y);

				if (update !== null) {
					updates.push(update);
				}
			}
		}

		for (const { x, y, tile } of updates) {
			grid[y][x] = tile;
		}

		if (time > 10) {
			resourcesValues.push(getResourceValue());
		}
	}

	if (time > 10) {
		return TOOLS.nthIteration<number>(resourcesValues, 1000000000);
	} else {
		return getResourceValue();
	}

	function getResourceValue(): number {
		const resources: Record<string, number> = { "#": 0, "|": 0, ".": 0 };

		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				resources[grid[y][x]]++;
			}
		}
		return resources["#"] * resources["|"];
	}
	function tileUpdate(x: number, y: number): Update | null {
		const currentTile: string = grid[y][x];
		const neighbours: Record<string, number> = { tree: 0, yard: 0, open: 0 };

		for (const [dx, dy] of [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, -1],
			[0, 1],
			[1, -1],
			[1, 0],
			[1, 1],
		]) {
			const [nx, ny] = [dx + x, dy + y];

			if (nx < 0 || nx >= size || ny < 0 || ny >= size) {
				continue;
			} else {
				switch (grid[ny][nx]) {
					case "#":
						neighbours.yard++;
						break;
					case "|":
						neighbours.tree++;
						break;
					case ".":
						neighbours.open++;
						break;
					default:
						throw Error("Invalid tile");
				}
			}
		}

		if (currentTile === ".") {
			return neighbours.tree >= 3 ? { x, y, tile: "|" } : null;
		} else if (currentTile === "|") {
			return neighbours.yard >= 3 ? { x, y, tile: "#" } : null;
		} else if (currentTile === "#") {
			return neighbours.yard >= 1 && neighbours.tree >= 1
				? null
				: { x, y, tile: "." };
		}

		throw Error("Invalid tile");
	}
}
