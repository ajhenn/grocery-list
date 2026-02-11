import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  {
    path: 'sign-in',
    loadComponent: () => import('./widgets/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path: 'grocery-list',
    loadComponent: () => import('./widgets/grocery-list/grocery-list.component').then(m => m.GroceryListComponent)
  },
  { path: '**', redirectTo: '/sign-in' }
];
