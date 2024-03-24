// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ notes, state } = parseInput(data),
		score = runSimulation(notes, state, 20);

	return score;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ notes, state } = parseInput(data),
		score = runSimulation(notes, state, 1000);

	console.log(score);

	return score;
}

//Run
solveB("input", "12");

// Functions
type Notes = Map<string, string>;
type State = Map<number, string>;

function parseInput(data: string) {
	const lines = data.split("\r\n");
	const notes: Notes = new Map();
	const state: State = new Map();

	for (let line of lines.slice(2)) {
		const [condition, result] = line.split(" => ");
		notes.set(condition, result);
	}

	for (let [index, char] of [...lines[0].split(" ")[2]].entries()) {
		if (char === "#") state.set(index, char);
	}

	return { notes, state };
}
function printState(state: State) {
	let output = "";

	for (let value of state.values()) {
		output += value;
	}

	return output.replace(/^\.*(?=#)|(?<=#)\.*$/g, "");
}
function getScore(state: State) {
	let score = 0;

	for (let [key, value] of state.entries()) {
		score += value === "#" ? key : 0;
	}

	return score;
}
function runSimulation(notes: Notes, state: State, generations: number) {
	const updates: State = new Map();

	let previousState = "";
	let previousScore = 0;

	for (let i = 0; i < generations; i++) {
		const stateArr = Array.from(state).map((entry) => entry[0]);
		const min = Math.min(...stateArr);
		const max = Math.max(...stateArr);

		for (let j = min - 5; j < max + 5; j++) {
			const LL = [state.get(j - 2) ?? ".", state.get(j - 1) ?? "."].join("");
			const C = state.get(j) ?? ".";
			const RR = [state.get(j + 1) ?? ".", state.get(j + 2) ?? "."].join("");

			updates.set(j, notes.get(LL + C + RR) ?? ".");
		}

		//Clear current state
		state.clear();

		//Set state based on updates
		for (let [index, char] of updates.entries()) {
			state.set(index, char);
		}

		//Clear updates
		updates.clear();

		//Save current state
		const saveState = printState(state);
		const score = getScore(state);

		if (saveState === previousState) {
			const difference = score - previousScore;
			return (50000000000 - (i + 1)) * difference + score;
		} else {
			previousState = saveState;
			previousScore = score;
		}
	}

	return getScore(state);
}
