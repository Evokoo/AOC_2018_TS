// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		guardLog = observeGuards(parseInput(data));

	return getResult(guardLog);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day),
		guardLog = observeGuards(parseInput(data));

	return getResult(guardLog, true);
}

//Run
solveB("example_b", "04");

// Functions
type Note = { timeStamp: Date; note: string };
type Gaurd = { schedule: number[]; asleep: number };

function getTimeStamp(date: string, time: string) {
	const [year, month, day] = date.split("-").map(Number);
	const [hour, minute] = time.split(":").map(Number);

	return new Date(Date.UTC(year, month - 1, day, hour, minute));
}
function parseInput(data: string) {
	const notes: Note[] = [];

	for (let line of data.split("\r\n")) {
		const date = line.match(/\d{4}-\d{2}-\d{2}/)![0];
		const time = line.match(/\d{2}:\d{2}/)![0];
		const note = line.split(" ").slice(2).join(" ");

		notes.push({ timeStamp: getTimeStamp(date, time), note });
	}

	notes.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());

	return notes;
}
function observeGuards(notes: Note[]) {
	const guards: Record<number, Gaurd> = {};

	let currentGuard = 0;
	let currentTime = 0;

	for (let { timeStamp, note } of notes) {
		if (note.startsWith("Guard")) {
			const ID = +note.match(/\d+/)![0];

			if (!guards[ID]) {
				guards[ID] = {
					schedule: Array.from({ length: 59 }, () => 0),
					asleep: 0,
				};
			}

			currentGuard = ID;
			currentTime =
				timeStamp.getUTCHours() !== 0 ? 0 : timeStamp.getUTCMinutes();
		}
		if (note.startsWith("falls")) {
			currentTime = timeStamp.getUTCMinutes();
		}
		if (note.startsWith("wakes")) {
			let guardLog = guards[currentGuard];

			for (let i = currentTime; i < timeStamp.getUTCMinutes(); i++) {
				guardLog.schedule[i]++;
				guardLog.asleep++;
			}

			guards[currentGuard] = guardLog;
		}
	}

	return guards;
}
function getResult(guardLog: Record<number, Gaurd>, partB: boolean = false) {
	const guards = Object.entries(guardLog);

	const [ID, { schedule }] = guards.sort((a, b) => {
		if (partB) {
			return Math.max(...b[1].schedule) - Math.max(...a[1].schedule);
		} else {
			return b[1].asleep - a[1].asleep;
		}
	})[0];

	return +ID * schedule.indexOf(Math.max(...schedule));
}
