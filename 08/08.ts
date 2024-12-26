// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const tree = buildTree(parseInput(data));
	return metadataSum(tree);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const tree = buildTree(parseInput(data));
	return metadataSumII(tree);
}

type TreeNode = {
	metadata: number[];
	children: TreeNode[];
};

// Functions
function parseInput(data: string): number[] {
	return data.split(" ").map(Number);
}
function buildTree(input: number[]): TreeNode {
	const [childCount, metadataCount] = input.splice(0, 2);
	const children = [];

	for (let i = 0; i < childCount; i++) {
		children.push(buildTree(input));
	}

	return { metadata: input.splice(0, metadataCount), children };
}
function metadataSum(tree: TreeNode) {
	function DFS(node: TreeNode, sum: number = 0) {
		sum += node.metadata.reduce((acc, cur) => acc + cur, 0);

		for (const child of node.children) {
			sum += DFS(child);
		}
		return sum;
	}

	return DFS(tree);
}
function metadataSumII(tree: TreeNode) {
	function DFS(node: TreeNode): number {
		if (node.children.length === 0) {
			return node.metadata.reduce((acc, cur) => acc + cur, 0);
		} else {
			let sum = 0;
			for (const index of node.metadata) {
				if (node.children[index - 1]) {
					sum += DFS(node.children[index - 1]);
				}
			}
			return sum;
		}
	}

	return DFS(tree);
}
