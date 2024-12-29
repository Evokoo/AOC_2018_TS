// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const battlefield = parseInput(data);
	return 0;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type Walls = Map<number, Set<number>>;
type Point = { x: number; y: number };
type Unit = {
	type: string;
	x: number;
	y: number;
	hp: number;
	attack: number;
};

interface Battlefield {
	units: Unit[];
	walls: Walls;
}

// Functions
function parseInput(data: string): Battlefield {
	const grid: string[] = data.split("\n");
	const walls: Map<number, Set<number>> = new Map();
	const units: Unit[] = [];

	for (let y = 0; y < grid.length; y++) {
		const rowWalls: Set<number> = new Set();

		for (let x = 0; x < grid[0].length; x++) {
			const tile = grid[y][x];

			switch (tile) {
				case "#":
					rowWalls.add(x);
					break;
				case "E":
				case "G":
					units.push({
						type: tile,
						x,
						y,
						hp: 200,
						attack: 3,
					});
					break;
				default:
					break;
			}
		}

		walls.set(y, rowWalls);
	}

	return { walls, units };
}
