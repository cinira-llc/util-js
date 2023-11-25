import {scale} from "../src";

describe("number-utils.ts", () => {
    describe("scale()", () => {
        test("For decimal digits < 0", () => {
            expect(() => scale(123, -1)).toThrow(Error);
        });
        test("For zero decimal digits", () => {
            expect(scale(123.1, 0)).toBe(123);
            expect(scale(123.5, 0)).toBe(124);
        });
        test("For one decimal digit", () => {
            expect(scale(123.01, 1)).toBe(123);
            expect(scale(123.05, 1)).toBe(123.1);
        });
    });
});
