type Commands = Map<string, () => void>;

export default class Computer {
	// Registers
	private registers: number[];
	// Inputs
	private opCode: number;
	private valueA: number;
	private valueB: number;
	private valueC: number;

	constructor() {
		this.registers = [0, 0, 0, 0];
		[this.opCode, this.valueA, this.valueB, this.valueC] = [-1, -1, -1, -1];
	}

	public commandCount(register: number[], target: number[]): string[] {
		const codes: string[] = [];

		commandList: for (const [name, command] of this.commands) {
			// Reset register
			this.setRegister = [...register];

			// Run command
			command();

			for (let i = 0; i < this.registers.length; i++) {
				if (this.registers[i] !== target[i]) {
					continue commandList;
				}
			}

			codes.push(name);
		}

		return codes;
	}
	public runProgram(commandName: string) {
		this.commands.get(commandName)!();
	}

	//Commands
	private commands: Commands = new Map([
		["addr", () => this.addr()],
		["addi", () => this.addi()],
		["mulr", () => this.mulr()],
		["muli", () => this.muli()],
		["banr", () => this.banr()],
		["bani", () => this.bani()],
		["borr", () => this.borr()],
		["bori", () => this.bori()],
		["setr", () => this.setr()],
		["seti", () => this.seti()],
		["gtir", () => this.gtir()],
		["gtri", () => this.gtri()],
		["gtrr", () => this.gtrr()],
		["eqir", () => this.eqir()],
		["eqri", () => this.eqri()],
		["eqrr", () => this.eqrr()],
	]);

	// Addtion
	private addr(): void {
		this.registers[this.valueC] =
			this.registers[this.valueA] + this.registers[this.valueB];
	}
	private addi(): void {
		this.registers[this.valueC] = this.registers[this.valueA] + this.valueB;
	}

	// Multiplication
	private mulr(): void {
		this.registers[this.valueC] =
			this.registers[this.valueA] * this.registers[this.valueB];
	}
	private muli(): void {
		this.registers[this.valueC] = this.registers[this.valueA] * this.valueB;
	}

	// Bitwise AND
	private banr(): void {
		this.registers[this.valueC] =
			this.registers[this.valueA] & this.registers[this.valueB];
	}
	private bani(): void {
		this.registers[this.valueC] = this.registers[this.valueA] & this.valueB;
	}

	// Bitwise OR
	private borr(): void {
		this.registers[this.valueC] =
			this.registers[this.valueA] | this.registers[this.valueB];
	}
	private bori(): void {
		this.registers[this.valueC] = this.registers[this.valueA] | this.valueB;
	}

	// Assignment
	private setr(): void {
		this.registers[this.valueC] = this.registers[this.valueA];
	}
	private seti(): void {
		this.registers[this.valueC] = this.valueA;
	}

	// Greater-than testing
	private gtir(): void {
		this.registers[this.valueC] =
			this.valueA > this.registers[this.valueB] ? 1 : 0;
	}
	private gtri(): void {
		this.registers[this.valueC] =
			this.registers[this.valueA] > this.valueB ? 1 : 0;
	}
	private gtrr(): void {
		this.registers[this.valueC] =
			this.registers[this.valueA] > this.registers[this.valueB] ? 1 : 0;
	}

	// Equality testing testing
	private eqir(): void {
		this.registers[this.valueC] =
			this.valueA === this.registers[this.valueB] ? 1 : 0;
	}
	private eqri(): void {
		this.registers[this.valueC] =
			this.registers[this.valueA] === this.valueB ? 1 : 0;
	}
	private eqrr(): void {
		this.registers[this.valueC] =
			this.registers[this.valueA] === this.registers[this.valueB] ? 1 : 0;
	}

	get getRegister(): number[] {
		return this.registers;
	}
	set setRegister(registers: number[]) {
		this.registers = registers;
	}
	set setInputs(inputs: number[]) {
		[this.opCode, this.valueA, this.valueB, this.valueC] = inputs;
	}
}
