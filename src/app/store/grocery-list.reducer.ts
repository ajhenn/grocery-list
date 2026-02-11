import { createReducer, on } from '@ngrx/store';
import * as GroceryListActions from './grocery-list.actions';

export interface GroceryListState {
  lists: any[];
  loading: boolean;
  error: string | null;
}

const initialState: GroceryListState = {
  lists: [],
  loading: false,
  error: null
};

export const listReducer = createReducer(
  initialState,
  on(GroceryListActions.loadLists, (state) => ({ ...state, loading: true })),
  on(GroceryListActions.loadListsSuccess, (state, { lists }) => ({
    ...state,
    lists,
    loading: false
  })),
  on(GroceryListActions.loadListsError, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
