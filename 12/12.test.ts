import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./12.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(325);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(3738);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(999999999374);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe(3900000002467);
		});
	});
});
