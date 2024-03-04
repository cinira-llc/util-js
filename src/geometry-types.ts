import _ from "lodash";

/**
 * Box on a 2D plane, defined by top-left and bottom-right corners.
 */
export type Box = [
    topLeft: Point,
    bottomRight: Point,
];

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
 * Type guard for {@link Box}.
 *
 * @param val the value.
 */
export function isBox(val: unknown): val is Box {
    return _.isArray(val)
        && 2 === val.length
        && isPoint(val[0])
        && isPoint(val[1]);
}

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
