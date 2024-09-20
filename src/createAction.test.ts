import createAction from "./createAction.js";
import { expect } from '@codejamboree/js-test';

export const basicName = () => {
  const action = createAction('a', 'b');
  expect(action.type, 'type').equals('ab');
  expect(action().type, 'action.type').equals(action.type);
}
export const withSubAction = () => {
  const action = createAction('a', 'b', 'c');
  expect(action.type, 'type').equals('ab/c');
  expect(action().type, 'action.type').equals(action.type);
}
export const withMultiSubActions = () => {
  const action = createAction('a', 'b', 'c', 'd');
  expect(action.type, 'type').equals('ab/c/d');
  expect(action().type, 'action.type').equals(action.type);
}
export const noPrefix = () => {
  const action = createAction('', 'b', 'c');
  expect(action.type, 'type').equals('b/c');
  expect(action().type, 'action.type').equals(action.type);
}
export const untypedPayloadIsVoid = () => {
  const expected = {
    foo: 'bar'
  };
  const action = createAction('a', 'b');
  // @ts-expect-error (intentional)
  const actual = action(expected).payload;
  // @ts-expect-error (intentional)
  expect(actual.foo).equals(expected.foo);
}
export const typedPayload = () => {
  const expected = {
    foo: 'bar'
  };
  const action = createAction<typeof expected>('a', 'b');
  const actual = action(expected).payload;
  expect(actual.foo).equals(expected.foo);
}
