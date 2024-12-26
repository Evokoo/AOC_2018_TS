import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./06.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(17);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(4976);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay, 32)).toBe(16);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay, 10000)).toBe(46462);
		});
	});
});
