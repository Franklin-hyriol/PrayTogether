import ms, { StringValue } from "ms";

export function toMs(timeStr: StringValue): number {
    return ms(timeStr);
}