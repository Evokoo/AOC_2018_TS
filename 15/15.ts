// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const battlefield = parseInput(data);
	return simulateBattle(battlefield);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const battlefield = parseInput(data);

	let power = 4;
	let result = 0;

	while (result === 0) {
		result = simulateBattle(battlefield, power);
		power++;
	}

	return result;
}

type Walls = Map<number, Set<number>>;
type Point = { x: number; y: number };
type Unit = {
	id: number;
	type: string;
	pos: Point;
	hp: number;
	attack: number;
	active: boolean;
};
type State = {
	pos: Point;
	steps: number;
	path: Point[];
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
						id: units.length,
						type: tile,
						pos: { x, y },
						hp: 200,
						attack: 3,
						active: true,
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
function simulateBattle(
	{ units, walls }: Battlefield,
	attackPower?: number
): number {
	let currentState: Unit[] = structuredClone(units);

	if (attackPower) {
		currentState = currentState.map((unit) =>
			unit.type === "E" ? { ...unit, attack: attackPower } : unit
		);
	}

	for (let i = 0; i < 1000; i++) {
		const activeUnits: Unit[] = currentState;

		for (const unit of activeUnits) {
			// Skip dead units
			if (!unit.active) continue;

			// Movement Stage //
			const currentUnitIndex = activeUnits.findIndex(
				({ id }) => id === unit.id
			);
			const nextPosition: Point = getNextPosition(unit, {
				units: activeUnits,
				walls,
			});

			//Update current unit position
			activeUnits[currentUnitIndex].pos = nextPosition;

			// Attack Stage //
			const targetID = getTargetId(unit, activeUnits);

			//Attack if valid id
			if (targetID !== -1) {
				const targetIndex = activeUnits.findIndex(({ id }) => id === targetID);
				activeUnits[targetIndex].hp -= unit.attack;

				if (activeUnits[targetIndex].hp <= 0) {
					if (attackPower && activeUnits[targetIndex].type === "E") {
						return 0;
					} else {
						activeUnits[targetIndex].active = false;
					}
				}
			}
		}

		//Update battle state
		currentState = activeUnits
			.filter((unit) => unit.active) // Remove dead units
			.sort((a, b) => sortByLocation(a.pos, b.pos)); // Sort units by location

		if (!activeBattle(activeUnits)) {
			console.log(`After ${i} rounds the battle is complete`);
			return getBattleScore(currentState, i);
		}
	}

	throw Error("Winner not found");
}
function getBattleScore(units: Unit[], round: number) {
	return units.reduce((acc, cur) => acc + cur.hp, 0) * round;
}
function getTargetId(origin: Unit, units: Unit[]): number {
	const targets: Unit[] = [];

	for (const unit of units) {
		if (unit.type === origin.type || !unit.active) continue;

		if (unit.pos.x === origin.pos.x + 1 && unit.pos.y === origin.pos.y) {
			targets.push(unit);
		}

		if (unit.pos.x === origin.pos.x - 1 && unit.pos.y === origin.pos.y) {
			targets.push(unit);
		}

		if (unit.pos.x === origin.pos.x && unit.pos.y === origin.pos.y + 1) {
			targets.push(unit);
		}

		if (unit.pos.x === origin.pos.x && unit.pos.y === origin.pos.y - 1) {
			targets.push(unit);
		}
	}

	if (targets.length) {
		return targets.sort(
			(a, b) => a.hp - b.hp || sortByLocation(a.pos, b.pos)
		)[0].id;
	} else {
		return -1;
	}
}
function sortByLocation(a: Point, b: Point): number {
	return a.y - b.y || a.x - b.x;
}
function activeBattle(units: Unit[]): boolean {
	const count: number[] = [0, 0];

	for (const { type, active } of units) {
		if (type === "E" && active) count[0]++;
		if (type === "G" && active) count[1]++;

		if (count[0] > 0 && count[1] > 0) {
			return true;
		}
	}
	return false;
}
function getNextPosition(origin: Unit, { units, walls }: Battlefield): Point {
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
				(unit) => unit.pos.x === nx && unit.pos.y === ny && unit.active
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

// function printGrid(units: Unit[], walls: Walls): string {
// 	const grid: string[][] = Array.from({ length: 7 }, () =>
// 		Array.from({ length: 7 }, () => ".")
// 	);

// 	for (const [y, xArray] of walls) {
// 		for (const x of xArray) {
// 			grid[y][x] = "#";
// 		}
// 	}

// 	for (const { pos, type, id } of units) {
// 		grid[pos.y][pos.x] = String(id);
// 	}

// 	return grid.map((row) => row.join("")).join("\n") + "\n";
// }
