import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;

    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);
      return state;

    case ActionType.MOVE_CELL:
      const { direction, id: cellId } = action.payload;
      const idx = state.order.findIndex((id) => id === cellId);
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;

      if (targetIdx < 0 || targetIdx > state.order.length - 1) {
        return state;
      }

      // swapping
      [state.order[idx], state.order[targetIdx]] = [
        state.order[targetIdx],
        cellId,
      ];
      return state;

    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        content: "",
        type: action.payload.type,
        id: randomId(),
      };

      state.data[cell.id] = cell;

      const foundIdx = state.order.findIndex((id) => id === action.payload.id);
      if (foundIdx < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIdx + 1, 0, cell.id);
      }
      return state;

    case ActionType.FETCH_CELLS:
      state.loading = true;
      state.error = null;
      return state;

    case ActionType.FETCH_CELLS_COMPLETE:
      state.loading = false;
      state.order = action.payload.map((cell) => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState["data"]);
      return state;

    case ActionType.FETCH_CELLS_ERROR:
      state.loading = false;
      state.error = action.payload;
      return state;

    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload;
      return state;

    default:
      return state;
  }
});

const randomId = () => {
  return Math.random().toString(36).substring(2, 8);
};

export default reducer;
