import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./07.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe("CABDFE");
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe("ABGKCMVWYDEHFOPQUILSTNZRJX");
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay, 2)).toBe(15);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay, 5)).toBe(898);
		});
	});
});
