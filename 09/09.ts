// Imports
import TOOLS from "../00/tools";
import { CircularLinkedList, ListNode } from "./List";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ players, marbles } = parseInput(data),
		winner = simulateGame(players, marbles);

	return winner;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ players, marbles } = parseInput(data),
		winner = simulateGame(players, marbles * 100);

	return winner;
}

//Run
solveA("example_a", "09");

// Functions
function parseInput(data: string) {
	const [players, marbles] = (data.match(/\d+/g) || []).map(Number);
	return { players, marbles };
}
function simulateGame(players: number, marbles: number) {
	const scores = Array.from({ length: players }, () => 0);
	const circle = new CircularLinkedList<number>(0);

	circle.append(0);

	let current: ListNode<number> | null = circle.head;

	for (let marble = 1; marble <= marbles; marble++) {
		if (marble % 23 === 0) {
			//Move backwards
			for (let i = 0; i < 6; i++) {
				current = current!.previous;
			}

			scores[marble % scores.length] += marble + current!.data;

			circle.delete(current!);
		} else {
			//Move forward
			for (let i = 0; i < 2; i++) {
				current = current!.next;
			}

			circle.insertAfter(current!, marble);
		}
	}

	return Math.max(...scores);
}
