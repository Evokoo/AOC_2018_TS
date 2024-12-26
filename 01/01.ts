// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const changes = parseInput(data);
	return frequencySum(changes);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const changes = parseInput(data);
	return repeatedFrequency(changes);
}

// Functions
function parseInput(data: string): number[] {
	return (data.match(/-*\d+/g) || []).map(Number);
}
function frequencySum(changes: number[]): number {
	return changes.reduce((acc, cur) => acc + cur, 0);
}
function repeatedFrequency(changes: number[]): number {
	const frequncies: Set<number> = new Set();

	let sum = 0;
	let index = 0;

	while (true) {
		sum += changes[index % changes.length];

		if (frequncies.has(sum)) {
			return sum;
		} else {
			frequncies.add(sum);
			index++;
		}
	}
}
