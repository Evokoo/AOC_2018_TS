import path from "path";
import { expect, test, describe } from "vitest";
import { solveA, solveB } from "./22";

const currentDay = path.basename(__dirname);

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		test("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(114);
		});

		test("Solution", () => {
			expect(solveA("input", currentDay)).toBe(6318);
		});
	});

	describe("Part B", () => {
		test("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(45);
		});

		test("Solution", () => {
			expect(solveB("input", currentDay)).toBe(1075);
		});
	});
});
