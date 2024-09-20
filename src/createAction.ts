import { createAction } from "@reduxjs/toolkit";
import formatName from "./formatName.js";

export default <Payload = void>(
  prefix: string,
  actionName: string,
  ...subActions: string[]
) =>
  createAction<Payload>(
    formatName(prefix, actionName, ...subActions)
  );
