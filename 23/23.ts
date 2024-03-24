// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		nanobots = parseInput(data),
		count = nanobotsInRange(nanobots);

	return count;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

//Run
solveA("input", "23");

// Functions

type Nanobot = { ID: number; x: number; y: number; z: number; radius: number };

function parseInput(data: string) {
	const nanobots: Nanobot[] = [];

	for (let [ID, bot] of data.split("\r\n").entries()) {
		const [x, y, z, radius] = (bot.match(/-*\d+/g) || []).map(Number);
		nanobots.push({ ID, x, y, z, radius });
	}

	return nanobots.sort((a, b) => b.radius - a.radius);
}
function nanobotsInRange(nanobots: Nanobot[]) {
	const origin = nanobots.shift()!;

	let count = 1;

	for (let bot of nanobots) {
		const distance = TOOLS.manhattanDistance(
			{ x: origin.x, y: origin.y, z: origin.z },
			{ x: bot.x, y: bot.y, z: bot.z }
		);

		if (distance <= origin.radius) count++;
	}

	return count;
}
