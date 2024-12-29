// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	return makeRecipes(parseInput(data), true);
}
export function solveB(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	return makeRecipes(parseInput(data));
}

// Functions
function parseInput(data: string): number {
	return Number(data);
}
function makeRecipes(target: number, before: boolean = false): string {
	const recipes: number[] = [3, 7];
	const elf: [number, number] = [0, 1];
	const targetDigits = getDigits(target);

	while (true) {
		const a = recipes[elf[0]];
		const b = recipes[elf[1]];

		for (const digit of getDigits(a + b)) {
			recipes.push(digit);

			if (before) {
				if (recipes.length >= target + 10) {
					return recipes.slice(target, target + 10).join("");
				}
			} else if (digit === targetDigits.at(-1)) {
				let match = true;

				for (let i = 0; i < targetDigits.length; i++) {
					const a = targetDigits[targetDigits.length - (1 + i)];
					const b = recipes[recipes.length - (1 + i)];

					if (a !== b) {
						match = false;
						break;
					}
				}

				if (match) {
					return String(recipes.length - targetDigits.length);
				}
			}
		}

		elf[0] = (elf[0] + a + 1) % recipes.length;
		elf[1] = (elf[1] + b + 1) % recipes.length;
	}
}
function getDigits(n: number): number[] {
	const digits: number[] = [];

	do {
		digits.unshift(n % 10);
		n = Math.floor(n / 10);
	} while (n > 0);

	return digits;
}
