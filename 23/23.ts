// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const nanobots = parseInput(data);
	return countBotsInRange(nanobots);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type XYZ = { x: number; y: number; z: number };
type Nanobot = { id: number; pos: XYZ; radius: number };

// Functions
function parseInput(data: string): Nanobot[] {
	const nanobots: Nanobot[] = [];

	for (const line of data.split("\n")) {
		const [x, y, z, r] = (line.match(/-*\d+/g) || []).map(Number);
		nanobots.push({ id: nanobots.length, pos: { x, y, z }, radius: r });
	}

	return nanobots.sort((a, b) => b.radius - a.radius);
}
function countBotsInRange(nanobots: Nanobot[]): number {
	const origin = nanobots[0];
	let count = 0;

	for (const target of nanobots) {
		const distance = TOOLS.manhattanDistance(origin.pos, target.pos);

		if (distance <= origin.radius) {
			count++;
		}
	}

	return count;
}
