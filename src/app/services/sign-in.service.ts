import { inject, Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { AuthService, User } from './auth-state.service';
import { LoaderService } from './loader.service';

export interface UserMetadata {
  id?: string;
  role?: string;
  email?: string;
  user_metadata?: {
    display_name?: string;
  }
  [key: string]: any;
}

export interface AuthResponse {
  data: UserMetadata | null;
  error: string | null;
}


@Injectable({
  providedIn: 'root',
})
export class SignInService {

  private authService = inject(AuthService);
  private loaderService = inject(LoaderService);

  async signUp(email: string, password: string, displayName?: string): Promise<AuthResponse> {
    this.loaderService.show();
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0] // Fallback to email prefix if no display name
          }
        }
      });
      if (error) {
        return { data: null, error: error.message };
      }
      return { data, error: null };
    } catch (err: any) {
      const errorMessage = err?.message || 'An unexpected error occurred during sign up';
      return { data: null, error: errorMessage };
    } finally {
      this.loaderService.hide();
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    this.loaderService.show();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { data: null, error: error.message };
      }
      if (data && data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          displayName: data.user.user_metadata?.['display_name'] || undefined,
        };
        this.authService.login(user);
      }
      return { data, error: null };
    } catch (err: any) {
      const errorMessage = err?.message || 'An unexpected error occurred during sign in';
      return { data: null, error: errorMessage };
    } finally {
      this.loaderService.hide();
    }
  }

}
