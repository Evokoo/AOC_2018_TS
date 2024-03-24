// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		string = reduceString(data);

	return string.length;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		shortestPolymer = selectiveReduction(data);

	return shortestPolymer;
}

//Run
solveB("example_b", "05");

// Functions
function areOpposites(a: string, b: string): boolean {
	const lookup: Record<string, string> = {
		a: "A",
		b: "B",
		c: "C",
		d: "D",
		e: "E",
		f: "F",
		g: "G",
		h: "H",
		i: "I",
		j: "J",
		k: "K",
		l: "L",
		m: "M",
		n: "N",
		o: "O",
		p: "P",
		q: "Q",
		r: "R",
		s: "S",
		t: "T",
		u: "U",
		v: "V",
		w: "W",
		x: "X",
		y: "Y",
		z: "Z",
		A: "a",
		B: "b",
		C: "c",
		D: "d",
		E: "e",
		F: "f",
		G: "g",
		H: "h",
		I: "i",
		J: "j",
		K: "k",
		L: "l",
		M: "m",
		N: "n",
		O: "o",
		P: "p",
		Q: "q",
		R: "r",
		S: "s",
		T: "t",
		U: "u",
		V: "v",
		W: "w",
		X: "x",
		Y: "y",
		Z: "z",
	};

	return lookup[a] === b;
}
function reduceString(data: string): string {
	const chars = [...data];

	for (let i = 0; i < chars.length - 1; i++) {
		const a = chars[i];
		const b = chars[i + 1];

		if (areOpposites(a, b)) {
			chars.splice(i, 2);
			i -= 2;
		}
	}

	return chars.join("");
}
function selectiveReduction(data: string) {
	let shortest = Infinity;

	for (let i = 65; i <= 90; i++) {
		const upper = String.fromCharCode(i);
		const lower = String.fromCharCode(i + 32);
		const re = RegExp(`${lower}|${upper}`, "g");

		shortest = Math.min(shortest, reduceString(data.replace(re, "")).length);
	}

	return shortest;
}
