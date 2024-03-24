// Imports
import TOOLS from "../00/tools";
import _ from "lodash";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ instructions } = parseInput(data),
		samples = runInstructions(instructions);

	console.log(samples);

	return samples;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ testData, instructions } = parseInput(data),
		registerValue = runInstructions(instructions, testData, true);

	return registerValue;
}

//Run
solveB("input", "16");

// Functions
type Instruction = {
	before: number[];
	opcode: number;
	a: number;
	b: number;
	c: number;
	after: number[];
};

interface OpcodeFunctions {
	[key: string]: (instruction: Instruction) => number;
}

function matchDigits(input: string): number[] {
	return input.match(/\d+/g)!.map(Number);
}
function parseInput(data: string) {
	const lines = data.split("\r\n").filter((line) => line !== "");
	const instructions: Instruction[] = [];
	const testData: number[][] = [];

	while (lines.length) {
		if (/^(\d+ ){3}\d+$/.test(lines[0])) {
			testData.push(matchDigits(lines.shift()!));
			continue;
		}

		const sections = lines.splice(0, 3);

		const before = matchDigits(sections[0]);
		const [opcode, a, b, c] = matchDigits(sections[1]);
		const after = matchDigits(sections[2]);

		instructions.push({
			before,
			opcode,
			a,
			b,
			c,
			after,
		});
	}

	return { testData, instructions };
}
function getOpcodes(): OpcodeFunctions {
	return {
		addr: ({ before, a, b, c }) => before[a] + before[b],
		addi: ({ before, a, b, c }) => before[a] + b,
		mulr: ({ before, a, b, c }) => before[a] * before[b],
		muli: ({ before, a, b, c }) => before[a] * b,
		banr: ({ before, a, b, c }) => before[a] & before[b],
		bani: ({ before, a, b, c }) => before[a] & b,
		borr: ({ before, a, b, c }) => before[a] | before[b],
		bori: ({ before, a, b, c }) => before[a] | b,
		setr: ({ before, a, b, c }) => before[a],
		seti: ({ before, a, b, c }) => a,
		gtir: ({ before, a, b, c }) => (a > before[b] ? 1 : 0),
		gtri: ({ before, a, b, c }) => (before[a] > b ? 1 : 0),
		gtrr: ({ before, a, b, c }) => (before[a] > before[b] ? 1 : 0),
		eqir: ({ before, a, b, c }) => (a === before[b] ? 1 : 0),
		eqri: ({ before, a, b, c }) => (before[a] === b ? 1 : 0),
		eqrr: ({ before, a, b, c }) => (before[a] === before[b] ? 1 : 0),
	};
}
function runInstructions(
	instructions: Instruction[],
	testData: number[][] = [[]],
	partB: boolean = false
) {
	const opcodes = getOpcodes();
	const codes = Object.keys(opcodes);
	const codeList: Map<number, string[]> = new Map();

	let samples = 0;

	for (let instruction of instructions) {
		const expected = instruction.after[instruction.c];
		const validCodes = [];

		for (let code of codes) {
			if (opcodes[code](instruction) === expected) {
				validCodes.push(code);
			}
		}

		if (validCodes.length >= 3) {
			samples++;
		}

		codeList.set(
			instruction.opcode,
			_.union(codeList.get(instruction.opcode) ?? [], validCodes)
		);
	}

	return partB ? runTestData(testData, refineCodeList(codeList)) : samples;
}
function refineCodeList(codeList: Map<number, string[]>) {
	const removed = new Set();

	while (removed.size < 15) {
		let target = "";

		for (let [_, codes] of codeList.entries()) {
			if (codes.length === 1 && !removed.has(codes[0])) {
				target = codes[0];
				break;
			}
		}

		for (let [code, codes] of codeList.entries()) {
			if (codes.length === 1) {
				continue;
			} else {
				codeList.set(
					code,
					codes.filter((c) => c !== target)
				);
			}
		}

		removed.add(target);
	}

	return codeList;
}
function runTestData(testData: number[][], codeList: Map<number, string[]>) {
	const registers = [0, 0, 0, 0];
	const opcodes = getOpcodes();

	for (let [code, a, b, c] of testData) {
		const fn = opcodes[codeList.get(code)![0]];
		registers[c] = fn({ before: registers, opcode: code, a, b, c, after: [] });
	}

	return registers[0];
}
