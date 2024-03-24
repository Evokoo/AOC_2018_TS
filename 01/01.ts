// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		digits = parseInput(data);

	return getSum(digits);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		digits = parseInput(data);

	return getSum(digits, true);
}

//Run
solveB("example_b", "01");

// Functions
function parseInput(data: string) {
	return data.split("\r\n").map(Number);
}
function getSum(digits: number[], partB: boolean = false): number {
	if (partB) {
		let index = 0;
		let total: number = 0;
		let totals: Set<number> = new Set();

		while (true) {
			total += digits[index % digits.length];

			if (totals.has(total)) {
				return total;
			} else {
				totals.add(total);
			}

			index++;
		}
	}

	return digits.reduce((acc, cur) => acc + cur, 0);
}
