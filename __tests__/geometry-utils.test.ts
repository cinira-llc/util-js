import {
    cartesianToPolar,
    degreesToRadians,
    intersection,
    polarDistance,
    polarToCartesian,
    radiansToDegrees,
    radianSum,
    scaledPath,
    sortedPath,
} from "../src";

describe("geometry-utils.ts", () => {
    describe("cartesianToPolar()", () => {
        describe("converts points", () => {
            it("converts 1 unit N", () => {
                const [rho, theta] = cartesianToPolar([0, -1]);
                expect(rho).toBeCloseTo(1);
                expect(theta).toBeCloseTo(3 * Math.PI / 2);
            });
            it("converts 1 unit E", () => {
                const [x, y] = cartesianToPolar([1, 0]);
                expect(x).toBeCloseTo(1);
                expect(y).toBeCloseTo(0);
            });
            it("converts 1 unit S", () => {
                const [x, y] = cartesianToPolar([0, 1]);
                expect(x).toBeCloseTo(1);
                expect(y).toBeCloseTo(Math.PI / 2);
            });
            it("converts 1 unit W", () => {
                const [x, y] = cartesianToPolar([-1, 0]);
                expect(x).toBeCloseTo(1);
                expect(y).toBeCloseTo(Math.PI);
            });
        });
    });
    describe("degreesToRadians()", () => {
        it("returns correct normalized results", () => {
            expect(degreesToRadians(0, true)).toBeCloseTo(0);
            expect(degreesToRadians(90, true)).toBeCloseTo(Math.PI / 2);
            expect(degreesToRadians(180, true)).toBeCloseTo(Math.PI);
            expect(degreesToRadians(270, true)).toBeCloseTo(3 * Math.PI / 2);
            expect(degreesToRadians(360, true)).toBeCloseTo(0);
            expect(degreesToRadians(-360, true)).toBeCloseTo(0);
            expect(degreesToRadians(720, true)).toBeCloseTo(0);
            expect(degreesToRadians(-720, true)).toBeCloseTo(0);
        });
        it("returns correct non-normalized results", () => {
            expect(degreesToRadians(0)).toBeCloseTo(0);
            expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
            expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
            expect(degreesToRadians(270)).toBeCloseTo(3 * Math.PI / 2);
            expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI);
            expect(degreesToRadians(-360)).toBeCloseTo(-2 * Math.PI);
            expect(degreesToRadians(720)).toBeCloseTo(4 * Math.PI);
            expect(degreesToRadians(-720)).toBeCloseTo(-4 * Math.PI);
        });
    });
    describe("radiansToDegrees()", () => {
        it("returns correct normalized results", () => {
            expect(radiansToDegrees(0, true)).toBeCloseTo(0);
            expect(radiansToDegrees(Math.PI / 2, true)).toBeCloseTo(90);
            expect(radiansToDegrees(Math.PI, true)).toBeCloseTo(180);
            expect(radiansToDegrees(3 * Math.PI / 2, true)).toBeCloseTo(270);
            expect(radiansToDegrees(2 * Math.PI, true)).toBeCloseTo(0);
            expect(radiansToDegrees(-2 * Math.PI, true)).toBeCloseTo(0);
            expect(radiansToDegrees(4 * Math.PI, true)).toBeCloseTo(0);
            expect(radiansToDegrees(-4 * Math.PI, true)).toBeCloseTo(0);
        });
        it("returns correct non-normalized results", () => {
            expect(radiansToDegrees(0)).toBeCloseTo(0);
            expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90);
            expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
            expect(radiansToDegrees(3 * Math.PI / 2)).toBeCloseTo(270);
            expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360);
            expect(radiansToDegrees(-2 * Math.PI)).toBeCloseTo(-360);
            expect(radiansToDegrees(4 * Math.PI)).toBeCloseTo(720);
            expect(radiansToDegrees(-4 * Math.PI)).toBeCloseTo(-720);
        });
    });
    describe("intersection()", () => {
        it("finds intersections at endpoints", () => {
            expect(intersection([[0, 0], [1, 1]], [[0, 0], [0, 1]])).toEqual([0, 0]);
            expect(intersection([[0, 0], [1, 1]], [[1, 1], [2, 1]])).toEqual([1, 1]);
            expect(intersection([[1, 1], [1, 2]], [[0, 1], [2, 1]])).toEqual([1, 1]);
            expect(intersection([[1, 1], [1, 2]], [[1, 2], [1, 3]])).toEqual([1, 2]);
            expect(intersection([[1, 1], [2, 1]], [[2, 1], [3, 1]])).toEqual([2, 1]);
        });
        it("finds intersections at mid segment", () => {
            expect(intersection([[0, 0], [1, 1]], [[1, 0], [0, 1]])).toEqual([0.5, 0.5]);
        });
        it("returns undefined when there is no intersection", () => {
            expect(intersection([[0, 0], [0, 1]], [[1, 0], [1, 1]])).toBeUndefined();
        });
    });
    describe("polarDistance()", () => {
        it("calculates some known values", () => {
            expect(polarDistance([0, 0], [0, 0])).toBeCloseTo(0);
            expect(polarDistance([0, 0], [1, 0])).toBeCloseTo(1);
            expect(polarDistance([0, 0], [1, Math.PI / 2])).toBeCloseTo(1);
            expect(polarDistance([0, 0], [1, Math.PI])).toBeCloseTo(1);
            expect(polarDistance([0, 0], [1, 3 * Math.PI / 2])).toBeCloseTo(1);
            expect(polarDistance([1, 0], [1, Math.PI])).toBeCloseTo(2);
            expect(polarDistance([1, 3 * Math.PI / 2], [1, Math.PI / 2])).toBeCloseTo(2);
            expect(polarDistance([1, Math.PI], [1, 0])).toBeCloseTo(2);
            expect(polarDistance([1, Math.PI / 2], [1, 3 * Math.PI / 2])).toBeCloseTo(2);
        });
    });
    describe("polarToCartesian()", () => {
        describe("converts points", () => {
            it("converts 1 unit N", () => {
                const [x, y] = polarToCartesian([1, 3 * Math.PI / 2]);
                expect(x).toBeCloseTo(0);
                expect(y).toBeCloseTo(-1);
            });
            it("converts 1 unit E", () => {
                const [x, y] = polarToCartesian([1, 0]);
                expect(x).toBeCloseTo(1);
                expect(y).toBeCloseTo(0);
            });
            it("converts 1 unit S", () => {
                const [x, y] = polarToCartesian([1, Math.PI / 2]);
                expect(x).toBeCloseTo(0);
                expect(y).toBeCloseTo(1);
            });
            it("converts 1 unit W", () => {
                const [x, y] = polarToCartesian([1, Math.PI]);
                expect(x).toBeCloseTo(-1);
                expect(y).toBeCloseTo(0);
            });
        });
    });
    describe("radianSum()", () => {
        it("returns correct results for known values", () => {
            expect(radianSum(0, 0)).toBeCloseTo(0);
            expect(radianSum(0, Math.PI)).toBeCloseTo(Math.PI);
            expect(radianSum(Math.PI, 0)).toBeCloseTo(Math.PI);
            expect(radianSum(Math.PI, Math.PI)).toBeCloseTo(0);
            expect(radianSum(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
            expect(radianSum(0, -Math.PI / 2)).toBeCloseTo(3 * Math.PI / 2);
            expect(radianSum(-Math.PI / 2, 0)).toBeCloseTo(3 * Math.PI / 2);
            expect(radianSum(Math.PI / 2, 0)).toBeCloseTo(Math.PI / 2);
            expect(radianSum(-Math.PI / 2, Math.PI / 2)).toBeCloseTo(0);
            expect(radianSum(Math.PI / 2, -Math.PI / 2)).toBeCloseTo(0);
            expect(radianSum(0, 2 * Math.PI)).toBeCloseTo(0);
            expect(radianSum(0, -2 * Math.PI)).toBeCloseTo(0);
            expect(radianSum(0, 4 * Math.PI)).toBeCloseTo(0);
            expect(radianSum(0, -4 * Math.PI)).toBeCloseTo(0);
        });
    });
    describe("scaledPath()", () => {
        it("rounds paths by default", () => {
            expect(scaledPath([[1.25, 2.25], [3.25, 4.25]])).toEqual([[1, 2], [3, 4]]);
        });
        it("rounds single points by default", () => {
            expect(scaledPath([1.25, 2.25])).toEqual([1, 2]);
        });
        it("scales paths", () => {
            expect(scaledPath([[0.123, 1.234], [2.345, 3.456], [4.567, 5.678]], 2))
                .toEqual([[0.12, 1.23], [2.35, 3.46], [4.57, 5.68]]);
        });
        it("scales single points", () => {
            expect(scaledPath([1.2345, 2.3456], 2)).toEqual([1.23, 2.35]);
        });
    });
    describe("sortedPath()", () => {
        it("sorts by ascending X-coordinate by default", () => {
            expect(sortedPath([[1, 0], [2, 2], [0, 3]])).toEqual([[0, 3], [1, 0], [2, 2]]);
        });
        it("sorts by descending X-coordinate", () => {
            expect(sortedPath([[1, 1], [2, 1], [0, 1]], false, true))
                .toEqual([[2, 1], [1, 1], [0, 1]]);
        });
        it("sorts by ascending Y-coordinate", () => {
            expect(sortedPath([[1, 0], [2, 2], [0, 3]], true)).toEqual([[1, 0], [2, 2], [0, 3]]);
        });
        it("sorts by descending Y-coordinate", () => {
            expect(sortedPath([[1, 0], [2, 2], [0, 3]], true, true))
                .toEqual([[0, 3], [2, 2], [1, 0]]);
        });
    });
});
