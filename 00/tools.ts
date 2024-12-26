import * as path from "@std/path";

type Point = { x: number; y: number; z?: number };

function readData(fileName: string, day: string) {
	const file = path.resolve(Deno.cwd(), `../${day}/${fileName}.txt`);
	return Deno.readTextFileSync(file);
}
function gcd(a: number, b: number): number {
	return b === 0 ? a : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
	return (a * b) / gcd(a, b);
}
function arrLCM(arr: number[]): number {
	let result = arr[0];
	for (let i = 1; i < arr.length; i++) {
		result = lcm(result, arr[i]);
	}

	return result;
}
function derangement(n: number): number {
	switch (n) {
		case 1:
			return 0;
		case 2:
			return 1;
		default:
			return (n - 1) * derangement(n - 1) + derangement(n - 2);
	}
}
function generatePermutations<T>(inputArray: T[]): T[][] {
	const result: Set<string> = new Set();

	function permute(currentArray: T[], remainingElements: T[]) {
		if (remainingElements.length === 0) {
			result.add(currentArray.toString());
			return;
		}

		for (let i = 0; i < remainingElements.length; i++) {
			const element = remainingElements[i];
			const newArray = [...currentArray, element];
			const newRemainingElements = [
				...remainingElements.slice(0, i),
				...remainingElements.slice(i + 1),
			];
			permute(newArray, newRemainingElements);
		}
	}

	permute([], inputArray);
	return Array.from(result).map((str) =>
		str.split(",").map((item) => JSON.parse(item))
	);
}

//Find the area of a ploygon, points must follow each other either clockwise or anti clockwise
//Result may need to be offset
function shoelaceFormula(points: Point[]): number {
	const n = points.length,
		first = points[0],
		last = points[n - 1];

	let sum: number = 0;

	for (let i = 0; i < n - 1; i++) {
		const a = points[i],
			b = points[i + 1];

		sum += a.x * b.y - b.x * a.y;
	}
	sum += last.x * first.y - first.x * last.y;

	return Math.abs(sum) / 2;
}

//Manhattan Distance
function manhattanDistance(a: Point, b: Point): number {
	return (
		Math.abs(a.x - b.x) +
		Math.abs(a.y - b.y) +
		Math.abs((a.z ?? 0) - (b.z ?? 0))
	);
}
//Euclidean Distance
function euclideanDistance(a: Point, b: Point): number {
	return (
		Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)) +
		Math.pow((a.z ?? 0) - (b.z ?? 0), 2)
	);
}

//Identify a repeating pattern within array and predict the value at the nth iteration
function nthInteration<T>(array: T[], target: number) {
	interface Sequence {
		index: number;
		len: number;
		pattern: T[];
	}

	let sequence: Sequence = { index: 0, len: 0, pattern: [] };

	for (let i = 0; i < array.length; i++) {
		const a = array[i];

		for (let j = 1; j < Math.min(100, array.length); j++) {
			const b = array[j + i];

			if (a === b && j > 2) {
				const sectionA = array.slice(i, i + j),
					sectionB = array.slice(i + j, i + j + j);

				if (sectionA.join("") === sectionB.join("")) {
					sequence = { index: i + 1, len: sectionA.length, pattern: sectionA };
					break;
				}
			}
		}

		if (sequence.index !== 0) break;
	}

	const P: number = sequence.index,
		L: number = sequence.len,
		nth = ((target - P) % L) + P - P;

	return sequence.pattern[nth];
}

export default {
	readData,
	arrLCM,
	derangement,
	generatePermutations,
	manhattanDistance,
	euclideanDistance,
	nthInteration,
};
