import {isKinded, isTimestamped} from "../src";
import {DateTime} from "luxon";

describe("util-types.ts", () => {
    describe("isKinded()", () => {
        test("Invalid kinded object (no kind property)", () => {
            expect(isKinded({}, "blah")).toBe(false);
        });
        test("Invalid kinded object (kind value not a string)", () => {
            expect(isKinded({kind: 123}, "blah")).toBe(false);
        });
        test("Valid kinded object (does not match kind value)", () => {
            expect(isKinded({kind: "testing"}, "blah")).toBe(false);
        });
        test("Valid kinded object (matches kind value)", () => {
            expect(isKinded({kind: "testing"}, "testing")).toBe(true);
        });
    });
    describe("isTimestamped()", () => {
        test("Invalid timestamped object (no timestamp property)", () => {
            expect(isTimestamped({})).toBe(false);
        });
        test("Invalid timestamped object (timestamp value not a DateTime)", () => {
            expect(isTimestamped({timestamp: 123})).toBe(false);
        });
        test("Valid timestamped object", () => {
            expect(isTimestamped({timestamp: DateTime.utc()})).toBe(true);
        });
    });
});
