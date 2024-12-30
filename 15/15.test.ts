import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./15.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(36334);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(235400);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(31284);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe(44492);
		});
	});
});
