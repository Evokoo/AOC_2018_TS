// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const notes = parseInput(data);
	return getResult(observeGuards(notes));
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const notes = parseInput(data);
	return getResult(observeGuards(notes), true);
}

type Note = { timeStamp: Date; note: string };
type Guard = { schedule: number[]; asleep: number };

// Functions
function parseDateString(dateString: string): Date {
	const [year, month, day, hour, minute]: number[] = (
		dateString.match(/\d+/g) || []
	).map(Number);

	return new Date(Date.UTC(year, month - 1, day, hour, minute));
}
function parseInput(data: string): Note[] {
	const notes: Note[] = [];

	for (const line of data.split("\n")) {
		const sections = line.split("] ");
		notes.push({ timeStamp: parseDateString(sections[0]), note: sections[1] });
	}

	return notes.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
}
function observeGuards(notes: Note[]) {
	const guards: Map<number, Guard> = new Map();

	let currentGuard = 0;
	let currentTime = 0;

	for (const { timeStamp, note } of notes) {
		if (note.startsWith("Guard")) {
			currentGuard = +note.match(/\d+/)![0];
			currentTime =
				timeStamp.getUTCHours() !== 0 ? 0 : timeStamp.getUTCMinutes();
		} else if (note.startsWith("falls")) {
			currentTime = timeStamp.getUTCMinutes();
		} else if (note.startsWith("wakes")) {
			const guardLog = guards.get(currentGuard) ?? {
				schedule: Array.from({ length: 59 }, () => 0),
				asleep: 0,
			};

			for (let i = currentTime; i < timeStamp.getUTCMinutes(); i++) {
				guardLog.schedule[i]++;
				guardLog.asleep++;
			}

			guards.set(currentGuard, guardLog);
		}
	}

	return guards;
}
function getResult(guardLog: Map<number, Guard>, maxTime: boolean = false) {
	const [ID, { schedule }] = [...guardLog].sort((a, b) => {
		if (maxTime) {
			return Math.max(...b[1].schedule) - Math.max(...a[1].schedule);
		} else {
			return b[1].asleep - a[1].asleep;
		}
	})[0];

	return +ID * schedule.indexOf(Math.max(...schedule));
}
