// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const claims = parseInput(data);
	return mapClaims(claims);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const claims = parseInput(data);
	return mapClaims(claims, true);
}

type Point = { x: number; y: number };
type Claim = {
	id: number;
	location: Point;
	size: Point;
};

// Functions
function parseInput(data: string): Claim[] {
	const claims: Claim[] = [];

	for (const line of data.split("\n")) {
		const [id, lx, ly, sx, sy] = (line.match(/\d+/g) || []).map(Number);

		claims.push({
			id,
			location: { x: lx, y: ly },
			size: { x: sx, y: sy },
		});
	}

	return claims;
}
function mapClaims(claims: Claim[], uniqueClaim: boolean = false): number {
	const claimed: Set<string> = new Set();
	const overlap: Set<string> = new Set();

	for (const { location, size } of claims) {
		for (let x = location.x; x < location.x + size.x; x++) {
			for (let y = location.y; y < location.y + size.y; y++) {
				const coord = `${x},${y}`;

				if (claimed.has(coord)) {
					overlap.add(coord);
				} else {
					claimed.add(coord);
				}
			}
		}
	}

	if (uniqueClaim) {
		const ids: Set<number> = new Set([...claims.map(({ id }) => id)]);

		claimLoop: for (const { id, location, size } of claims) {
			for (let x = location.x; x < location.x + size.x; x++) {
				for (let y = location.y; y < location.y + size.y; y++) {
					const coord = `${x},${y}`;

					if (overlap.has(coord)) {
						ids.delete(id);
						continue claimLoop;
					}
				}
			}
		}

		if (ids.size === 1) {
			return [...ids][0];
		} else {
			throw RangeError("Incorrect number of IDs remain");
		}
	}

	return overlap.size;
}
