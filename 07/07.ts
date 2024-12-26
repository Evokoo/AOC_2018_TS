// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	const tasks = parseInput(data);
	return runTasks(tasks);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
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

function getValidTasks(taskList: Task[], complete: Set<string>) {
	function canPlace(requirements: Set<string>, complete: Set<string>) {
		return [...requirements].every((id) => complete.has(id));
	}

	return taskList
		.filter((task) => !complete.has(task[0]) && canPlace(task[1].pre, complete))
		.sort((a, b) => a[0].localeCompare(b[0]));
}

function runTasks(tasks: Task[]) {
	const complete: Set<string> = new Set();

	while (complete.size < tasks.length) {
		complete.add(getValidTasks(tasks, complete)[0][0]);
	}

	return [...complete].join("");
}
