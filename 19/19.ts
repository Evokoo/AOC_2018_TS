// Imports
import TOOLS from "tools";
import { Computer, Input } from "./Computer.ts";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return runProgram(parseInput(data));
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);

	// Followed Jonathan Paulson's explaination on YouTube
	// In short the answer is the divisor sum of largest register once the programs loop

	return runProgramII(parseInput(data));
}

type Program = {
	pointer: number;
	inputs: Input[];
};

// Functions
function parseInput(data: string): Program {
	const lines: string[] = data.split("\n");
	const pointer: number = Number(lines.shift()!.slice(-1));
	const inputs: Input[] = [];

	for (const line of lines) {
		const [code, a, b, c] = line.split(" ");
		inputs.push([code, +a, +b, +c]);
	}

	return { pointer, inputs };
}
function runProgram({ pointer, inputs }: Program) {
	const computer = new Computer(pointer);

	while (computer.getPointer < inputs.length) {
		computer.run(inputs[computer.getPointer]);
	}

	return computer.getRegister[0];
}
function runProgramII({ pointer, inputs }: Program) {
	const computer = new Computer(pointer);

	computer.setRegister = [1, 0, 0, 0, 0, 0];

	for (let i = 0; i < inputs.length; i++) {
		computer.run(inputs[computer.getPointer]);
	}

	return divisorSum(Math.max(...computer.getRegister));
}
function divisorSum(n: number): number {
	const limit = Math.sqrt(n);
	let sum = 0;

	for (let i = 1; i <= limit; i++) {
		if (n % i === 0) {
			sum += i;
			sum += n / i;
		}
	}

	return sum;
}
