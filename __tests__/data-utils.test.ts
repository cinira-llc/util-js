import { resolveUrl } from "../src/data-utils";

describe("data-utils.ts", () => {
    describe("resolveUrl()", () => {
        it("resolves an absolute string with base", () => {
            expect(resolveUrl("https://google.com", "http://microsoft.com"))
                .toStrictEqual(new URL("http://google.com"));
        });
        it("resolves an absolute string without base", () => {
            expect(resolveUrl("https://google.com")).toStrictEqual(new URL("http://google.com"));
        });
        it("resolves an absolute URL with base", () => {
            expect(resolveUrl(new URL("https://google.com"), new URL("https://microsoft.com")))
                .toStrictEqual(new URL("http://google.com"));
        });
        it("resolves an absolute URL without base", () => {
            expect(resolveUrl(new URL("https://google.com"))).toStrictEqual(new URL("http://google.com"));
        });
        it("resolves a relative string with Document base", () => {
            expect(resolveUrl("../something/else", { baseURI: "https://google.com/path/to/something" }))
                .toStrictEqual(new URL("https://google.com/path/to/something/else"));
        });
        it("resolves a relative string with string base", () => {
            expect(resolveUrl("../something/else", "https://google.com/path/to/something"))
                .toStrictEqual(new URL("https://google.com/path/to/something/else"));
        });
        it("resolves a relative string with URL base", () => {
            expect(resolveUrl("../something/else", new URL("https://google.com/path/to/something")))
                .toStrictEqual(new URL("https://google.com/path/to/something/else"));
        });
        it("resolves a relative string without base", () => {
            expect(() => resolveUrl("../something/else")).toThrowError();
        });
    });
});
