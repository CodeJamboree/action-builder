import formatName from "./formatName.js";
import { expect } from '@codejamboree/js-test';

export const basicName = () => {
  expect(formatName('a', 'b')).equals('ab');
}
export const withSubAction = () => {
  expect(formatName('a', 'b', 'c')).equals('ab/c');
}
export const withMultiSubActions = () => {
  expect(formatName('a', 'b', 'c', 'd')).equals('ab/c/d');
}
export const noPrefix = () => {
  expect(formatName('', 'b', 'c')).equals('b/c');
}
