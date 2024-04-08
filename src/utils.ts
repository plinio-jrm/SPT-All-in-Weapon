/* eslint-disable @typescript-eslint/brace-style */
export class ArrayUtils {
    public static contains(array: string[], key: string): boolean {
        return array.indexOf(key) >= 0;
    }
}