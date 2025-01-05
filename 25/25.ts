// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const coordinates = parseInput(data);
	return countConstellations(coordinates);
}

type Point_4D = { x: number; y: number; z: number; t: number };
type Node = {
	id: string;
	pos: Point_4D;
	parent: Node | null;
	children: Node[];
};

// Functions
function parseInput(data: string): Point_4D[] {
	const coordinates = [];

	for (const line of data.split("\n")) {
		const [x, y, z, t] = (line.match(/-*\d+/g) || []).map(Number);
		coordinates.push({ x, y, z, t });
	}

	return coordinates;
}
function countConstellations(coordinates: Point_4D[]) {
	const connected: Set<string> = new Set();

	function DFS(node: Node): Node {
		for (const coordinate of coordinates) {
			const id = pointToId(coordinate);
			const distance = manhattanDistance_4D(node.pos, coordinate);

			if (!connected.has(id) && distance <= 3) {
				node.children.push(newNode(coordinate, node));
				connected.add(id);
			}
		}

		for (const child of node.children) {
			DFS(child);
		}

		return node;
	}

	const constellations: Node[] = [];

	for (const coordinate of coordinates) {
		const root: Node = newNode(coordinate);

		if (!connected.has(root.id)) {
			connected.add(root.id);
			constellations.push(DFS(root));
		}
	}

	return constellations.length;
}
function manhattanDistance_4D(a: Point_4D, b: Point_4D): number {
	return (
		Math.abs(a.x - b.x) +
		Math.abs(a.y - b.y) +
		Math.abs((a.z ?? 0) - (b.z ?? 0)) +
		Math.abs((a.t ?? 0) - (b.t ?? 0))
	);
}
function newNode(coordinate: Point_4D, parent: Node | null = null): Node {
	return {
		id: pointToId(coordinate),
		pos: coordinate,
		parent,
		children: [],
	};
}
function pointToId({ x, y, z, t }: Point_4D): string {
	return `${x},${y},${z},${t}`;
}
