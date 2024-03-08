import _ from "lodash";
import { promises as fs } from "fs";

/**
 * Resolve a (possibly relative) URL string into a [URL] object.
 *
 * @param url the URL string.
 * @param base the base, if any, against which to resolve the URL if it is relative.
 */
export function resolveUrl(url: string | URL, base?: string | Pick<Document, "baseURI"> | URL) {
    if (null == base) {
        return new URL(url);
    } else if (_.isObject(base) && "baseURI" in base) {
        return new URL(url, base.baseURI);
    }
    return new URL(url, base);
}

/**
 * Read JSON data from the filesystem, optionally passing it through a type guard to verify its content.
 *
 * @param path the source path to read.
 * @param guard the optional type guard to verify structure of the JSON data.
 */
export async function readJson<T>(path: string, guard: (val: unknown) => val is T = always): Promise<T> {
    const data = JSON.parse(await fs.readFile(path, "utf-8"));
    if (!guard(data)) {
        throw Error("Unexpected JSON data type.");
    }
    return data;
}

/**
 * Fetch JSON data from a URL, optionally passing it through a type guard to verify its content.
 *
 * @param src the source URL to fetch.
 * @param guard the optional type guard to verify structure of the JSON data.
 */
export async function fetchJson<T>(src: string | URL, guard: (val: unknown) => val is T = always): Promise<T> {
    const response = await fetch(src);
    const data = await response.json();
    if (!guard(data)) {
        throw Error("Unexpected JSON data type.");
    }
    return data;
}

/**
 * Type guard that always returns true.
 *
 * @param val the value.
 */
function always<T>(val: unknown): val is T {
    return true;
}
