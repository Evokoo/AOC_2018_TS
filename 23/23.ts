// Imports
import { BinaryHeap } from "@std/data-structures";
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
	return optimalLocation(getInitialSearchSpace(nanobots), nanobots);
}

type XYZ = { x: number; y: number; z: number };
type Nanobot = { id: number; pos: XYZ; radius: number };
type SearchSpace = { min: XYZ; max: XYZ; count: number; volume: number };

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
function optimalLocation(space: SearchSpace, nanobots: Nanobot[]) {
	const queue: BinaryHeap<SearchSpace> = new BinaryHeap(
		(a, b) => b.count - a.count
	);

	queue.push(space);

	let divison = 128;

	while (queue.length) {
		const { min, max, count, volume } = queue.pop()!;

		console.log(divison);

		if (volume <= 1) {
			return searchSpace({ min, max, count, volume }, nanobots)[0][2];
		}

		const xIncrement = Math.max(
			1,
			Math.floor(Math.abs(max.x - min.x) / divison)
		);
		const yIncrement = Math.max(
			1,
			Math.floor(Math.abs(max.y - min.y) / divison)
		);
		const zIncrement = Math.max(
			1,
			Math.floor(Math.abs(max.z - min.z) / divison)
		);

		const currentRound: BinaryHeap<SearchSpace> = new BinaryHeap(
			(a, b) => b.count - a.count
		);

		for (let x = min.x; x < max.x; x += xIncrement) {
			for (let y = min.y; y < max.y; y += yIncrement) {
				for (let z = min.z; z < max.z; z += zIncrement) {
					const newMin = { x, y, z };
					const newMax = {
						x: Math.min(x + xIncrement, max.x),
						y: Math.min(y + yIncrement, max.y),
						z: Math.min(z + zIncrement, max.z),
					};

					const centerX = x + Math.floor(xIncrement / 2);
					const centerY = y + Math.floor(yIncrement / 2);
					const centerZ = z + Math.floor(zIncrement / 2);

					const count = inRange(centerX, centerY, centerZ, nanobots);
					const volume = getSearchVolume(newMin, newMax);

					if (count < (currentRound.peek()?.count ?? 0)) {
						continue;
					}

					currentRound.push({
						min: newMin,
						max: newMax,
						count,
						volume,
					});
				}
			}
		}

		queue.push(currentRound.pop()!);

		divison = Math.max(2, divison / 2);
	}

	throw Error("Point not found");
}
function getSearchVolume(min: XYZ, max: XYZ): number {
	const w = Math.max(1, Math.abs(max.x - min.x));
	const h = Math.max(1, Math.abs(max.y - min.y));
	const d = Math.max(1, Math.abs(max.z - min.z));

	return w * h * d;
}
function searchSpace({ min, max }: SearchSpace, nanobots: Nanobot[]) {
	const points: [XYZ, number, number][] = [];

	for (let x = min.x; x <= max.x; x++) {
		for (let y = min.y; y <= max.y; y++) {
			for (let z = min.z; z <= max.z; z++) {
				const botCount = inRange(x, y, z, nanobots);
				const distance = TOOLS.manhattanDistance(
					{ x: 0, y: 0, z: 0 },
					{ x, y, z }
				);

				points.push([{ x, y, z }, botCount, distance]);
			}
		}
	}

	return points.sort((a, b) => b[1] - a[1] || a[2] - b[2]);
}
function getInitialSearchSpace(nanobots: Nanobot[]): SearchSpace {
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

	return {
		max: max,
		min: min,
		count: 0,
		volume: getSearchVolume(min, max),
	};
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
