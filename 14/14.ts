// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	return makeRecipes(parseInput(data));
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

// Functions
function parseInput(data: string): number {
	return Number(data);
}

function makeRecipes(target: number): string {
	const recipes: number[] = [3, 7];
	const elf: [number, number] = [0, 1];

	while (true) {
		const a = recipes[elf[0]];
		const b = recipes[elf[1]];

		recipes.push(...getDigits(a, b));

		elf[0] = (elf[0] + a + 1) % recipes.length;
		elf[1] = (elf[1] + b + 1) % recipes.length;

		if (recipes.length >= target + 10) {
			return recipes.slice(target, target + 10).join("");
		}
	}
}

function getDigits(a: number, b: number): number[] {
	const digits: number[] = [];
	let sum: number = a + b;

	do {
		digits.unshift(sum % 10);
		sum = Math.floor(sum / 10);
	} while (sum > 0);

	return digits;
}
