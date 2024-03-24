// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		coordinates = parseInput(data),
		boundary = getBoundry(coordinates),
		areas = coordinates.map((coordinate) =>
			getArea(coordinate, coordinates, boundary)
		);

	return Math.max(...areas);
}
export function solveB(fileName: string, day: string, target: number): number {
	const data = TOOLS.readData(fileName, day),
		coordinates = parseInput(data),
		boundary = getBoundry(coordinates);

	return safeRegion(coordinates, boundary, target);
}

//Run
// solveB("example_b", "06", 32);

// Functions
type Point = { x: number; y: number };
type Coordinate = Point & { ID: number };
type Area = { ID: number; pos: Point; area: number };

function parseInput(data: string) {
	const coordinates: Coordinate[] = [];

	for (let [ID, point] of data.split("\r\n").entries()) {
		const [x, y] = point.split(",").map(Number);

		coordinates.push({ ID, x, y });
	}

	return coordinates;
}
function getArea(origin: Coordinate, allPoints: Coordinate[], boundary: Point) {
	const queue: Point[] = [{ x: origin.x, y: origin.y }];
	const seen: Set<string> = new Set();

	let area = 0;

	while (queue.length) {
		const current = queue.pop()!;

		if (
			current.x < 0 ||
			current.x > boundary.x ||
			current.y < 0 ||
			current.y > boundary.y
		) {
			return 0;
		}

		if (seen.has(JSON.stringify(current))) {
			continue;
		} else {
			seen.add(JSON.stringify(current));
			area++;
		}

		for (let [nx, ny] of [
			[0, 1],
			[1, 0],
			[-1, 0],
			[0, -1],
			[1, 1],
			[1, -1],
			[-1, 1],
			[-1, -1],
		]) {
			const [x, y] = [nx + current.x, ny + current.y];

			if (seen.has(JSON.stringify({ x, y }))) {
				continue;
			}

			if (isClosest(origin, { x, y }, allPoints)) {
				queue.push({ x, y });
			} else {
				continue;
			}
		}
	}

	return area;
}
function isClosest(
	origin: Coordinate,
	point: Point,
	coordinates: Coordinate[]
) {
	const targetDistance = TOOLS.manhattanDistance(
		{ x: origin.x, y: origin.y },
		point
	);

	for (const coordinate of coordinates) {
		const distance = TOOLS.manhattanDistance(
			{ x: coordinate.x, y: coordinate.y },
			point
		);

		if (coordinate.ID === origin.ID) {
			continue;
		}

		if (distance === targetDistance) {
			return false;
		}

		if (distance < targetDistance) {
			return false;
		}
	}

	return true;
}
function getBoundry(coordinates: Coordinate[]) {
	const max = { x: -Infinity, y: -Infinity };

	for (let coordinate of coordinates) {
		max.x = Math.max(coordinate.x, max.x);
		max.y = Math.max(coordinate.y, max.y);
	}

	return max;
}
function validPoint(point: Point, coordinates: Coordinate[], target: number) {
	const distance = coordinates.reduce(
		(acc, cur) => acc + TOOLS.manhattanDistance(point, { x: cur.x, y: cur.y }),
		0
	);

	return distance < target;
}
function safeRegion(
	coordinates: Coordinate[],
	boundary: Point,
	target: number
) {
	let safe = 0;

	for (let y = 0; y < boundary.y; y++) {
		for (let x = 0; x < boundary.x; x++) {
			if (validPoint({ x, y }, coordinates, target)) {
				safe++;
			}
		}
	}

	return safe;
}
