interface Grid<T> {
	grid: T[][];
	add: ({ x, y }: Point, item: T) => void;
	toString: () => string;
	print: () => void;
}

function Grid<T>(width: number, height: number, value: T): Grid<T> {
	const grid = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => value)
	);

	return {
		grid,
		add({ x, y }: Point, item: T) {
			grid[y][x] = item;
		},
		toString() {
			return grid.map((row) => row.join("")).join("\n");
		},
		print() {
			console.log(this.toString());
		},
	};
}

let grid: Grid<string> = Grid<string>(10, 10, ".");

console.log(grid);

grid.add({ x: 0, y: 0 }, "0");
grid.add({ x: 5, y: 5 }, "5");
grid.print();
