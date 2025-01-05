import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA } from "./25.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(8);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(346);
		});
	});
});
