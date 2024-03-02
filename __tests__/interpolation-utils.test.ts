import { interpolate, interpolateBy } from "../src";

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
        it("throws when there are fewer than two entries", () => {
            expect(() => interpolate(1, [], interpolator))
                .toThrow("Interpolation requires at least two reference entries.");
            expect(() => interpolate(1, [[1, "a"]], interpolator))
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
});
