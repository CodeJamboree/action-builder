export default (
  prefix: string,
  actionName: string,
  ...subActions: string[]
) =>
  subActions.length === 0 ?
    `${prefix}${actionName}` :
    `${prefix}${actionName}/${subActions.join('/')}`;
