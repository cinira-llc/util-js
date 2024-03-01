import { cartesianToPolar, intersection, polarToCartesian, scalePath, sortedPath } from "../src/geometry-utils";

describe("geometry-utils.ts", () => {
    describe("cartesianToPolar()", () => {
        it("converts paths", () => {
            const path = cartesianToPolar([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]);
            expect(path.length).toBe(5);
            const [p0, p1, p2, p3, p4] = path;
            expect(p0[0]).toBeCloseTo(0);
            expect(p0[1]).toBeCloseTo(0);
            expect(p1[0]).toBeCloseTo(1);
            expect(p1[1]).toBeCloseTo(0);
            expect(p2[0]).toBeCloseTo(1);
            expect(p2[1]).toBeCloseTo(Math.PI / 2);
            expect(p3[0]).toBeCloseTo(1);
            expect(p3[1]).toBeCloseTo(Math.PI);
            expect(p4[0]).toBeCloseTo(1);
            expect(p4[1]).toBeCloseTo(3 * Math.PI / 2);
        });
        describe("converts points", () => {
            it("converts 1 unit N", () => {
                const [rho, theta] = cartesianToPolar([0, -1]);
                expect(rho).toBeCloseTo(1);
                expect(theta).toBeCloseTo(3 * Math.PI / 2);
            });
            test("converts 1 unit E", () => {
                const [x, y] = cartesianToPolar([1, 0]);
                expect(x).toBeCloseTo(1);
                expect(y).toBeCloseTo(0);
            });
            test("converts 1 unit S", () => {
                const [x, y] = cartesianToPolar([0, 1]);
                expect(x).toBeCloseTo(1);
                expect(y).toBeCloseTo(Math.PI / 2);
            });
            test("converts 1 unit W", () => {
                const [x, y] = cartesianToPolar([-1, 0]);
                expect(x).toBeCloseTo(1);
                expect(y).toBeCloseTo(Math.PI);
            });
        });
    });
    describe("intersection()", () => {
        it("finds intersections at endpoints", () => {
            expect(intersection([[0, 0], [1, 1]], [[0, 0], [0, 1]])).toEqual([0, 0]);
            expect(intersection([[0, 0], [1, 1]], [[1, 1], [2, 1]])).toEqual([1, 1]);
            expect(intersection([[1, 1], [1, 2]], [[0, 1], [2, 1]])).toEqual([1, 1]);
        });
        it("finds intersections at mid segment", () => {
            expect(intersection([[0, 0], [1, 1]], [[1, 0], [0, 1]])).toEqual([0.5, 0.5]);
        });
        it("returns undefined when there is no intersection", () => {
            expect(intersection([[0, 0], [0, 1]], [[1, 0], [1, 1]])).toBeUndefined();
        });
    });
    describe("polarToCartesian()", () => {
        it("converts paths", () => {
            const path = polarToCartesian([[0, 0], [1, 0], [1, Math.PI / 2], [1, Math.PI], [1, 3 * Math.PI / 2]]);
            expect(path.length).toBe(5);
            const [p0, p1, p2, p3, p4] = path;
            expect(p0[0]).toBeCloseTo(0);
            expect(p0[1]).toBeCloseTo(0);
            expect(p1[0]).toBeCloseTo(1);
            expect(p1[1]).toBeCloseTo(0);
            expect(p2[0]).toBeCloseTo(1);
            expect(p2[1]).toBeCloseTo(1);
            expect(p3[0]).toBeCloseTo(0);
            expect(p3[1]).toBeCloseTo(1);
            expect(p4[0]).toBeCloseTo(0);
            expect(p4[1]).toBeCloseTo(0);
        });
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
    describe("scalePath()", () => {
        it("rounds paths by default", () => {
            expect(scalePath([[1.25, 2.25], [3.25, 4.25]])).toEqual([[1, 2], [3, 4]]);
        });
        it("rounds single points by default", () => {
            expect(scalePath([1.25, 2.25])).toEqual([1, 2]);
        });
        it("scales paths", () => {
            expect(scalePath([[0.123, 1.234], [2.345, 3.456], [4.567, 5.678]], 2))
                .toEqual([[0.12, 1.23], [2.35, 3.46], [4.57, 5.68]]);
        });
        it("scales single points", () => {
            expect(scalePath([1.2345, 2.3456], 2)).toEqual([1.23, 2.35]);
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
