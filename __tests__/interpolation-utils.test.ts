import { interpolate, interpolateBy, Interpolator, sortedPickAdjacent } from "../src";
import { InterpolationTable, weightedInterpolate } from "../src";
import { freeze } from "immer";

describe("interpolation-utils.ts", () => {
    describe("interpolate()", () => {
        const interpolator = (value: number, factor: number, lower: string, upper: string) => `${value}=${lower}:${upper}:${factor}`;
        it("interpolates above max using last two entries", () => {
            expect(interpolate(4, [[1, "a"], [2, "b"], [3, "c"]], interpolator))
                .toEqual("4=b:c:2");
        });
        it("interpolates below min using first two entries", () => {
            expect(interpolate(0, [[1, "a"], [2, "b"], [3, "c"]], interpolator))
                .toEqual("0=a:b:-1");
        });
        it("interpolates in range using adjacent entries", () => {
            expect(interpolate(1.25, [[1, "a"], [2, "b"], [3, "c"]], interpolator)).toEqual("1.25=a:b:0.25");
        });
        it("returns a match at a middle entry", () => {
            expect(interpolate(2, [[1, "a"], [2, "b"], [3, "c"]], interpolator)).toEqual("b");
        });
        it("returns a match at the first entry", () => {
            expect(interpolate(1, [[1, "a"], [2, "b"], [3, "c"]], interpolator)).toEqual("a");
        });
        it("returns a match at the last entry", () => {
            expect(interpolate(3, [[1, "a"], [2, "b"], [3, "c"]], interpolator)).toEqual("c");
        });
        it("returns a single entry if it matches the value exactly", () => {
            expect(interpolate(1, [[1, "a"]], interpolator)).toEqual("a");
        });
        it("throws when there are fewer than two entries and the value is not matched", () => {
            expect(() => interpolate(1, [], interpolator))
                .toThrow("Interpolation requires at least two reference entries.");
            expect(() => interpolate(1, [[2, "a"]], interpolator))
                .toThrow("Interpolation requires at least two reference entries.");
        });
    });
    describe("interpolateBy()", () => {
        type Entry = { k: number, v: string };
        const interpolator = (v: number, f: number, l: Entry, u: Entry): Entry => ({
            k: v,
            v: `${v}=${l.v}:${u.v}:${f}`,
        });
        it("interpolates using an iteratee", () => {
            expect(interpolateBy(1, [{ k: 0, v: "a" }, { k: 2, v: "b" }], ({ k }) => k, interpolator))
                .toEqual({ k: 1, v: `1=a:b:0.5` });
        });
    });
    describe("sortedPickAdjacent()", () => {
        it("returns the first entry if out of range low", () => {
            const [index, adjacent] = sortedPickAdjacent(0, [
                [100, "abc"],
                [200, "def"],
            ]);
            expect(index).toEqual(0);
            expect(adjacent[0]).toBe("abc");
        });
        it("returns the last entry if out of range high", () => {
            const [index, adjacent] = sortedPickAdjacent(300, [
                [100, "abc"],
                [200, "def"],
            ]);
            expect(index).toEqual(1);
            expect(adjacent[0]).toBe("def");
        });
        it("returns a single entry if exact match", () => {
            const [index, adjacent] = sortedPickAdjacent(200, [
                [100, "abc"],
                [200, "def"],
            ]);
            expect(index).toEqual(1);
            expect(adjacent[0]).toBe("def");
        });
        it("returns two adjacent entries if between", () => {
            const [index, adjacent] = sortedPickAdjacent(150, [
                [100, "abc"],
                [200, "def"],
            ]);
            expect(index).toEqual(0);
            expect(adjacent.length).toBe(2);
            expect(adjacent[0]).toBe("abc");
            expect(adjacent[1]).toBe("def");
        });
    });
    describe("weightedInterpolate()", () => {
        const table = freeze<InterpolationTable<number>>([
            [980, [
                [0, [
                    [0, 47],
                    [1, 44],
                    [2, 42],
                ]],
                [30, [
                    [0, 52],
                    [1, 51],
                    [2, 49],
                ]],
                [45, [
                    [0, 58],
                    [1, 58],
                    [2, 57],
                ]],
                [60, [
                    [0, 73],
                    [1, 72],
                    [2, 71],
                ]],
            ]],
            [1150, [
                [0, [
                    [0, 52],
                    [1, 51],
                    [2, 49],
                ]],
                [30, [
                    [0, 57],
                    [1, 55],
                    [2, 55],
                ]],
                [45, [
                    [0, 66],
                    [1, 64],
                    [2, 62],
                ]],
                [60, [
                    [0, 79],
                    [1, 78],
                    [2, 76],
                ]],
            ]],
            [1200, [
                [0, [
                    [0, 53],
                    [1, 52],
                    [2, 52],
                ]],
                [30, [
                    [0, 58],
                    [1, 57],
                    [2, 57],
                ]],
                [45, [
                    [0, 68],
                    [1, 67],
                    [2, 66],
                ]],
                [60, [
                    [0, 83],
                    [1, 81],
                    [2, 80],
                ]],
            ]],
        ]);
        const interpolator: Interpolator<number> = (_v: number, f: number, l: number, u: number) => l + f * (u - l);
        it("is correct when no interpolation is necessary", () => {
            const { value, weights } = weightedInterpolate(table, interpolator, [980, 0, 0]);
            expect(value).toBe(47);
            expect(weights).toStrictEqual([[47, 1]]);
        });
        it("is correct for 25/75 interpolation at level 0", () => {
            const { value, weights } = weightedInterpolate(table, interpolator, [1022.5, 60, 2]);
            expect(value).toBeCloseTo(72.25, 2);
            expect(weights).toHaveLength(2);
            expect(weights[0][0]).toBe(71);
            expect(weights[1][0]).toBe(76);
            expect(weights[0][1]).toBeCloseTo(0.7500, 4);
            expect(weights[1][1]).toBeCloseTo(0.2500, 4);
        });
        it("is correct for 75/25 interpolation at level 0", () => {
            const { value, weights } = weightedInterpolate(table, interpolator, [1107.5, 60, 2]);
            expect(value).toBeCloseTo(74.75, 2);
            expect(weights).toHaveLength(2);
            expect(weights[0][0]).toBe(76);
            expect(weights[1][0]).toBe(71);
            expect(weights[0][1]).toBeCloseTo(0.7500, 4);
            expect(weights[1][1]).toBeCloseTo(0.2500, 4);
        });
        it("is correct for 67/33 interpolation at level 1", () => {
            const { value, weights } = weightedInterpolate(table, interpolator, [1150, 20, 1]);
            expect(value).toBeCloseTo(53.6667, 4);
            expect(weights).toHaveLength(2);
            expect(weights[0][0]).toBe(55);
            expect(weights[1][0]).toBe(51);
            expect(weights[0][1]).toBeCloseTo(0.6667, 4);
            expect(weights[1][1]).toBeCloseTo(0.3333, 4);
        });
        it("is correct for 33/67 interpolation at level 1", () => {
            const { value, weights } = weightedInterpolate(table, interpolator, [1150, 10, 1]);
            expect(value).toBeCloseTo(52.3333, 4);
            expect(weights).toHaveLength(2);
            expect(weights[0][0]).toBe(51);
            expect(weights[1][0]).toBe(55);
            expect(weights[0][1]).toBeCloseTo(0.6667, 4);
            expect(weights[1][1]).toBeCloseTo(0.3333, 4);
        });
        it("is correct for 10/90 interpolation at level 2", () => {
            const { value, weights } = weightedInterpolate(table, interpolator, [1150, 30, 0.1]);
            expect(value).toBeCloseTo(56.8, 1);
            expect(weights).toHaveLength(2);
            expect(weights[0][0]).toBe(57);
            expect(weights[1][0]).toBe(55);
            expect(weights[0][1]).toBeCloseTo(0.9000, 4);
            expect(weights[1][1]).toBeCloseTo(0.1000, 4);
        });
        it("is correct when interpolation is required at all levels", () => {
            const { value, weights } = weightedInterpolate(table, interpolator, [1175, 15, 1.5]);
            expect(value).toBeCloseTo(53.5, 1);
            expect(weights).toHaveLength(5);
            expect(weights[0][0]).toBe(55);
            expect(weights[0][1]).toBeCloseTo(0.25, 4);
            expect(weights[1][0]).toBe(52);
            expect(weights[1][1]).toBeCloseTo(0.25, 4);
            expect(weights[2][0]).toBe(57);
            expect(weights[2][1]).toBeCloseTo(0.25, 4);
            expect(weights[3][0]).toBe(51);
            expect(weights[3][1]).toBeCloseTo(0.125, 4);
            expect(weights[4][0]).toBe(49);
            expect(weights[4][1]).toBeCloseTo(0.125, 4);
        });
    });
});
