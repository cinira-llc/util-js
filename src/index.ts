import {flattenValues, validateIn} from "./array-utils";
import {isPath, isPoint} from "./geometry-types";
import {cartesianToPolar, intersection, polarToCartesian, scaledPath, sortedPath} from "./geometry-utils";
import {interpolate, interpolateBy, sortedInterpolate, sortedPickAdjacent} from "./interpolation-utils";
import {scale} from "./number-utils";
import {isKinded, isTimestamped} from "./util-types";

import type {Creator, Kinded, Timestamped} from "./util-types";
import type {Dimensions, Path, Point} from "./geometry-types";

/* Library exports. */
export {
    Creator,
    Dimensions,
    Kinded,
    Path,
    Point,
    Timestamped,
    cartesianToPolar,
    flattenValues,
    interpolate,
    interpolateBy,
    intersection,
    isKinded,
    isPath,
    isPoint,
    isTimestamped,
    polarToCartesian,
    scale,
    scaledPath,
    sortedInterpolate,
    sortedPath,
    sortedPickAdjacent,
    validateIn,
};
