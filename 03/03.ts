// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		claims = parseInput(data),
		overlap = divideFabric(claims);

	return overlap;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		claims = parseInput(data),
		completePiece = divideFabric(claims, true);

	return completePiece;
}

//Run
solveB("input", "03");

// Functions
type Point = { x: number; y: number };
type Size = { w: number; h: number };
type Claim = { ID: number; start: Point; size: Size };

function parseInput(data: string) {
	const claims: Claim[] = [];

	for (let claim of data.split("\r\n")) {
		const details = (claim.match(/\d+/g) || []).map(Number);

		claims.push({
			ID: details[0],
			start: { x: details[1], y: details[2] },
			size: { w: details[3], h: details[4] },
		});
	}

	return claims;
}
function divideFabric(claims: Claim[], partB: boolean = false) {
	const claimed: Set<string> = new Set();
	const overlap: Set<string> = new Set();
	const IDs: Set<number> = new Set([
		...Array.from({ length: claims.length }, (_, i) => i + 1),
	]);

	for (let { start, size } of claims) {
		for (let y = 0; y < size.h; y++) {
			for (let x = 0; x < size.w; x++) {
				const coord = JSON.stringify({ x: x + start.x, y: y + start.y });

				if (claimed.has(coord)) {
					overlap.add(coord);
				} else {
					claimed.add(coord);
				}
			}
		}
	}

	if (partB) {
		for (let { ID, start, size } of claims) {
			for (let y = 0; y < size.h; y++) {
				for (let x = 0; x < size.w; x++) {
					const coord = JSON.stringify({ x: x + start.x, y: y + start.y });
					if (overlap.has(coord)) IDs.delete(ID);
				}
			}
		}

		if (IDs.size === 1) {
			return [...IDs][0];
		} else {
			throw Error("Too many IDs remaining!");
		}
	}

	return overlap.size;
}
