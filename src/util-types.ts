import _ from "lodash";
import {DateTime} from "luxon";

/**
 * Function which creates some object or value from an optional configuration object.
 */
export interface Creator<T, C> {
    (config?: C): T;
}

/**
 * Generic object with an associated `kind` attribute.
 */
export type Kinded<T extends object, K extends string> = T & { kind: K };

/**
 * Generic object with an associated timestamp.
 */
export type Timestamped<T extends object> = T & { timestamp: DateTime };

/**
 * Type guard for {@link Kinded}.
 *
 * @param value the value to check.
 * @param kind the `kind` value.
 */
export function isKinded<K extends string>(value: unknown, kind: K): value is Kinded<object, K> {
    return _.isObject(value)
        && "kind" in value
        && kind == value.kind;
}

/**
 * Type guard for {@link Timestamped}.
 *
 * @param value the value to check.
 */
export function isTimestamped(value: unknown): value is Timestamped<object> {
    return _.isObject(value)
        && "timestamp" in value
        && value.timestamp instanceof DateTime;
}
