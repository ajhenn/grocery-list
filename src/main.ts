import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { listReducer } from './app/store/grocery-list.reducer';
import { GroceryListEffects } from './app/store/grocery-list.effects';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideStore({ groceryList: listReducer }),
    provideEffects([GroceryListEffects])
  ]
})
  .catch((err) => console.error(err));
