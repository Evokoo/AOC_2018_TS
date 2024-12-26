// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const boxes = parseInput(data);
	return processBoxes(boxes);
}
export function solveB(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	const boxes = parseInput(data);
	return shareLetters(boxes);
}

// Functions
function parseInput(data: string): string[] {
	return data.split("\n");
}
function processBoxes(boxes: string[]): number {
	const result = { double: 0, triple: 0 };

	for (const ID of boxes) {
		const count: Map<string, number> = new Map();

		for (const character of ID) {
			count.set(character, (count.get(character) ?? 0) + 1);
		}

		let double = false;
		let triple = false;

		for (const [_, n] of count) {
			if (n === 2) double = true;
			if (n === 3) triple = true;
		}

		if (double) result.double++;
		if (triple) result.triple++;
	}

	return result.double * result.triple;
}
function shareLetters(boxes: string[]): string {
	for (let i = 0; i < boxes.length; i++) {
		for (let j = i + 1; j < boxes.length; j++) {
			const aID: string = boxes[i];
			const bID: string = boxes[j];

			let shared: string = "";
			let different: number = 0;

			for (let k = 0; k < aID.length; k++) {
				if (aID[k] === bID[k]) {
					shared += aID[k];
				} else {
					different++;
				}

				if (different > 1) break;
			}

			if (different === 1) return shared;
		}
	}

	throw Error("Result not found");
}
