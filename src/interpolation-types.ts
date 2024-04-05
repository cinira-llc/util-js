/**
 * Interpolation callback.
 */
export type Interpolator<C> = (value: number, factor: number, upper: C, lower: C) => C;

/**
 * Single level in an n-dimensional interpolation table.
 */
export interface InterpolationTable<C> extends Array<[
    value: number,
    entry: C | InterpolationTable<C>
]> {
}

/**
 * Result of a weighted interpolation.
 */
export interface WeightedInterpolation<E> {
    value: E;
    weights: [
        element: E,
        weight: number
    ][];
}
