import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./13.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe("7,3");
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe("102,114");
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe("6,4");
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe("146,87");
		});
	});
});
