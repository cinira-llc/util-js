import {interpolate, interpolateBy, sortedPickAdjacent} from "../src";

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
            expect(interpolateBy(1, [{k: 0, v: "a"}, {k: 2, v: "b"}], ({k}) => k, interpolator))
                .toEqual({k: 1, v: `1=a:b:0.5`});
        });
    });
    describe("sortedPickAdjacent()", () => {
        it("returns the first entry if out of range low", () => {
            const [index, adjacent] = sortedPickAdjacent(0, [
                [100, "abc"],
                [200, "def"]
            ]);
            expect(index).toEqual(0);
            expect(adjacent[0]).toBe("abc");
        });
        it("returns the last entry if out of range high", () => {
            const [index, adjacent] = sortedPickAdjacent(300, [
                [100, "abc"],
                [200, "def"]
            ]);
            expect(index).toEqual(1);
            expect(adjacent[0]).toBe("def");
        });
        it("returns a single entry if exact match", () => {
            const [index, adjacent] = sortedPickAdjacent(200, [
                [100, "abc"],
                [200, "def"]
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
});
