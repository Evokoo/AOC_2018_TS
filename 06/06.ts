// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid = parseInput(data);
	return Math.max(...areaMap(grid));
}
export function solveB(fileName: string, day: string, range: number): number {
	const data = TOOLS.readData(fileName, day);
	const grid = parseInput(data);
	return safeZone(grid, range);
}

type Point = { x: number; y: number };
type Coordinate = Point & { id: number; infinte: boolean };

interface Grid {
	coordinates: Coordinate[];
	min: Point;
	max: Point;
}

// Functions
function parseInput(data: string): Grid {
	const coordinates: Coordinate[] = [];
	const min: Point = { x: Infinity, y: Infinity };
	const max: Point = { x: -Infinity, y: -Infinity };

	for (const [index, line] of data.split("\n").entries()) {
		const [x, y] = line.split(", ").map(Number);

		min.x = Math.min(x, min.x);
		min.y = Math.min(y, min.y);
		max.x = Math.max(x, max.x);
		max.y = Math.max(y, max.y);

		coordinates.push({ id: index, x, y, infinte: false });
	}

	return { coordinates, min, max };
}
function areaMap({ coordinates, min, max }: Grid): number[] {
	function isClosest(origin: Coordinate, destination: Point): boolean {
		const originDistance = TOOLS.manhattanDistance(
			{ x: origin.x, y: origin.y },
			destination
		);

		for (const { id, x, y } of coordinates) {
			if (id === origin.id) continue;

			const distance = TOOLS.manhattanDistance({ x, y }, destination);

			if (distance <= originDistance) {
				return false;
			}
		}

		return true;
	}

	function BFS(origin: Coordinate) {
		const queue: Point[] = [{ x: origin.x, y: origin.y }];
		const seen: Set<string> = new Set();

		while (queue.length) {
			const { x, y } = queue.pop()!;
			const coord = `${x},${y}`;

			if (x < min.x || x > max.x || y < min.y || y > max.y) {
				return 0;
			}

			if (seen.has(coord)) {
				continue;
			} else {
				seen.add(coord);
			}

			for (const [dx, dy] of [
				[0, 1],
				[1, 0],
				[-1, 0],
				[0, -1],
				[1, 1],
				[1, -1],
				[-1, 1],
				[-1, -1],
			]) {
				const [nx, ny] = [dx + x, dy + y];

				if (isClosest(origin, { x: nx, y: ny })) {
					queue.push({ x: nx, y: ny });
				}
			}
		}

		return seen.size;
	}

	return coordinates.map((coordinate) => BFS(coordinate));
}
function safeZone({ coordinates, min, max }: Grid, range: number): number {
	const zone: Set<string> = new Set();

	for (let y = min.y; y < max.y; y++) {
		for (let x = min.x; x < max.x; x++) {
			const distanceSum: number = coordinates.reduce((acc, cur) => {
				acc += TOOLS.manhattanDistance({ x, y }, { x: cur.x, y: cur.y });
				return acc;
			}, 0);

			if (distanceSum < range) {
				zone.add(`${x},${y}`);
			}
		}
	}

	return zone.size;
}
