// Imports
import TOOLS from "tools";
import { Computer, Input } from "./Computer.ts";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const program = parseInput(data);
	return runProgram(program);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const program = parseInput(data);
	return 0;
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
function runProgram({ pointer, inputs }: Program): number {
	const computer: Computer = new Computer(pointer);

	while (computer.getPointer < inputs.length) {
		const pointer = computer.getPointer;
		const input = inputs[pointer];

		if (pointer + 1 === 29) {
			return computer.getRegister[2];
		} else {
			computer.run(input);
		}
	}

	throw Error("Value not found");
}
