import _ from "lodash";
import {isPath, Path, Point} from "./geometry-types";

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
export function scalePath<P extends Path | Point>(path: P, digits: number = 0): P {
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
 * @param coord coordinate on which to sort, default `X`.
 * @param desc sort in descending order, default ascending.
 */
export function sortedPath(path: Path, coord: 0 | 1 = 0, desc: boolean = false): Path {
    const order = desc ? -1 : 1;
    return [...path].sort((pt0, pt1) => order * (pt0[coord] - pt1[coord]));
}

/**
 * Two times π.
 */
const TWO_PI = 2 * Math.PI;
