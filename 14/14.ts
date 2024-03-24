// Imports
import TOOLS from "../00/tools";
import { CircularLinkedList } from "./CLL";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day),
		score = simulateRecipes(+data);

	return score;
}
export function solveB(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day),
		index = simulateRecipes(+data, true);

	return index;
}

//Run
// solveB("input", "14");

// Functions
function getDigits(num: number): number[] {
	return [...String(num)].map(Number);
}
function simulateRecipes(target: number, partB: boolean = false) {
	const recipes: number[] = [3, 7];
	const targetDigits = getDigits(target);

	let elves: number[] = [0, 1];

	while (true) {
		if (!partB && recipes.length >= target + 11) {
			return recipes.slice(target, target + 10).join("");
		}

		const newRecipe = elves.reduce((sum, elf) => sum + recipes[elf], 0);

		for (let digit of getDigits(newRecipe)) {
			recipes.push(digit);

			if (partB) {
				let match = true;

				for (let j = 0; j < targetDigits.length; j++) {
					const a = targetDigits[targetDigits.length - (1 + j)];
					const b = recipes[recipes.length - (1 + j)];

					if (a !== b) {
						match = false;
						break;
					}
				}

				if (match) return String(recipes.length - targetDigits.length);
			}
		}

		elves = elves.map((elf) => (elf + recipes[elf] + 1) % recipes.length);
	}
}

// function simulateRecipes(target: number, partB: boolean = false) {
// 	const recipes = new CircularLinkedList<number>();

// 	recipes.append(3);
// 	recipes.append(7);

// 	let elfA = recipes.head;
// 	let elfB = elfA!.next;
// 	let recipesSize = 2;
// 	let digits = getDigits(target);

// 	for (let i = 0; i < 1_000_000_000; i++) {
// 		if (!partB && recipesSize >= target + 11) {
// 			return recipes.slice(target, target + 10).join("");
// 		}

// 		for (let digit of getDigits(elfA!.data + elfB!.data)) {
// 			recipes.append(digit);
// 			recipesSize++;

// 			if (partB && recipes.tail!.data === digits[digits.length - 1]) {
// 				if (recipes.sliceFromTail(digits.length).join("") === String(target)) {
// 					return String(recipesSize - digits.length);
// 				}
// 			}
// 		}

// 		const [stepA, stepB] = [elfA!.data + 1, elfB!.data + 1];

// 		for (let i = 0; i < stepA; i++) {
// 			elfA = elfA!.next;
// 		}
// 		for (let i = 0; i < stepB; i++) {
// 			elfB = elfB!.next;
// 		}
// 	}

// 	throw Error("??");
// }
