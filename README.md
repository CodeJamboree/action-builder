# action-builder

This is inspired by [https://www.npmjs.com/package/redux-saga-routines](redux-saga-actions). The stages for fetch operations are used in the same way.

When working with a specific slice in a Redux Store, you can create actions with a common prefix.

```js
import actionBuilder from '@codejamboree/action-builder';

const build = actionBuilder('settings');
export const hide = build('HIDE');

console.log(changeName());
// { type: 'settings HIDE', payload: undefined }
```

Actions payloads can be typed.

```js
export const rename = build<{name: string}>('RENAME');
console.log(rename('Lewis Moten').payload.name);
// Lewis Moten
```

## Fetch Actions

Common stages for a fetch can be created as a group for
consistency. The stages are Trigger, request, success, error, and fulfill.
Each stage may have its payload typed.

```js
// default payload types
export const addItem = build.fetch('ADD_ITEM');

// Typed payloads
export const addItem = build.fetch<
  { name: string },            // trigger payload
  void,                        // request payload
  { id: number, name: string}, // success payload
  { error: string },           // error payload
  void,                        // fulfill payload
>('ADD_ITEM');
```
## Dispatching fetch actions

You can dispatch the stages of a fetch request throughout
your application.

```js
const dispatch = useDipatch();

dispatch(addItem.trigger({name: 'Lewis Moten'}));
// same as addItem.trigger
dispatch(addItem({name: 'Lewis Moten'}));

dispatch(addItem.request());
dispatch(addItem.success({id: 42, name: 'Lewis Moten'}));
dispatch(addItem.failure({ error: 'Duplicate name' }));
dispatch(addItem.fulfill());
```
## Lifecycle of Fetch actions in Saga

The various stages of fetch actions are most useful to the
common lifecycles of redux saga fetch operations.

Of special note is that the upper-case key of each stage 
(TRIGGER, REQUEST, SUCCESS, FAILURE, FULFILL) 
provides a short-cut to the type.

```js
export default takeEvery(
  // actions.addItem.trigger.type is the same
  actions.addItem.TRIGGER, 
  function* worker(action) {
    yield put(actions.addItem.request());
    try {
      const results = yield call(
        apiPost, 'addItem', action.payload
      );
      yield put(actions.addItem.success(results))
    } catch (error) {
      yield put(actions.addItem.failure({ error }));
    } finally {
      yield put(actions.addItem.fulfill());
    }
  }
);
```
## Handle Stages With Reducers

Reducers may use the upper-case keys as well to reduce the
action into the current state.

```js
const initialState = {
  error: undefined,
  busy: false,
  items: []
};
const addItemTrigger = (state, action) => 
    ({...state, error: undefined });

const addItemRequest = (state, action) => 
    ({ ...state, busy: true });

const addItemSuccess = (state, {payload: item }) => 
    ({
      ...state,
      items: [
        ...state.items,
        item
      ]
    });
 
const addItemFailure = (state, {payload: { error}} ) => 
    ({...state, error });

const addItemFulfill = (state, action) => 
    ({...state, busy: false })

handleActions({
  [addItem.TRIGGER]: addItemTrigger,
  [addItem.REQUEST]: addItemRequest,
  [addItem.SUCCESS]: addItemSuccess,
  [addItem.FAILURE]: addItemFailure,
  [addItem.FULFILL]: addItemFulfill
  },
  initialState
);
```

## Progress

In addition to the stages for fetch operations, the action
builder can also build progress/abort actions. Here is an
overview of how to make multiple requests until all records
are loaded, while also allowing the user to aboart the
process.

### Progress Actions
```js
const readPayload = build.progress<
  { count: number, total: number }, // progress
  void,                             // abort
>('READ');

const readFetch = build.fetch<
  void,                             // trigger
  void,                             // request
  {id: number, name: string}[],     // success
  {error: string},                  // failure
  void                              // fulfill
>('READ');

export const read = Object.assign(readFetch, readProgress);
```
### Progress Page
```js
export const SamplePage = () => {
  const dispatch = useDispatch();
  const busy = useSelector(selectBusy);
  const aborting = useSelector(selectAborting);
  const percent = useSelector(selectPercent);
  const items = useSelector(selectItems);

  const canAbort = busy && !aborting;

  const onClickRead = () => {
    dispatch(read.trigger())
  }
  const onClickAbort = () => {
    dispatch(read.abort());
  }

  return <div>
    Load Progress: {percent}<br/>
    {aborting ? <div>Aborting!</div> : null}
    <button disabled={busy} onClick={onClickRead}>Read</button>
    <button disabled={!canAbort} onClick={onClickAbort}>Abort</button>
    <ul>
    {items.forEach(item => {
      <li key={item.id}>{item.name}</li>
    })}
    </ul>
  </div>
};
```
### Progress Saga

A generic overview of fetch stages with progress reporting
and abort capability.

```js
export default takeEvery(
  actions.read.TRIGGER, 
  function* worker(action) {

  yield put(read.request());

  let offset = 0;
  let total = Infinity;
  const limit = 10;

  try {

      while(offset < total) {

        let abort = (yield select(selectAborting)) as boolean;

        if(abort) break;

        const results = (yield call(
          apiPost, 'read', {offset, limit}
        )) as {
          total: number,
          rows: {
            id: number,
            name: string
          }[]
        };

        total = results.total;

        yield put(read.success(results.rows));

        abort = (yield select(selectAborting)) as boolean;

        if(abort) break;

        const chunkCount = results.rows.length;
        const count = offset + chunkCount;

        yield put(read.progess({ count, total }))

        abort = (yield select(selectAborting)) as boolean;

        if(abort) break;

        yield delay(2000);

        offset += limit;
      }
    } catch (error) {
      yield put(read.failure({ error }));
    } finally {
      yield put(read.fulfill());
    }
  }
);
```
### Progress Reducer
A reducer that can maintain a list of loaded items, known
item count and if we are busy, aborting, or had an error.

```js
const initialState = {
  error: undefined,
  busy: false,
  aborting: false,
  total: 0,
  allIds: [],
  byId: {}
};

const readRequest = (state, action) => 
    ({ 
      ...state,
      busy: true 
      error: undefined,
      aborting: false,
      total: state.allIds.length
    });

const readSuccess = (state, {payload: items[] }) => 
    ({
      ...state,
      allIds: items.reduce((allIds, item) => 
        allIds.includes(item.id) ? 
          allIds : [...allIds, item.id];
      , state.allIds)
      byId: items.reduce((byId, item) => ({
        ...byId,
        [item.id]: item
      }), state.byId)
    });

const readProgress = (state, {payload: { total }}) => ({
  ...state,
  total
});

const readAbort = (state, _action) => ({
  ...state,
  aborting: true
});

const readFailure = (state, {payload: { error }} ) => 
    ({...state, error });

const readFulfill = (state, action) => 
    ({
      ...state,
      busy: false,
      aborting: false
    })

handleActions({
  [read.REQUEST]: readRequest,
  [read.SUCCESS]: readSuccess,
  [read.PROGRESS]: readProgress,
  [read.ABORT]: readAbort,
  [read.FAILURE]: readFailure,
  [read.FULFILL]: readFulfill
  },
  initialState
);
```
### Progress Selectors
A collection of selectors to read the state and make
calculations about the progress of loading items.

```js
const selectSlice = (
  { settings = INITIAL_STATE} = {}
) => settings;

const selectById = createSelector(
  selectSlice,
  ({ byId }) => byId
);
const selectAllIds = createSelector(
  selectSlice,
  ({ allIds }) => allIds
);
export const selectItems = createSelector(
  selectById,
  allIds,
  (byId, allIds) => allIds.map(id => byId[id]);
);
export const selectBusy = createSelector(
  selectSlice, 
  ({ busy }) => busy
)
export const selectAborting = createSelector(
  selectBusy,
  selectSlice,
  (busy, {aborting}) => busy && aborting;
)
export const selectPercent = createSelector(
  selectAllIds,
  selectSlice,
  (allIds, { total }) => {
    if(total === 0) return '0%';
    const percent = Math.min(1, allIds.length / total);
    return `${Math.floor(percent * 100)}%`;
});

```
