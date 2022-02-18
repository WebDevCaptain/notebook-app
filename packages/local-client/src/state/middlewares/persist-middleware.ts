import { Dispatch } from "redux";
import { RootState } from "..";
import { saveCells } from "../action-creators";
import { ActionType } from "../action-types";
import { Action } from "../actions";

export const persistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  let timer: any;

  return (next: (action: Action) => void) => {
    return (action: Action) => {
      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(() => {
          console.log("I want to save cells");
          saveCells()(dispatch, getState);
        }, 250);
      }

      next(action);
    };
  };
};
