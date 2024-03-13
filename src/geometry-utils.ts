import _ from "lodash";
import { isPath } from "./geometry-types";

import type { Path, Point } from "./geometry-types";

/**
 * Convert a point or path of points from Cartesian to polar coordinates.
 *
 * @param cart the path or point to convert.
 * @param origin the Cartesian origin.
 */
export function cartesianToPolar<P extends Path | Point>(cart: P, origin: Point = [0, 0]): P {
    if (_.isNumber(cart[0])) {
        const [x, y] = cart as Point;
        const dx = x - origin[0];
        const dy = y - origin[1];
        return [Math.sqrt(dx * dx + dy * dy), (TWO_PI + Math.atan2(dy, dx)) % TWO_PI] as P;
    }
    const path = cart as Path;
    return path.map(p => cartesianToPolar(p, origin)) as P;
}

/**
 * Convert degrees to radians.
 *
 * @param degrees angle in degrees.
 * @param normalize whether to normalize the angle to the range [0, 2π).
 */
export function degreesToRadians(degrees: number, normalize = false) {
    const radians = degrees / DEGREES_PER_RADIAN;
    return normalize ? radianSum(0, radians) : radians;
}

/**
 * Find the point, if any, at which two paths intersect. Only the *first* point (along path `p0`) of intersection is
 * returned.
 *
 * @param p0 the first path.
 * @param p1 the second path.
 */
export function intersection(p0: Path, p1: Path) {
    const p0l = p0.length;
    const p1l = p1.length;
    for (let i0 = 0; i0 < p0l; i0 += 1) {
        const pt0 = p0[i0];
        for (let i1 = 0; i1 < p1l; i1 += 1) {
            const pt2 = p1[i1];
            if (_.isEqual(pt0, pt2)) {
                return pt0;
            } else if (i0 < p0l - 1 && i1 < p1l - 1) {
                const [p0x, p0y] = pt0;
                const [p1x, p1y] = i0 === p0.length - 1 ? pt0 : p0[i0 + 1];
                const [p2x, p2y] = pt2;
                const [p3x, p3y] = i1 === p1.length - 1 ? pt2 : p1[i1 + 1];
                const s1x = p1x - p0x;
                const s1y = p1y - p0y;
                const s2x = p3x - p2x;
                const s2y = p3y - p2y;
                const s = (-s1y * (p0x - p2x) + s1x * (p0y - p2y)) / (-s2x * s1y + s1x * s2y);
                const t = (s2x * (p0y - p2y) - s2y * (p0x - p2x)) / (-s2x * s1y + s1x * s2y);
                if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                    return [p0x + t * s1x, p0y + t * s1y] as Point;
                }
            }
        }
    }
}

/**
 * Calculate the distance between two points in polar coordinates.
 *
 * @param p0 the first point.
 * @param p1 the second point.
 */
export function polarDistance(p0: Point, p1: Point) {
    const [r0, t0] = p0;
    const [r1, t1] = p1;
    return Math.sqrt(r0 * r0 + r1 * r1 - 2 * r0 * r1 * Math.cos(t0 - t1));
}

/**
 * Convert a point or path of points from polar to Cartesian coordinates.
 *
 * @param polar the path or point to convert.
 * @param origin the Cartesian origin.
 */
export function polarToCartesian<P extends Path | Point>(polar: P, origin: Point = [0, 0]): P {
    if (_.isNumber(polar[0])) {
        const [rho, theta] = polar as Point;
        return [origin[0] + rho * Math.cos(theta), origin[1] + rho * Math.sin(theta)] as P;
    }
    return (polar as Path).map(p => polarToCartesian(p, origin)) as P;
}

/**
 * Convert radians to degrees.
 *
 * @param radians angle in radians.
 * @param normalize whether to normalize the angle to the range [0, 360).
 */
export function radiansToDegrees(radians: number, normalize = false) {
    return (normalize ? radianSum(0, radians) : radians) * DEGREES_PER_RADIAN;
}

/**
 * Sum two angles in radians and normalize the result to the range [0, 2π).
 *
 * @param r0 the first angle.
 * @param rX additional angles.
 */
export function radianSum(r0: number, ...rX: number[]) {
    return (_.sum([r0, ...rX]) + (1 + rX.length) * TWO_PI) % TWO_PI;
}

/**
 * Scale all coordinates in a point or path to a given number of decimal digits.
 *
 * @param path the path or point.
 * @param digits the scale.
 */
export function scaledPath<P extends Path | Point>(path: P, digits: number = 0): P {
    if (_.isEmpty(path)) {
        return path;
    }
    const wasPath = isPath(path);
    const coords = _.flattenDeep(path);
    if (0 === digits) {
        const scaled = _.chunk(coords.map(Math.round), 2);
        return (wasPath ? scaled : scaled[0]) as P;
    }
    const multiplier = Math.pow(10, digits);
    const scaled = _.chunk(coords.map(v => Math.round(v * multiplier) / multiplier), 2);
    return (wasPath ? scaled : scaled[0]) as P;
}

/**
 * Sort the points in a path by either the X- or Y-coordinate, specified as a `coord` index, and in either ascending or
 * descending order.
 *
 * @param path the path.
 * @param vert sort on the vertical axis, default horizontal.
 * @param desc sort in descending order, default ascending.
 */
export function sortedPath(path: Path, vert: boolean = false, desc: boolean = false): Path {
    const key = vert ? 1 : 0;
    const order = desc ? -1 : 1;
    return [...path].sort((pt0, pt1) => order * (pt0[key] - pt1[key]));
}

/**
 * Degrees per radian.
 */
const DEGREES_PER_RADIAN = 180 / Math.PI;

/**
 * Two times π.
 */
const TWO_PI = 2 * Math.PI;
