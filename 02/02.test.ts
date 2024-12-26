import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./02.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(12);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(6972);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe("fgij");
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe("aixwcbzrmdvpsjfgllthdyoqe");
		});
	});
});
