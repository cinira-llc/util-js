import _, {ArrayIterator} from "lodash";

/**
 * Interpolate an entry of some type around or between some list of known entries. Each entry must be associated with
 * a value.
 *
 * If an entry in the list matches `value` exactly, that entry is returned and no interpolation is performed. If no
 * entry matches, then the interpolator is invoked with the nearest *two* entries from the list.
 *
 * If `value` falls *before* the value of any entry in the list, the interpolator will be provided with the first two
 * entries (both of which will have values greater than `value`.) If `value` falls *after* the value of any entry in
 * the list, the interpolator will be provided with the last two entries (both of which will have values less than
 * `value`.) Otherwise, the *surrounding* entries will be provided.
 *
 * The interpolator is also provided an interpolation `factor` describing the position of the entry to be interpolated
 * with respect to the provided entries. If `factor` is 0.5, the interpolator should return an entry halfway between
 * the provided entries. If `factor` is 2.0, it should return an entry that is one unit above the *upper* entry. If
 * `factor` is -1, it should return an entry that is one unit below the *lower* entry.
 *
 * If the interpolator does not support interpolation below the minimum or above the maximum, it should throw if
 * `factor` is not in range `[0..1]`.
 *
 * **The `entries` array must contain at least two entries.**
 *
 * @param value the value at which to interpolate.
 * @param entries the values and entries.
 * @param interpolator the interpolator callback.
 */
export function interpolate<E>(
    value: number,
    entries: [number, E][],
    interpolator: (value: number, factor: number, lE: E, uE: E) => E,
) {
    const sorted = [...entries].sort(([v0], [v1]) => v0 - v1);
    return sortedInterpolate(value, sorted, interpolator);
}

/**
 * Given a list of entries containing some *value* property, pick the one or two entries that are adjacent to a given
 * value, returning the index of the *first* adjacent entry and the adjacent entries themselves.
 *
 * * If `value` exactly matches one of the entries, that entry will be returned.
 * * If `value` falls before the first entry, the first entry will be returned.
 * * If `value` falls after the last entry, the last entry will be returned.
 * * If `value` falls between two entries, those two entries will be returned (preceding then following).
 *
 * @param value the value.
 * @param entries the entries.
 */
export function sortedPickAdjacent<E>(value: number, entries: [number, E][]): [number, E[]] {
    const uI = entries.findIndex(([val]) => val >= value);
    if (-1 === uI) {
        return [entries.length - 1, [entries[entries.length - 1][1]]];
    }
    const [uV, uE] = entries[uI];
    if (uV === value || 0 === uI) {
        return [uI, [uE]];
    }
    return [uI - 1, [entries[uI - 1][1], uE]];
}

/**
 * Same as {@link interpolate} but requires that `entries` already be sorted by ascending `value`.
 *
 * @param value the value at which to interpolate.
 * @param entries the values and entries.
 * @param interpolator the interpolator callback.
 */
export function sortedInterpolate<E>(
    value: number,
    entries: [number, E][],
    interpolator: (value: number, factor: number, lE: E, uE: E) => E,
) {
    const eC = entries.length;
    if (eC < 2) {
        if (1 === eC) {
            const [first] = entries;
            if (value === first[0]) {
                return first[1];
            }
        }
        throw Error("Interpolation requires at least two reference entries.");
    }
    const uI = entries.findIndex(([v]) => v >= value);
    if (-1 === uI) {
        const [lV, lE] = entries[eC - 2];
        const [uV, uE] = entries[eC - 1];
        return interpolator(value, (value - lV) / (uV - lV), lE, uE);
    } else {
        const [v, e] = entries[uI];
        if (v === value) {
            return e;
        } else if (0 === uI) {
            const [uV, uE] = entries[1];
            return interpolator(value, (value - v) / (uV - v), e, uE);
        } else {
            const [lV, lE] = entries[uI - 1];
            return interpolator(value, (value - lV) / (v - lV), lE, e);
        }
    }
}

/**
 * Same as {@link interpolate} but allows values to be extracted from entries via an arbitrary extractor callback.
 *
 * @param value the value.
 * @param entries the entries.
 * @param iteratee the value extractor.
 * @param interpolator the interpolator callback.
 */
export function interpolateBy<E>(
    value: number,
    entries: E[],
    iteratee: ArrayIterator<E, number>,
    interpolator: (value: number, factor: number, lE: E, uE: E) => E,
) {
    const eC = entries.length;
    if (eC < 2) {
        throw Error("Interpolation requires at least two reference entries.");
    }
    const sorted = _.zip(_.map(entries, iteratee), entries)
        .sort(([v0], [v1]) => v0! - v1!) as [number, E][];
    return sortedInterpolate(value, sorted, interpolator);
}

/**
 * Same as {@link sortedPickAdjacent} but allows values to be extracted from entries via an arbitrary extractor callback
 * and does not require entries to be pre-sorted by value.
 *
 * @param value the value.
 * @param entries the entries.
 * @param iteratee the value extractor.
 */
export function pickAdjacentBy<E>(value: number, entries: E[], iteratee: ArrayIterator<E, number>) {
    const sorted = _.zip(_.map(entries, iteratee), entries)
        .sort(([v0], [v1]) => v0! - v1!) as [number, E][];
    return sortedPickAdjacent(value, sorted);
}
