import path from "path";
import { expect, test, describe } from "vitest";
import { solveA, solveB } from "./14";

const currentDay = path.basename(__dirname);

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		test("Example", () => {
			expect(solveA("example_a", currentDay)).toBe("5941429882");
		});
		test("Solution", () => {
			expect(solveA("input", currentDay)).toBe("6548103910");
		});
	});

	describe("Part B", () => {
		test("Example", () => {
			expect(solveB("example_b", currentDay)).toBe("2018");
		});
		test("Solution", () => {
			expect(solveB("input", currentDay)).toBe("20198090");
		});
	});
});
