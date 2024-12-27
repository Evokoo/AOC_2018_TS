// Imports
import TOOLS from "tools";
import { CircularLinkedList } from "./List.ts";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const { players, marbles } = parseInput(data);
	return playGame(players, marbles);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const { players, marbles } = parseInput(data);
	return playGame(players, marbles * 100);
}

type Rules = { players: number; marbles: number };

// Functions
function parseInput(data: string): Rules {
	const [players, marbles] = (data.match(/\d+/g) || []).map(Number);
	return { players, marbles };
}
function playGame(players: number, marbles: number): number {
	const scores: number[] = Array.from({ length: players }, () => 0);
	const circle: CircularLinkedList<number> = new CircularLinkedList();

	circle.append(0);

	let currentNode = circle.head;

	for (let marble = 1; marble <= marbles; marble++) {
		if (marble % 23 === 0) {
			//Move backwards
			for (let i = 0; i < 6; i++) {
				currentNode = currentNode!.previous;
			}

			scores[marble % players] += marble + currentNode!.data;
			circle.delete(currentNode!);
		} else {
			// Move Forward
			for (let i = 0; i < 2; i++) {
				currentNode = currentNode!.next;
			}
			circle.insertAfter(currentNode!, marble);
		}
	}

	return Math.max(...scores);
}
