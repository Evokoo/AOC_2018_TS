// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	const lights = parseInput(data);
	runSimulation(lights);
	return "";
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type Point = { x: number; y: number };
type Light = { pos: Point; vel: Point };
type PointMap = Map<number, number[]>;
type Dimensions = { max: Point; min: Point };

// Functions
function parseInput(data: string): Light[] {
	const lights: Light[] = [];

	for (const line of data.split("\n")) {
		const [px, py, vx, vy] = (line.match(/-*\d+/g) || []).map(Number);
		lights.push({
			pos: { x: px, y: py },
			vel: { x: vx, y: vy },
		});
	}

	return lights;
}

function runSimulation(lights: Light[]) {
	for (let i = 1; true; i++) {
		const dimensions: Dimensions = {
			min: { x: Infinity, y: Infinity },
			max: { x: -Infinity, y: -Infinity },
		};
		const points: PointMap = new Map();

		lights.forEach(({ pos, vel }) => {
			const [nx, ny] = [pos.x + vel.x * i, pos.y + vel.y * i];

			dimensions.min.x = Math.min(dimensions.min.x, nx);
			dimensions.min.y = Math.min(dimensions.min.y, ny);
			dimensions.max.x = Math.max(dimensions.max.x, nx);
			dimensions.max.y = Math.max(dimensions.max.y, ny);

			points.set(nx, [...(points.get(nx) ?? []), ny].sort());
		});

		if (isText(points, dimensions)) {
			printGrid(points, dimensions);
			console.log({ second: i });
			break;
		}
	}
}

//Wouldn't work if last letter was L
function isText(points: PointMap, dimensions: Dimensions): boolean {
	const lEdge = points.get(dimensions.min.x)!;
	const rEdge = points.get(dimensions.max.x)!;

	return (
		(lEdge.at(0) === dimensions.min.y && lEdge.at(-1) === dimensions.max.y) ||
		(rEdge.at(0) === dimensions.min.y && rEdge.at(-1) === dimensions.max.y)
	);
}
function printGrid(points: PointMap, dimensions: Dimensions): void {
	const min = dimensions.min;
	const max = dimensions.max;
	const offsetY = min.y < 0 ? Math.abs(min.y) : -min.y;
	const offsetX = min.x < 0 ? Math.abs(min.x) : -min.x;

	const grid = Array.from({ length: max.y + offsetY + 1 }, () =>
		Array.from({ length: max.x + offsetX + 1 }, () => ".")
	);

	for (const [x, yArr] of [...points]) {
		for (const y of yArr) {
			grid[y + offsetY][x + offsetX] = "#";
		}
	}

	const output = grid.map((row) => row.join("")).join("\n");

	console.log(output + "\n");
}
