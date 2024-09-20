import actionBuilder from "./actionBuilder.js";
import { expect } from '@codejamboree/js-test';

const builder = actionBuilder('test', '🧪');
const defaultTypeFetch = builder.fetch('UPDATE');

const typedFetch = builder.fetch<
  { trigger: string },
  { request: string },
  { success: string },
  { failure: string },
  { fulfill: string }
>('REMOVE');

const defaultTypeProgress = builder.progress('READ');

const typedProgress = builder.progress<
  { progress: string },
  { abort: string }
>('DOWNLOAD');

export const basicBuild = () => {
  const reposition = builder<{
    id: number,
    position: 'before' | 'after',
    targetId: number
  }>('REPOSITION');

  const type = 'test 🧪 REPOSITION';

  expect(reposition.type).is(type);

  const action = reposition({ id: 2, position: 'after', targetId: 32 });
  expect(action.type).is(type);
  expect(action.payload.id).is(2);
  expect(action.payload.position).is('after');
  expect(action.payload.targetId).is(32);
}

export const updateTriggerType = () => {
  const type = 'test 🧪 UPDATE/TRIGGER';
  expect(defaultTypeFetch.TRIGGER).is(type);
  expect(defaultTypeFetch.trigger.type).is(type);
  expect(defaultTypeFetch.trigger().type).is(type);
  expect(defaultTypeFetch.type).is(type);
  expect(defaultTypeFetch().type).is(type);
}
export const updateRequestType = () => {
  const type = 'test 🧪 UPDATE/REQUEST';
  expect(defaultTypeFetch.REQUEST).is(type);
  expect(defaultTypeFetch.request.type).is(type);
  expect(defaultTypeFetch.request().type).is(type);
}
export const updateSuccessType = () => {
  const type = 'test 🧪 UPDATE/SUCCESS';
  expect(defaultTypeFetch.SUCCESS).is(type);
  expect(defaultTypeFetch.success.type).is(type);
  expect(defaultTypeFetch.success().type).is(type);
}

export const failureType_Key = () => {
  const type = 'test 🧪 UPDATE/FAILURE';
  expect(defaultTypeFetch.FAILURE).is(type);
}
export const failureType_ActionCreator = () => {
  const type = 'test 🧪 UPDATE/FAILURE';
  expect(defaultTypeFetch.failure.type).is(type);
}
export const failureType_Action = () => {
  const type = 'test 🧪 UPDATE/FAILURE';
  expect(defaultTypeFetch.failure().type).is(type)
}

export const fulfillType_Key = () => {
  const type = 'test 🧪 UPDATE/FULFILL';
  expect(defaultTypeFetch.FULFILL).is(type);
}
export const fulfillType_ActionCreator = () => {
  const type = 'test 🧪 UPDATE/FULFILL';
  expect(defaultTypeFetch.fulfill.type).is(type);
}
export const fulfillType_Action = () => {
  const type = 'test 🧪 UPDATE/FULFILL';
  expect(defaultTypeFetch.fulfill().type).is(type)
}

export const typedFetch_DefaultPayload = () => {
  const payload = { trigger: 'happy' };
  const action = typedFetch(payload);
  expect(action.payload).equals(payload);
}
export const typedFetch_TriggerPayload = () => {
  const payload = { trigger: 'happy' };
  const action = typedFetch.trigger(payload);
  expect(action.payload).equals(payload);
}
export const typedFetch_RequestPayload = () => {
  const payload = { request: 'happy' };
  const action = typedFetch.request(payload);
  expect(action.payload).equals(payload);
}
export const typedFetch_SuccessPayload = () => {
  const payload = { success: 'happy' };
  const action = typedFetch.success(payload);
  expect(action.payload).equals(payload);
}
export const typedFetch_FailurePayload = () => {
  const payload = { failure: 'happy' };
  const action = typedFetch.failure(payload);
  expect(action.payload).equals(payload);
}
export const typedFetch_FulfillPayload = () => {
  const payload = { fulfill: 'happy' };
  const action = typedFetch.fulfill(payload);
  expect(action.payload).equals(payload);
}

export const defaultProgressType_Progress = () => {
  const type = 'test 🧪 READ/PROGRESS';
  expect(defaultTypeProgress.PROGRESS).is(type);
  expect(defaultTypeProgress.progress.type).is(type);
  expect(defaultTypeProgress.progress().type).is(type);
  expect(defaultTypeProgress.progress({ progress: 3 }).type).is(type);

  expect(defaultTypeProgress.progress().payload).equals(undefined);
  expect(defaultTypeProgress.progress({ progress: 3 }).payload)
    .equals({ progress: 3 });
}
export const defaultProgressType_Abort = () => {
  const type = 'test 🧪 READ/ABORT';
  expect(defaultTypeProgress.ABORT).is(type);
  expect(defaultTypeProgress.abort.type).is(type);
  expect(defaultTypeProgress.abort().type).is(type);
  expect(defaultTypeProgress.abort({ reason: "client canceled" }).type).is(type);
  expect(defaultTypeProgress.abort({ error: "HTTP Abort" }).type).is(type);
  expect(defaultTypeProgress.abort({
    error: "HTTP Abort",
    reason: 'Client Canceled'
  }).type).is(type);

  expect(defaultTypeProgress.abort().payload).equals(undefined);
  expect(defaultTypeProgress.abort({ reason: 'a' }).payload?.reason).is('a');
  expect(defaultTypeProgress.abort({ error: 'a' }).payload?.error).is('a');
  expect(defaultTypeProgress.abort({ reason: 'a', error: 'b' }).payload).equals({
    reason: 'a',
    error: 'b'
  });
}

export const progressPayloadOfTypedProgress = () => {
  const payload = { progress: 'happy' };
  const action = typedProgress.progress(payload);
  expect(action.payload.progress).is('happy');
}

export const abortPayloadOfTypedProgress = () => {
  const payload = { abort: 'happy' };
  const action = typedProgress.abort(payload);
  expect(action.payload.abort).is('happy');
}
