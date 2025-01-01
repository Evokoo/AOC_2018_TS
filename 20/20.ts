// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const stack = parseInput(data);
	const tree = buildTree(stack);

	return longestPath(tree);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type Point = { x: number; y: number };
type Node = {
	steps: number;
	parent: Node | null;
	children: Node[];
};

// Functions
function parseInput(data: string): string[] {
	data = data.replace(/\([A-Z]+\|\)/g, "");
	return data.match(/\w+|\||\(|\)/g) || [];
}

function buildTree(stack: string[]): Node {
	const root: Node = newNode(stack.shift()!);
	let currentNode: Node = root;

	while (stack.length) {
		const current = stack.shift()!;

		if (current === "(") {
			if (stack.length && /[A-Z]+/.test(stack[0])) {
				const route = stack.shift()!;
				const childNode = newNode(route, currentNode);

				currentNode.children.push(childNode);
				currentNode = childNode;
			}
		} else if (current === ")") {
			if (currentNode.parent) {
				currentNode = currentNode.parent;
			}
		} else if (current === "|") {
			if (stack.length && /[A-Z]+/.test(stack[0])) {
				const route = stack.shift()!;
				currentNode = currentNode.parent!;
				const childNode = newNode(route, currentNode);

				currentNode.children.push(childNode);
				currentNode = childNode;
			}
		} else if (/[A-Z]+/.test(current)) {
			currentNode.steps += current.length;
		}
	}
	return root;

	function newNode(route: string, parent: Node | null = null): Node {
		return {
			steps: (parent?.steps ?? 0) + route.length,
			parent,
			children: [],
		};
	}
}
function longestPath(tree: Node): number {
	let path: number = 0;
	let bigBoy = 0;

	function DFS(node: Node) {
		path = Math.max(node.steps, path);

		if (node.steps > 1000) {
			bigBoy++;
		}

		for (const child of node.children) {
			DFS(child);
		}
	}

	DFS(tree);

	console.log(path, bigBoy);

	return path;
}
