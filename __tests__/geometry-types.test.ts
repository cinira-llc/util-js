import {isPath, isPoint} from "../src";

describe("geometry-types.ts", () => {
    describe("isPath()", () => {
        it("does not match an array of arrays which are not points", () => {
            expect(isPath([[]])).toBe(false);
            expect(isPath([[1, 2, 3]])).toBe(false);
        });
        it("matches an empty array", () => {
            expect(isPath([])).toBe(true);
        });
        it("matches an array of points", () => {
            expect(isPath([[1, 2]])).toBe(true);
        });
    });
    describe("isPoint()", () => {
        it("does not match an array which is not a point", () => {
            expect(isPoint([1, 2, 3])).toBe(false);
        });
        it("does not match an empty array", () => {
            expect(isPoint([])).toBe(false);
        });
        it("matches a point", () => {
            expect(isPoint([1, 2])).toBe(true);
        });
    });
});
