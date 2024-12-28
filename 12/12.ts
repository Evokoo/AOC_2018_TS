// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const plantData = parseInput(data);
	return simulatePlants(plantData, 20);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const plantData = parseInput(data);
	return simulatePlants(plantData, 1000);
}

type PlantData = { plants: Set<number>; notes: Map<string, string> };

// Functions
function parseInput(data: string): PlantData {
	const sections = data.split("\n\n");
	const initialState = sections[0].split(": ")[1];
	const plants: Set<number> = new Set();
	const notes: Map<string, string> = new Map();

	for (let i = 0; i < initialState.length; i++) {
		if (initialState[i] === "#") plants.add(i);
	}

	for (const line of sections[1].split("\n")) {
		const [key, _, value] = line.split(" ");
		notes.set(key, value);
	}

	return { plants, notes };
}

function simulatePlants({ plants, notes }: PlantData, generations: number) {
	let currentState: Set<number> = plants;

	for (let i = 0; i < generations; i++) {
		const nextState: Set<number> = new Set();

		for (const plant of currentState) {
			const patterns = [
				{ indices: [-4, -3, -2, -1, 0], offset: -2 },
				{ indices: [-3, -2, -1, 0, 1], offset: -1 },
				{ indices: [-2, -1, 0, 1, 2], offset: 0 },
				{ indices: [-1, 0, 1, 2, 3], offset: 1 },
				{ indices: [0, 1, 2, 3, 4], offset: 2 },
			];

			for (const { indices, offset } of patterns) {
				const pattern = indices
					.map((n) => (currentState.has(plant + n) ? "#" : "."))
					.join("");

				if (notes.has(pattern) && notes.get(pattern) === "#") {
					nextState.add(plant + offset);
				}
			}
		}

		if (printState(currentState) === printState(nextState)) {
			const nextScore = getScore(nextState);
			const currentScore = getScore(currentState);
			const difference = nextScore - currentScore;
			return (50000000000 - (i + 1)) * difference + nextScore;
		}

		currentState = nextState;
	}

	return getScore(currentState);
}
function getScore(state: Set<number>): number {
	return [...state].reduce((acc, cur) => acc + cur, 0);
}
function printState(state: Set<number>): string {
	const indcies = [...state];
	const max = Math.max(...indcies);
	const min = Math.min(...indcies);

	let plants = "";

	for (let i = min; i < max; i++) {
		plants += state.has(i) ? "#" : ".";
	}

	return plants;
}
