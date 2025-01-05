// Imports
import { BinaryHeap } from "@std/data-structures";
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const forces = parseInput(data);
	return simulateBattle(forces);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type Unit = {
	id: number;
	unitCount: number;
	hp: number;
	attack: number;
	attackType: string;
	initiative: number;
	effectivePower: number;
	weakTo: Set<string>;
	immuneTo: Set<string>;
	side: number;
};

type Forces = Map<number, Unit>;

// Functions
function parseInput(data: string): Forces {
	const sections = data
		.split("\n\n")
		.map((section) => section.split("\n").slice(1));

	const forces: Forces = new Map();

	for (let i = 0; i < sections.length; i++) {
		for (const line of sections[i]) {
			const weakTo: Set<string> = new Set();
			const immuneTo: Set<string> = new Set();
			const [unitCount, health, attack, attackType, initiative] =
				line.match(/\d+|\w+(?=\sdamage)/g) || [];

			for (const s of (line.match(/(?<=\().+(?=\))/) || [""])[0].split(";")) {
				if (s.trim().startsWith("weak")) {
					for (const weakness of s.split("weak to")[1].match(/\w+/g) || []) {
						weakTo.add(weakness);
					}
				}
				if (s.trim().startsWith("immune")) {
					for (const immunity of s.split("immune to")[1].match(/\w+/g) || []) {
						immuneTo.add(immunity);
					}
				}
			}

			const unit: Unit = {
				id: forces.size,
				unitCount: Number(unitCount),
				hp: Number(health),
				attack: Number(attack),
				attackType,
				initiative: Number(initiative),
				effectivePower: Number(unitCount) * Number(attack),
				weakTo,
				immuneTo,
				side: i,
			};

			forces.set(forces.size, unit);
		}
	}

	return forces;
}
function simulateBattle(forces: Forces) {
	const targetMap: Map<number, Set<number>> = new Map();

	for (let i = 0; i < forces.size; i++) {
		const targets: Set<number> = new Set();
		const attacker = forces.get(i)!;

		for (let j = 0; j < forces.size; j++) {
			if (i === j) continue;
			const defending = forces.get(j)!;

			if (getDamage(attacker, defending) > 0) {
				targets.add(j);
			}
		}
		if (targets.size) {
			targetMap.set(i, targets);
		}
	}

	while (true) {
		//Target order
		const order = [...forces].sort(
			(a, b) =>
				b[1].effectivePower - a[1].effectivePower ||
				b[1].initiative - a[1].initiative
		);

		//Target Phase
		const battles: BinaryHeap<[number, number, number]> = new BinaryHeap(
			(a, b) => b[2] - a[2]
		);
		const engaged: Set<number> = new Set();

		for (const [id, unit] of order) {
			if (targetMap.has(id)) {
				const targets = [...targetMap.get(id)!]
					.map((id) => forces.get(id)!)
					.sort(
						(a, b) =>
							getDamage(unit, b) - getDamage(unit, a) ||
							b.effectivePower - a.effectivePower ||
							b.initiative - a.initiative
					);

				for (const target of targets) {
					if (target && !engaged.has(target.id)) {
						battles.push([id, target.id, unit.initiative]);
						engaged.add(target.id);
						break;
					}
				}
			}
		}

		while (battles.length) {
			const [a, d, _] = battles.pop()!;

			const attacking = forces.get(a);
			const defending = forces.get(d);

			if (attacking && defending) {
				const result = getBattleResult(attacking, defending);

				if (result === null) {
					forces.delete(d);
				} else {
					forces.set(d, result);
				}
			}
		}

		//Exit condition no groups remaining
		const armyScore: [number, number] = [0, 0];

		for (const [_, { side, unitCount }] of forces) {
			armyScore[side] += unitCount;
		}

		if (armyScore[0] === 0 || armyScore[1] === 0) {
			return Math.max(...armyScore);
		}
	}
}

function getDamage(attacking: Unit, defending: Unit): number {
	if (attacking.side === defending.side) return -Infinity;

	let damage = attacking.effectivePower;

	if (defending.immuneTo.has(attacking.attackType)) {
		damage *= 0;
	}
	if (defending.weakTo.has(attacking.attackType)) {
		damage *= 2;
	}

	return damage;
}
function getBattleResult(attacking: Unit, defending: Unit): Unit | null {
	const damage = getDamage(attacking, defending);
	const lost = Math.floor(damage / defending.hp);

	if (lost >= defending.unitCount) {
		return null;
	} else {
		const unitCount = defending.unitCount - lost;
		const effectivePower = unitCount * defending.attack;
		return { ...defending, unitCount, effectivePower };
	}
}
