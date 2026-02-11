import { Injectable, inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as GroceryListActions from './grocery-list.actions';

@Injectable()
export class GroceryListEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);

  routerGoToGroceryList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GroceryListActions.routerGoToGroceryList),
        tap(() => this.router.navigate(['/grocery-list']))
      ),
    { dispatch: false }
  );

  routerGoToSignIn$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GroceryListActions.routerGoToSignIn),
        tap((data) => {
          let extras: NavigationExtras = {};
          if (data?.isTimedOut) {
            extras.state = { isTimedOut: data.isTimedOut || false };
          }
          this.router.navigate(['/sign-in'], extras);
        })
      ),
    { dispatch: false }
  );
}