// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const battlefield = parseInput(data);
	// return simulateBattle(battlefield);
	return -1;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type Walls = Map<number, Set<number>>;
type Point = { x: number; y: number };
type Unit = {
	type: string;
	pos: Point;
	hp: number;
	attack: number;
};

interface Battlefield {
	units: Unit[];
	walls: Walls;
}
type State = {
	pos: Point;
	steps: number;
	path: Point[];
};

type Target = {
	index: number;
	unit: Unit;
};

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
						pos: { x, y },
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

function simulateBattle({ units, walls }: Battlefield): number {
	let currentState: Unit[] = structuredClone(units);

	for (let i = 0; i < 1; i++) {
		const activeUnits: Unit[] = currentState.filter((unit) => unit.hp > 0);

		for (const [index, unit] of activeUnits.entries()) {
			//Movement Stage
			// const move: State = BFS(unit, { units: currentState, walls });
			if (unit.type === "G") continue;

			console.log(unit);
			console.log(dijkstra(unit, { units: currentState, walls }));

			// if (move && move.path.length) {
			// 	currentState[index].pos = move.path[0];
			// }

			//Attack Stage
			// const target = getTarget(unit, currentState);

			// if (target) {
			// 	currentState[target.index].hp -= unit.attack;
			// }

			//Remove fallen
			// currentState = currentState.filter((unit) => unit.hp > 0);
		}

		// if (!activeBattle(currentState)) {
		// 	// console.log(currentState);

		// 	console.log(`After ${i} rounds the battle is complete`);
		// 	return getBattleScore(currentState, i);
		// }
	}

	throw Error("Battle outcome not found");
}

function getBattleScore(units: Unit[], round: number) {
	const unitScore = units.reduce((acc, cur) => acc + cur.hp, 0);
	return unitScore * round;
}
function BFS(origin: Unit, { units, walls }: Battlefield) {
	const queue: State[] = [{ pos: origin.pos, steps: 0, path: [] }];
	const targets: State[] = [];
	const visited: Set<string> = new Set();

	while (queue.length) {
		const current = queue.shift()!;
		const coord = `${current.pos.x},${current.pos.y}`;

		if (visited.has(coord)) {
			continue;
		} else {
			visited.add(coord);
		}

		for (const [dx, dy] of [
			[0, 1],
			[0, -1],
			[1, 0],
			[-1, 0],
		]) {
			const [nx, ny] = [dx + current.pos.x, dy + current.pos.y];

			if (walls.get(ny)!.has(nx)) {
				continue;
			}

			const isUnit = units.find(
				(unit) => unit.pos.x === nx && unit.pos.y === ny
			);

			if (isUnit) {
				if (isUnit.type === origin.type) continue;
				targets.push(current);
			} else {
				queue.push({
					pos: { x: nx, y: ny },
					steps: current.steps + 1,
					path: [...current.path, { x: nx, y: ny }],
				});
			}
		}
	}

	return targets.sort(
		(a, b) => a.steps - b.steps || a.pos.y - b.pos.y || a.pos.x - b.pos.x
	)[0];
}
function getTarget(origin: Unit, units: Unit[]): Target {
	const targets: Target[] = [];

	for (const [index, unit] of units.entries()) {
		if (unit.type === origin.type || unit.hp < 0) continue;

		if (unit.pos.x === origin.pos.x + 1 && unit.pos.y === origin.pos.y) {
			targets.push({ index, unit });
		}

		if (unit.pos.x === origin.pos.x - 1 && unit.pos.y === origin.pos.y) {
			targets.push({ index, unit });
		}

		if (unit.pos.x === origin.pos.x && unit.pos.y === origin.pos.y + 1) {
			targets.push({ index, unit });
		}

		if (unit.pos.x === origin.pos.x && unit.pos.y === origin.pos.y - 1) {
			targets.push({ index, unit });
		}
	}

	return targets.sort(
		(a, b) => a.unit.hp - b.unit.hp || sortByLocation(a.unit.pos, b.unit.pos)
	)[0];
}
function sortByLocation(a: Point, b: Point) {
	return a.y - b.y || a.x - b.x;
}
function activeBattle(units: Unit[]): boolean {
	let elfCount = 0;
	let goblinCount = 0;

	for (const { type } of units) {
		if (type === "E") elfCount++;
		if (type === "G") goblinCount++;

		if (elfCount > 0 && goblinCount > 0) {
			return true;
		}
	}

	return false;
}

function dijkstra(origin: Unit, { units, walls }: Battlefield): Point {
	const queue: State[] = [{ pos: origin.pos, steps: 0, path: [] }];
	const visited: Set<string> = new Set();

	while (queue.length) {
		const current = queue.shift()!;
		const coord = `${current.pos.x},${current.pos.y}`;

		if (visited.has(coord)) {
			continue;
		} else {
			visited.add(coord);
		}

		for (const [dx, dy] of [
			[0, 1],
			[0, -1],
			[1, 0],
			[-1, 0],
		]) {
			const [nx, ny] = [dx + current.pos.x, dy + current.pos.y];

			if (walls.get(ny)!.has(nx)) {
				continue;
			}

			const isUnit = units.find(
				(unit) => unit.pos.x === nx && unit.pos.y === ny && unit.hp > 0
			);

			if (isUnit) {
				if (isUnit.type === origin.type) continue;
				return current.path[0] ?? origin.pos;
			} else {
				queue.push({
					pos: { x: nx, y: ny },
					steps: current.steps + 1,
					path: [...current.path, { x: nx, y: ny }],
				});
			}
		}

		queue.sort((a, b) => a.steps - b.steps || sortByLocation(a.pos, b.pos));
	}

	return origin.pos;
}
