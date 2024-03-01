import {interpolate} from "../src/interpolation-utils";

describe("interpolation-utils.ts", () => {
    describe("interpolate()", () => {
        const interpolator = (factor: number, lower: string, upper: string) => `${lower}:${upper}:${factor}`;
        it("interpolates above max using last two entries", () => {
            expect(interpolate(4, [[1, "a"], [2, "b"], [3, "c"]], interpolator))
                .toEqual("b:c:2");
        });
        it("interpolates below min using first two entries", () => {
            expect(interpolate(0, [[1, "a"], [2, "b"], [3, "c"]], interpolator))
                .toEqual("a:b:-1");
        });
        it("interpolates in range using adjacent entries", () => {
            expect(interpolate(1.25, [[1, "a"], [2, "b"], [3, "c"]], interpolator)).toEqual("a:b:0.25");
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
    });
});
