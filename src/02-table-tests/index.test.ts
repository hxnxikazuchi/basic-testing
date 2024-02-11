import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 2, b: 2, action: Action.Divide, expected: 1 },
  { a: 6, b: 2, action: Action.Divide, expected: 3 },
  { a: 100, b: 2, action: Action.Divide, expected: 50 },
  { a: 10, b: 2, action: Action.Exponentiate, expected: 100 },
  { a: 5, b: 2, action: Action.Exponentiate, expected: 25 },
  { a: 3, b: 3, action: Action.Exponentiate, expected: 27 },
  { a: 5, b: 2, action: Action.Multiply, expected: 10 },
  { a: 7, b: 8, action: Action.Multiply, expected: 56 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 6, b: 2, action: Action.Subtract, expected: 4 },
  { a: 2, b: 2, action: Action.Subtract, expected: 0 },
  { a: 3, b: 2, action: Action.Subtract, expected: 1 },
];

describe('simpleCalculator', () => {
  it.each(testCases)(
    `$action operation of $a and $b`,
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
