// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return getChecksum(parseInput(data));
}
export function solveB(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	return findCommon(parseInput(data));
}

//Run
solveB("example_b", "02");

// Functions
function parseInput(data: string) {
	return data.split("\r\n");
}
function getChecksum(strings: string[]): number {
	const score = { 2: 0, 3: 0 };

	for (let string of strings) {
		const count: Record<string, number> = {};

		for (let char of string) {
			count[char] = (count[char] ?? 0) + 1;
		}

		const results = new Set([...Object.values(count)]);

		if (results.has(2)) score[2]++;
		if (results.has(3)) score[3]++;
	}

	return score[2] * score[3];
}
function findCommon(strings: string[]) {
	for (let i = 0; i < strings.length; i++) {
		for (let j = i + 1; j < strings.length; j++) {
			const strA = strings[i];
			const strB = strings[j];

			let common = "";
			let difference = 0;

			for (let k = 0; k < strA.length; k++) {
				strA[k] === strB[k] ? (common += strA[k]) : difference++;
				if (difference > 1) break;
			}

			if (difference === 1) return common;
		}
	}

	throw Error("Pair not found");
}
