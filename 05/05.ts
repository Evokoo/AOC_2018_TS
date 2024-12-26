// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const polymers = parseInput(data);
	return reducePolymer(polymers);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return shortestPolymer(data);
}

// Functions
function parseInput(data: string): number[] {
	return [...data].map((char) => char.charCodeAt(0));
}
function reducePolymer(polymers: number[]): number {
	const stack: number[] = [];

	for (const current of polymers) {
		if (stack.length === 0) {
			stack.push(current);
		} else {
			const previous = stack.pop()!;
			const difference = Math.abs(previous - current);

			if (difference !== 32) {
				stack.push(previous, current);
			}
		}
	}

	return stack.length;
}
function shortestPolymer(input: string): number {
	let shortest: number = Infinity;

	for (const char of "abcdefghijklmnopqrstuvwxyz") {
		const re = RegExp(`${char}`, "gi");
		const polymers = parseInput(input.replace(re, ""));

		shortest = Math.min(reducePolymer(polymers), shortest);
	}

	return shortest;
}
