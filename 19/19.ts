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
	return runProgram(parseInput(data), true);
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
function runProgram({ pointer, inputs }: Program, program2: boolean = false) {
	const computer = new Computer(pointer);

	if (program2) {
		computer.setRegister = [1, 0, 0, 0, 0, 0, 0];
	}

	for (let i = 0; i < 10000; i++) {
		if (computer.getPointer >= inputs.length) {
			break;
		}

		computer.run(inputs[computer.getPointer]);

		console.log({ i, register: computer.getRegister.join(",") });
	}

	// while (computer.getPointer < inputs.length) {
	// 	computer.run(inputs[computer.getPointer]);

	// 	console.log(computer.getRegister);
	// }

	return computer.getRegister[0];
}
