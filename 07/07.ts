// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day),
		steps = parseInput(data),
		{ path } = runTasks(steps);

	return path;
}
export function solveB(fileName: string, day: string, workers: number): number {
	const data = TOOLS.readData(fileName, day),
		steps = parseInput(data),
		{ time } = runTasks(steps, true, workers);

	return time;
}

//Run
solveB("example_b", "07", 2);

// Functions
type Tasks = { [key: string]: { post: Set<string>; pre: Set<string> } };
type Task = [string, { post: Set<string>; pre: Set<string> }];
type Worker = { job: string; timer: number };

function parseInput(data: string) {
	const tasks: Tasks = {};

	for (let step of data.split("\r\n")) {
		const [_, a, b] = step.match(/[A-Z]+/g) || [];

		const a_reqs = tasks[a] ?? { post: new Set(), pre: new Set() };
		const b_reqs = tasks[b] ?? { post: new Set(), pre: new Set() };

		a_reqs.post.add(b);
		b_reqs.pre.add(a);

		tasks[a] = a_reqs;
		tasks[b] = b_reqs;
	}

	return tasks;
}
function requirementMet(complete: Set<string>, requirements: Set<string>) {
	return [...requirements].every((requirement) => complete.has(requirement));
}
function getValidTasks(
	tasks: Task[],
	complete: Set<string>,
	inProgress: Set<string>
) {
	return tasks
		.filter(
			(task) =>
				!complete.has(task[0]) &&
				!inProgress.has(task[0]) &&
				requirementMet(complete, task[1].pre)
		)
		.sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0));
}
function runTasks(tasks: Tasks, partB: boolean = false, helpers: number = 2) {
	const complete: Set<string> = new Set();
	const inProgress: Set<string> = new Set();
	const taskList = Object.entries(tasks);

	let workers: Worker[] = Array.from({ length: helpers }, () => ({
		job: "",
		timer: 0,
	}));

	let time = 0;

	while (complete.size < taskList.length) {
		const validTasks = getValidTasks(taskList, complete, inProgress);

		if (partB) {
			workers = workers.map((worker) => {
				worker.timer = Math.max(worker.timer - 1, 0);

				if (worker.timer === 0) {
					if (worker.job) {
						complete.add(worker.job);
						inProgress.delete(worker.job);
					}

					if (validTasks.length) {
						const job = validTasks.shift()![0];
						const timer = (helpers === 2 ? 0 : 60) + job.charCodeAt(0) - 65;

						inProgress.add(job);
						return { job, timer };
					} else {
						return { job: "", timer: 0 };
					}
				} else {
					return worker;
				}
			});

			time++;
		} else {
			complete.add(validTasks[0][0]);
		}
	}

	return { path: [...complete].join(""), time };
}
