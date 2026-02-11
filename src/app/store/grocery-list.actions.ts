import { createAction, props } from '@ngrx/store';

export const loadLists = createAction('[Grocery List] Load Lists');
export const loadListsSuccess = createAction(
  '[Grocery List] Load Lists Success',
  props<{ lists: any[] }>()
);
export const loadListsError = createAction(
  '[Grocery List] Load Lists Error',
  props<{ error: string }>()
);

export const routerGoToGroceryList = createAction(
  '[Router] Go To Grocery List'
);

export const routerGoToSignIn = createAction(
  '[Router] Go To Sign In',
  props<{ isTimedOut?: boolean }>()
);