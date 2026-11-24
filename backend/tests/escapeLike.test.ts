import { describe, it, expect } from "vitest";
import { escapeLike } from "../src/db/escapeLike";

describe('escapeLike', () => {
    it.each([
        ['100%', '100\\%'],
        ['first_name', 'first\\_name'],
        ['back\\slash', 'back\\\\slash'],
    ])('escapes %s as %s', (input, expected) => {
        expect(escapeLike(input)).toBe(expected);
    });
 
    it('leaves ordinary text unchanged', () => {
        expect(escapeLike('Priya Sharma')).toBe('Priya Sharma');
    });
})