// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	const tasks = parseInput(data);
	return runTasks(tasks);
}
export function solveB(fileName: string, day: string, helpers: number): number {
	const data = TOOLS.readData(fileName, day);
	const tasks = parseInput(data);
	return timeTasks(tasks, helpers);
}

type Requriements = { pre: Set<string>; post: Set<string> };
type Task = [string, Requriements];

// Functions
function parseInput(data: string): Task[] {
	const tasks: Map<string, Requriements> = new Map();

	for (const line of data.split("\n")) {
		const [_, a, b]: string[] = line.match(/[A-Z]/g) || [];

		const req_a = tasks.get(a) ?? { pre: new Set(), post: new Set() };
		const req_b = tasks.get(b) ?? { pre: new Set(), post: new Set() };

		req_a.post.add(b);
		req_b.pre.add(a);

		tasks.set(a, req_a);
		tasks.set(b, req_b);
	}

	return [...tasks];
}
function getValidTasks(
	tasks: Task[],
	complete: Set<string>,
	inProgress: Set<string> = new Set()
) {
	function canPlace(requirements: Set<string>, complete: Set<string>) {
		return [...requirements].every((id) => complete.has(id));
	}

	return tasks
		.filter(
			(task) =>
				!complete.has(task[0]) &&
				!inProgress.has(task[0]) &&
				canPlace(task[1].pre, complete)
		)
		.sort((a, b) => a[0].localeCompare(b[0]));
}
function runTasks(tasks: Task[]) {
	const complete: Set<string> = new Set();

	while (complete.size < tasks.length) {
		complete.add(getValidTasks(tasks, complete)[0][0]);
	}

	return [...complete].join("");
}
function timeTasks(tasks: Task[], helpers: number = 2): number {
	const complete: Set<string> = new Set();
	const inProgress: Set<string> = new Set();
	const workers: Map<string, number> = new Map();

	let time = 0;

	while (complete.size < tasks.length) {
		const validTasks = getValidTasks(tasks, complete, inProgress);

		for (const [id, timer] of [...workers]) {
			const newTime = Math.max(timer - 1, 0);

			if (newTime === 0) {
				complete.add(id);
				inProgress.delete(id);
				workers.delete(id);
			} else {
				workers.set(id, newTime);
			}
		}

		while (validTasks.length && workers.size < helpers) {
			const [id, _] = validTasks.shift()!;
			const timer = (helpers === 2 ? 0 : 60) + id.charCodeAt(0) - 65;

			workers.set(id, timer);
			inProgress.add(id);
		}

		time++;
	}

	return time;
}
