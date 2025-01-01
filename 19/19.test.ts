import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./19.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(7);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(984);
		});
	});

	describe("Part B", () => {
		it.skip("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(0);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe(10982400);
		});
	});
});
