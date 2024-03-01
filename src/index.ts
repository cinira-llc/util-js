import {flattenValues, validateIn} from "./array-utils";
import {cartesianToPolar, polarToCartesian} from "./geometry-utils";
import {interpolate, sortedInterpolate} from "./interpolation-utils";
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
    isKinded,
    isTimestamped,
    polarToCartesian,
    scale,
    sortedInterpolate,
    validateIn
};
