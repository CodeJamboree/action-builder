import { createAction } from "@reduxjs/toolkit";

export default <
  Progress,
  Abort,
>(subAction: typeof createAction) => {

  const progress = subAction<Progress>('PROGRESS');
  const abort = subAction<Abort>('ABORT');

  return {
    progress,
    abort,
    PROGRESS: progress.type,
    ABORT: abort.type
  }
}
