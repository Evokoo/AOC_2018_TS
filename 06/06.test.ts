import path from "path";
import { expect, test, describe } from "vitest";
import { solveA, solveB } from "./06";

const currentDay = path.basename(__dirname);

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		test("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(17);
		});

		test("Solution", () => {
			expect(solveA("input", currentDay)).toBe(4976);
		});
	});

	describe("Part B", () => {
		test("Example", () => {
			expect(solveB("example_b", currentDay, 32)).toBe(16);
		});

		test("Solution", () => {
			expect(solveB("input", currentDay, 10000)).toBe(46462);
		});
	});
});
