// Imports
import TOOLS from "tools";
import Computer from "./Computer.ts";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return runPrograms(parseInput(data));
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return runPrograms(parseInput(data), true);
}

type ProgramResult = { code: number; commands: string[] };
type Program = {
	before: number[];
	inputs: number[];
	after: number[];
};

interface Inputs {
	programs: Program[];
	tests: number[][];
}

// Functions
function parseInput(data: string): Inputs {
	const programs: Program[] = [];
	const [upper, lower] = data.split("\n\n\n\n");
	const tests = lower
		?.split("\n")
		.map((test) => (test.match(/\d+/g) || []).map(Number));

	for (const section of upper.split("\n\n")) {
		const [before, inputs, after] = section
			.split("\n")
			.map((str) => (str.match(/\d+/g) || []).map(Number));

		programs.push({
			before,
			inputs,
			after,
		});
	}

	return { programs, tests };
}
function runPrograms(
	{ programs, tests }: Inputs,
	runTest: boolean = false
): number {
	const programResults: ProgramResult[] = [];
	const computer = new Computer();
	let count = 0;

	for (const { before, after, inputs } of programs) {
		computer.setInputs = inputs;

		const commands = computer.commandCount(before, after);

		if (commands.length >= 3) count++;
		programResults.push({ code: inputs[0], commands });
	}

	if (!runTest) {
		return count;
	} else {
		const opCodes = getOpCodes(programResults);

		computer.setRegister = [0, 0, 0, 0];

		for (const inputs of tests) {
			computer.setInputs = inputs;
			computer.runProgram(opCodes.get(inputs[0])!);
		}

		return computer.getRegister[0];
	}
}
function getOpCodes(results: ProgramResult[]): Map<number, string> {
	const opCodes: Map<number, string> = new Map();
	const setCommands: Set<string> = new Set();

	while (opCodes.size !== 16) {
		const result = results.shift()!;
		const commands = result.commands.filter(
			(command) => !setCommands.has(command)
		);

		if (commands.length === 1) {
			opCodes.set(result.code, commands[0]);
			setCommands.add(commands[0]);
		} else {
			results.push({ ...result, commands });
		}
	}

	return opCodes;
}
