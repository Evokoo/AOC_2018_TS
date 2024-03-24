// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		lights = parseInput(data),
		{ gird } = simulateLights(lights);

	//Manually inspect image

	return 0;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		lights = parseInput(data),
		{ time } = simulateLights(lights);

	return time;
}

//Run
solveA("input", "10");

type Point = { x: number; y: number };
type Light = { pos: Point; vel: Point };

// Functions
function parseInput(data: string) {
	const lights: Light[] = [];

	for (let line of data.split("\r\n")) {
		const [px, py, vx, vy] = (line.match(/-*\d+/g) || []).map(Number);

		lights.push({
			pos: { x: px, y: py },
			vel: { x: vx, y: vy },
		});
	}

	return lights;
}
function simulateLights(lights: Light[]) {
	for (let i = 0; true; i++) {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		for (let l = 0; l < lights.length; l++) {
			const light = lights[l];

			light.pos.x += light.vel.x;
			light.pos.y += light.vel.y;

			lights[l] = light;

			minX = Math.min(minX, light.pos.x);
			minY = Math.min(minY, light.pos.y);
			maxX = Math.max(maxX, light.pos.x);
			maxY = Math.max(maxY, light.pos.y);
		}

		if (maxY - minY <= 9) {
			return { gird: drawGrid(lights, { x: minX, y: minY }), time: i + 1 };
		}
	}
}
function drawGrid(lights: Light[], offset: Point) {
	const grid: string[][] = Array.from({ length: 10 }, () =>
		Array.from({ length: 100 }, () => " ")
	);

	for (let { pos } of lights) {
		const [x, y] = [pos.x - offset.x, pos.y - offset.y];

		grid[y][x] = "#";
	}

	return grid.map((row) => row.join("")).join("\n");
}
