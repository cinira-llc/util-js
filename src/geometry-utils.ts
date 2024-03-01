import _ from "lodash";
import {Path, Point} from "./geometry-types";

/**
 * Convert a point or path of points from Cartesian to polar coordinates.
 *
 * @param cart the path or point to convert.
 * @param origin the Cartesian origin.
 */
export function cartesianToPolar<P extends Point | Path>(cart: P, origin: Point = [0, 0]): P {
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
export function polarToCartesian<P extends Point | Path>(polar: P, origin: Point = [0, 0]): P {
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
 * Two times π.
 */
const TWO_PI = 2 * Math.PI;
