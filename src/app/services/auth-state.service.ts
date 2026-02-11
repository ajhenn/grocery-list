import { Injectable, signal } from '@angular/core';

export interface User { id: string; email: string; displayName?: string; }
export interface AuthState { isLoggedIn: boolean; user?: User; }

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _authState = signal<AuthState>({ isLoggedIn: false });
  getAuthState = this._authState.asReadonly();

  login(user: User) {
    this._authState.update(s => ({ ...s, isLoggedIn: true, user }));
  }

  logout() {
    this._authState.set({ isLoggedIn: false });
  }
}