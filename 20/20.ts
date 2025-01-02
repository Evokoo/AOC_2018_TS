// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return plotPath(data).longest;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return plotPath(data, 1000).exceedOrEqualLimit;
}

type Location = [number, number, number];
type Paths = { longest: number; exceedOrEqualLimit: number };

function plotPath(input: string, limit: number = 0): Paths {
	const points: Map<string, number> = new Map();
	const stack: Location[] = [];

	let [x, y, dist] = [0, 0, 0];

	for (const char of input.slice(1, -1)) {
		switch (char) {
			case "(":
				stack.push([x, y, dist]);
				break;
			case ")":
				[x, y, dist] = stack.pop()!;
				break;
			case "|":
				[x, y, dist] = stack.at(-1)!;
				break;
			default: {
				if (char === "E") x++;
				if (char === "W") x--;
				if (char === "N") y--;
				if (char === "S") y++;

				dist++;

				const coord = `${x},${y}`;

				if (!points.has(coord) || dist < points.get(coord)!) {
					points.set(coord, dist);
				}
			}
		}
	}

	const paths = { longest: 0, exceedOrEqualLimit: 0 };

	for (const [_, dist] of points) {
		paths.longest = Math.max(paths.longest, dist);

		if (dist >= limit) {
			paths.exceedOrEqualLimit++;
		}
	}

	return paths;
}
