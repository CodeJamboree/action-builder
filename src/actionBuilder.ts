import createActionHelper from "./createActionHelper.js";
import fetchActionBuilder from './fetchActionBuilder.js';
import progressActionBuilder from "./progressActionBuilder.js";

export default (...namespace: string[]) => {

  const build = createActionHelper(...namespace);

  const buildFetch = <
    Trigger = undefined,
    Request = Partial<Trigger> | undefined,
    Success = Partial<Trigger> | undefined,
    Failure = ErrorPayload | undefined,
    Fulfill = Partial<Trigger> | undefined
  >(
    action: string, ...subActions: string[]
  ) => {

    const subAction = build.subAction(
      action,
      ...subActions
    );

    return fetchActionBuilder<
      Trigger,
      Request,
      Success,
      Failure,
      Fulfill
    >(subAction);
  }

  const buildProgress = <
    Progress = ProgressPayload | undefined,
    Abort = AbortPayload | undefined,
  >(action: string, ...subActions: string[]) => {
    const subAction = build.subAction(
      action,
      ...subActions
    );
    return progressActionBuilder<
      Progress,
      Abort
    >(subAction);
  }

  const helpers = {
    build,
    fetch: buildFetch,
    progress: buildProgress
  };

  return Object.assign<
    typeof build,
    typeof helpers
  >(build, helpers);

};
