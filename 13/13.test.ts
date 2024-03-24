import path from "path";
import { expect, test, describe } from "vitest";
import { solveA, solveB } from "./13";

const currentDay = path.basename(__dirname);

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		test("Example", () => {
			expect(solveA("example_a", currentDay)).toBe("7,3");
		});

		test("Solution", () => {
			expect(solveA("input", currentDay)).toBe("102,114");
		});
	});

	describe("Part B", () => {
		test("Example", () => {
			expect(solveB("example_b", currentDay)).toBe("6,4");
		});

		test("Solution", () => {
			expect(solveB("input", currentDay)).toBe("146,87");
		});
	});
});
