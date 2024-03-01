import {cartesianToPolar, polarToCartesian} from "../src/geometry-utils";

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
});
