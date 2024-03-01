import _ from "lodash";

/**
 * Dimensions of a 2D plane.
 */
export type Dimensions = [width: number, height: number];

/**
 * Point on a 2D plane.
 */
export type Point = [x: number, y: number];

/**
 * Path of points on a 2D plane.
 */
export type Path = Point[];

/**
 * Type guard for {@link Path}.
 *
 * @param val the value.
 */
export function isPath(val: unknown): val is Path {
    return _.isArray(val)
        && -1 === val.findIndex(v => !isPoint(v));
}

/**
 * Type guard for {@link Point}.
 *
 * @param val the value.
 */
export function isPoint(val: unknown): val is Point {
    return _.isArray(val)
        && 2 === val.length
        && -1 === val.findIndex(v => !_.isNumber(v));
}
