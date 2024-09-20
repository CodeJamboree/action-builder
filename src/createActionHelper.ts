import createAction from "./createAction.js";

export default (...namespace: string[]) => {

  const prefix = namespace.length === 0 ? '' :
    `${namespace.join(' ')} `;

  const build = <Payload = void>(
    action: string,
    ...subActions: string[]
  ) => createAction<Payload>(
    prefix, action, ...subActions
  );

  const subAction = (
    action: string,
    ...subActions: string[]
  ) => <Payload = void>(name: string) =>
      build<Payload>(
        action,
        ...subActions,
        name
      );

  build.subAction = subAction;

  return build;
};
