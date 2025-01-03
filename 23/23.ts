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
	const nanobots = parseInput(data);
	return optimalLocation(nanobots);
}

type XYZ = { x: number; y: number; z: number };
type Nanobot = { id: number; pos: XYZ; radius: number };
type Space = { min: XYZ; max: XYZ; range: XYZ };
type RandomPoint = XYZ & { count: number };

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
function optimalLocation(nanobots: Nanobot[]) {
	const { min, max, range } = getSpaceDimension(nanobots);

	function randomPoint() {
		const bestPoint = { x: 0, y: 0, z: 0, count: 0 };

		for (let i = 0; i < 10_000; i++) {
			const x = Math.floor(Math.random() * (max.x - min.x + 1)) + min.x;
			const y = Math.floor(Math.random() * (max.y - min.y + 1)) + min.y;
			const z = Math.floor(Math.random() * (max.z - min.z + 1)) + min.z;

			const count = inRange(x, y, z, nanobots);

			if (count > bestPoint.count) {
				bestPoint.x = x;
				bestPoint.y = y;
				bestPoint.z = z;
				bestPoint.count = count;
			}
		}

		return bestPoint;
	}

	console.log(randomPoint());

	return -1;
}

function getSpaceDimension(nanobots: Nanobot[]): Space {
	const min: XYZ = { x: Infinity, y: Infinity, z: Infinity };
	const max: XYZ = { x: -Infinity, y: -Infinity, z: -Infinity };

	for (const {
		pos: { x, y, z },
	} of nanobots) {
		min.x = Math.min(x, min.x);
		min.y = Math.min(y, min.y);
		min.z = Math.min(z, min.z);
		max.x = Math.max(x, max.x);
		max.y = Math.max(y, max.y);
		max.z = Math.max(z, max.z);
	}

	const range: XYZ = { x: max.x - min.x, y: max.y - min.y, z: max.z - min.z };

	return { min, max, range };
}
function inRange(x: number, y: number, z: number, nanobots: Nanobot[]): number {
	let count = 0;

	for (const target of nanobots) {
		const distance = TOOLS.manhattanDistance({ x, y, z }, target.pos);

		if (distance <= target.radius) {
			count++;
		}
	}

	return count;
}
