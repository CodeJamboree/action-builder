import { createAction } from "@reduxjs/toolkit";

export default <
  Trigger,
  Request,
  Success,
  Failure,
  Fulfill
>(subAction: typeof createAction) => {

  const trigger = subAction<Trigger>('TRIGGER');
  const request = subAction<Request>('REQUEST');
  const success = subAction<Success>('SUCCESS');
  const failure = subAction<Failure>('FAILURE');
  const fulfill = subAction<Fulfill>('FULFILL');

  const stages = {
    trigger,
    request,
    success,
    failure,
    fulfill,
    TRIGGER: trigger.type,
    REQUEST: request.type,
    SUCCESS: success.type,
    FAILURE: failure.type,
    FULFILL: fulfill.type
  }

  return Object.assign<
    typeof trigger,
    typeof stages
  >(trigger, stages);
}
