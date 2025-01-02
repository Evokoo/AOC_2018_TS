type Command = (a: number, b: number, c: number) => void;
type CommandList = Map<string, Command>;
export type Input = [string, number, number, number];

export class Computer {
	private registers: number[];
	private pointerIndex: number;
	private commandCount: number;

	constructor(instructionPointer: number) {
		this.registers = [0, 0, 0, 0, 0, 0, 0];
		this.pointerIndex = instructionPointer;
		this.commandCount = 0;
	}

	//Commands
	private commandList: CommandList = new Map([
		["addr", (a, b, c) => this.addr(a, b, c)],
		["addi", (a, b, c) => this.addi(a, b, c)],
		["mulr", (a, b, c) => this.mulr(a, b, c)],
		["muli", (a, b, c) => this.muli(a, b, c)],
		["banr", (a, b, c) => this.banr(a, b, c)],
		["bani", (a, b, c) => this.bani(a, b, c)],
		["borr", (a, b, c) => this.borr(a, b, c)],
		["bori", (a, b, c) => this.bori(a, b, c)],
		["setr", (a, b, c) => this.setr(a, b, c)],
		["seti", (a, b, c) => this.seti(a, b, c)],
		["gtir", (a, b, c) => this.gtir(a, b, c)],
		["gtri", (a, b, c) => this.gtri(a, b, c)],
		["gtrr", (a, b, c) => this.gtrr(a, b, c)],
		["eqir", (a, b, c) => this.eqir(a, b, c)],
		["eqri", (a, b, c) => this.eqri(a, b, c)],
		["eqrr", (a, b, c) => this.eqrr(a, b, c)],
	]);

	public run([opCode, a, b, c]: Input) {
		const command = this.commandList.get(opCode)!;
		command(a, b, c);

		this.commandCount++;
		this.updatePointer();
	}

	public updatePointer(): void {
		this.getRegister[this.pointerIndex]++;
	}

	// Addtion
	private addr(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] + this.registers[b];
	}
	private addi(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] + b;
	}

	// Multiplication
	private mulr(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] * this.registers[b];
	}
	private muli(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] * b;
	}

	// Bitwise AND
	private banr(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] & this.registers[b];
	}
	private bani(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] & b;
	}

	// Bitwise OR
	private borr(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] | this.registers[b];
	}
	private bori(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] | b;
	}

	// Assignment
	private setr(a: number, _b: number, c: number): void {
		this.registers[c] = this.registers[a];
	}
	private seti(a: number, _b: number, c: number): void {
		this.registers[c] = a;
	}

	// Greater-than testing
	private gtir(a: number, b: number, c: number): void {
		this.registers[c] = a > this.registers[b] ? 1 : 0;
	}
	private gtri(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] > b ? 1 : 0;
	}
	private gtrr(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] > this.registers[b] ? 1 : 0;
	}

	// Equality testing testing
	private eqir(a: number, b: number, c: number): void {
		this.registers[c] = a === this.registers[b] ? 1 : 0;
	}
	private eqri(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] === b ? 1 : 0;
	}
	private eqrr(a: number, b: number, c: number): void {
		this.registers[c] = this.registers[a] === this.registers[b] ? 1 : 0;
	}

	get getRegister(): number[] {
		return this.registers;
	}
	get getPointer(): number {
		return this.registers[this.pointerIndex];
	}
	get getCounter(): number {
		return this.commandCount;
	}
	set setRegister(registers: number[]) {
		this.registers = registers;
	}
}
