import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./11.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe("21,186");
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe("20,54");
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe("90,269,16");
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe("233,93,13");
		});
	});
});
