import {flattenValues, scale, validateIn} from "../src";

describe("index.ts", () => {
    describe("flattenValues()", () => {
        test("for a single value", () => {
            expect(flattenValues("value1")).toStrictEqual(["value1"]);
        });
        test("for a multiple values", () => {
            expect(flattenValues("value1", "value2")).toStrictEqual(["value1", "value2"]);
        });
        test("for a single array with a single value", () => {
            expect(flattenValues(["value1"])).toStrictEqual(["value1"]);
        });
        test("for multiple single values", () => {
            expect(flattenValues("value1", "value2", "value3"))
                .toStrictEqual(["value1", "value2", "value3"]);
        });
        test("for multiple arrays of single values", () => {
            expect(flattenValues(["value1"], ["value2"], ["value3"]))
                .toStrictEqual(["value1", "value2", "value3"]);
        });
        test("for a mixture of single values and arrays of single values", () => {
            expect(flattenValues(["value1"], "value2", ["value3", "value4"]))
                .toStrictEqual(["value1", "value2", "value3", "value4"]);
        });
    });
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
    test("validateIn()", () => {
        const validate = validateIn([1], 2, [3], [4, 5]);
        expect(validate(0)).toBe(false);
        expect(validate(1)).toBe(true);
        expect(validate(2)).toBe(true);
        expect(validate(3)).toBe(true);
        expect(validate(4)).toBe(true);
        expect(validate(5)).toBe(true);
        expect(validate(6)).toBe(false);
    });
});
