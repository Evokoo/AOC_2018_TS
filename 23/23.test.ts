import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./23.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2018 - Day ${currentDay}`, () => {
	describe.skip("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(7);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(595);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(36);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe(88122632);
		});
	});
});

// 32 [ { x: 3095258, y: 27939570, z: 54977234 }, 831, 86012062 ]
// 64 [ { x: 9499654, y: 28063533, z: 47606827 }, 875, 85170014 ]
// 80 [ { x: 5671713, y: 25817646, z: 48625697 }, 877, 80115056 ],
// 128 [ { x: 11748199, y: 27906710, z: 48467723 }, 891, 88122632 ],
// 100? [ { x: 12216673, y: 29581459, z: 46324500 }, 906, 88122632 ]
// 128
