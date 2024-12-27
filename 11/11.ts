// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	const grid = getCellGrid(parseInput(data));
	const optimalCells = searchCells(grid, true);
	return `${optimalCells.x},${optimalCells.y}`;
}
export function solveB(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	const grid = getCellGrid(parseInput(data));
	const optimalCells = searchCells(grid, false);
	return `${optimalCells.x},${optimalCells.y},${optimalCells.size}`;
}

type CellBlock = { x: number; y: number; sum: number; size: number };

// Functions
function parseInput(data: string): number {
	return Number(data);
}
function getCellGrid(serial: number, size: number = 300): number[][] {
	function getCellValue(x: number, y: number): number {
		const power = ((x += 10) * y + serial) * x;
		return ~~((power / 100) % 10) - 5;
	}

	const grid = Array.from({ length: size }, (_, y) =>
		Array.from({ length: size }, (_, x) => getCellValue(x + 1, y + 1))
	);

	return grid;
}
function searchCells(grid: number[][], fixedSize: boolean): CellBlock {
	const optimal: CellBlock = { x: -1, y: -1, sum: 0, size: -1 };

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid.length; x++) {
			const result = fixedSize
				? diagonalSearch(x, y, grid, 3)
				: diagonalSearch(x, y, grid);

			if (result.sum > optimal.sum) {
				optimal.x = x + 1;
				optimal.y = y + 1;
				optimal.sum = result.sum;
				optimal.size = result.size;
			}
		}
	}

	return optimal;
}
function diagonalSearch(
	x: number,
	y: number,
	grid: number[][],
	maxSize?: number
): CellBlock {
	const optimal: CellBlock = { x, y, sum: grid[y][x], size: 1 };

	let sum = grid[y][x];
	let size = 1;

	while (x + size < grid.length && y + size < grid.length) {
		const [nx, ny] = [x + size, y + size];

		sum += grid[ny][nx];

		for (let i = 1; i <= size; i++) {
			sum += grid[ny - i][nx];
			sum += grid[ny][nx - i];
		}

		size++;

		if (sum > optimal.sum) {
			optimal.sum = sum;
			optimal.size = size;
		}

		if (maxSize && size === maxSize) {
			break;
		}
	}

	return optimal;
}
