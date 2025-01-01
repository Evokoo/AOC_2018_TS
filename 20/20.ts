// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const stack = parseInput(data);
	// const tree = buildTree(stack);

	console.log(stack);

	return 0;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type Node = {
	steps: number;
	parent: Node | null;
	children: Node[];
};

// Functions
function parseInput(data: string): (number | string)[] {
	return (data.match(/\w+|\||\(|\)/g) || []).map(Number);
}
function buildTree(stack: string[]): Node {
	function newNode(route: string, parent: Node | null = null): Node {
		return {
			steps: (parent?.steps ?? 0) + route.length,
			parent,
			children: [],
		};
	}

	const root: Node = newNode(stack.shift()!);
	let currentNode: Node = root;

	while (stack.length) {
		const current = stack.shift()!;

		console.log({ current, currentNode });

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
			} else {
				throw Error("No parent found");
			}
		} else if (current === "|") {
			if (stack.length && /[A-Z]+/.test(stack[0])) {
				const route = stack.shift()!;
				currentNode = currentNode.parent!;
				const childNode = newNode(route, currentNode);

				currentNode.children.push(childNode);
				currentNode = childNode;
			}
		} else {
			currentNode.steps += current.length;
		}
	}

	return root;
}
function longestPath(tree: Node): number {
	let path: number = 0;

	function DFS(node: Node) {
		path = Math.max(node.steps, path);

		for (const child of node.children) {
			DFS(child);
		}
	}

	DFS(tree);

	console.log(tree, path);

	return -1;
}
