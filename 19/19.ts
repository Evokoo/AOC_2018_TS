// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ instructions, ip } = parseInput(data),
		registerValue = runInstructions(instructions, ip);

	return registerValue;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		{ instructions, ip } = parseInput(data),
		registerValue = runInstructions(instructions, ip, true);

	return registerValue;
}

//Run
solveB("input", "19");

// Functions
interface OpcodeFunctions {
	[key: string]: (r: number[], a: number, b: number) => number;
}
type Instruction = { code: string; a: number; b: number; c: number };

function getOpcodes(): OpcodeFunctions {
	return {
		addr: (r, a, b) => r[a] + r[b],
		addi: (r, a, b) => r[a] + b,
		mulr: (r, a, b) => r[a] * r[b],
		muli: (r, a, b) => r[a] * b,
		banr: (r, a, b) => r[a] & r[b],
		bani: (r, a, b) => r[a] & b,
		borr: (r, a, b) => r[a] | r[b],
		bori: (r, a, b) => r[a] | b,
		setr: (r, a, b) => r[a],
		seti: (r, a, b) => a,
		gtir: (r, a, b) => (a > r[b] ? 1 : 0),
		gtri: (r, a, b) => (r[a] > b ? 1 : 0),
		gtrr: (r, a, b) => (r[a] > r[b] ? 1 : 0),
		eqir: (r, a, b) => (a === r[b] ? 1 : 0),
		eqri: (r, a, b) => (r[a] === b ? 1 : 0),
		eqrr: (r, a, b) => (r[a] === r[b] ? 1 : 0),
	};
}

function parseInput(data: string) {
	const instructions: Instruction[] = [];
	let ip: number = 0;

	for (let line of data.split("\r\n")) {
		const details = line.split(" ");

		if (details[0][0] === "#") {
			ip = +details[1];
		} else {
			instructions.push({
				code: details[0],
				a: +details[1],
				b: +details[2],
				c: +details[3],
			});
		}
	}

	return { instructions, ip };
}
function runInstructions(
	instructions: Instruction[],
	ip: number,
	partB: boolean = false
) {
	const registers = Array(6).fill(0);
	const opcodes = getOpcodes();

	if (partB) {
		registers[0] = 1;
	}

	while (true) {
		const { code, a, b, c } = instructions[registers[ip]];

		registers[c] = opcodes[code](registers, a, b);

		if (
			registers[ip] >= instructions.length ||
			registers[ip] + 1 >= instructions.length
		) {
			break;
		} else {
			registers[ip]++;
		}
	}

	return registers[0];
}
