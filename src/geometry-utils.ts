import _ from "lodash";
import { isPath, Path, Point } from "./geometry-types";

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
    return _.transform(path, (polar, next) => {
        const prev = 0 === polar.length ? origin : path[polar.length - 1];
        const p = cartesianToPolar(next, prev);
        polar.push(p);
    }, [] as Path) as P;
}

/**
 * Find the point, if any, at which two paths intersect. Only the *first* point (along path `p0`) of intersection is
 * returned.
 *
 * @param p0 the first path.
 * @param p1 the second path.
 */
export function intersection(p0: Path, p1: Path) {
    for (let i0 = 0; i0 < p0.length - 1; i0 += 1) {
        const [p0x, p0y] = p0[i0];
        const [p1x, p1y] = p0[i0 + 1];
        for (let i1 = 0; i1 < p1.length - 1; i1 += 1) {
            const [p2x, p2y] = p1[i1];
            const [p3x, p3y] = p1[i1 + 1];
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
    return _.transform(polar as Path, (cart, next) => {
        const prev = 0 === cart.length ? origin : cart[cart.length - 1];
        cart.push(polarToCartesian(next, prev));
    }, [] as Path) as P;
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
 * Two times π.
 */
const TWO_PI = 2 * Math.PI;
