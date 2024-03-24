import path from "path";
import { expect, test, describe } from "vitest";
import { solveA, solveB } from "./07";

const currentDay = path.basename(__dirname);

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		test("Example", () => {
			expect(solveA("example_a", currentDay)).toBe("CABDFE");
		});

		test("Solution", () => {
			expect(solveA("input", currentDay)).toBe("ABGKCMVWYDEHFOPQUILSTNZRJX");
		});
	});

	describe("Part B", () => {
		test("Example", () => {
			expect(solveB("example_b", currentDay, 2)).toBe(15);
		});

		test("Solution", () => {
			expect(solveB("input", currentDay, 5)).toBe(898);
		});
	});
});
