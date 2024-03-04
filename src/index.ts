import { flattenValues, validateIn } from "./array-utils";
import { isBox, isPath, isPoint } from "./geometry-types";
import { cartesianToPolar, intersection, polarToCartesian, scaledPath, sortedPath } from "./geometry-utils";
import { interpolate, interpolateBy, sortedInterpolate } from "./interpolation-utils";
import { scale } from "./number-utils";
import { isKinded, isTimestamped } from "./util-types";

import type { Creator, Kinded, Timestamped } from "./util-types";
import type { Box, Dimensions, Path, Point } from "./geometry-types";

/* Library exports. */
export {
    Box,
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
    isBox,
    isKinded,
    isPath,
    isPoint,
    isTimestamped,
    polarToCartesian,
    scale,
    scaledPath,
    sortedInterpolate,
    sortedPath,
    validateIn,
};
