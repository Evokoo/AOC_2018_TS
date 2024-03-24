// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = +TOOLS.readData(fileName, day),
		bank = inspectBattery(data);

	return getLocation(bank[0]);
}
export function solveB(fileName: string, day: string): number {
	const data = +TOOLS.readData(fileName, day);
	return 0;
}
//Run
solveA("example_a", "11");

// Functions
type Point = { x: number; y: number };

function getPowerLevel({ x, y }: Point, serial: number) {
	const rackID = x + 10;
	const level = String((rackID * y + serial) * rackID);

	return (+[...level][level.length - 3] ?? 0) - 5;
}
function getLocation(string: string) {
	return string.match(/\d+/g)!.join(",");
}

function inspectBattery(serial: number) {
	const banks: Record<string, number> = {};
	const cells: Map<string, number> = new Map();

	for (let y = 2; y <= 299; y++) {
		for (let x = 2; x <= 299; x++) {
			let bPow = 0;

			for (let [nx, ny] of [
				[-1, -1],
				[0, -1],
				[1, -1],
				[-1, 0],
				[0, 0],
				[1, 0],
				[-1, 1],
				[0, 1],
				[1, 1],
			]) {
				const [xx, yy] = [nx + x, ny + y];

				const cID = JSON.stringify({ x: xx, y: yy });
				const cPow = cells.get(cID) ?? getPowerLevel({ x: xx, y: yy }, serial);

				bPow += cPow;

				cells.set(cID, cPow);
			}

			banks[JSON.stringify({ x: x - 1, y: y - 1 })] = bPow;
		}
	}

	return Object.entries(banks).sort((a, b) => b[1] - a[1])[0];
}
