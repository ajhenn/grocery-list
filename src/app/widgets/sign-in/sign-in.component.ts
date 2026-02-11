import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounce, email, form, FormField, pattern, required } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as GroceryListActions from '../../store/grocery-list.actions';
import { SignInService } from '../../services/sign-in.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  imports: [FormField, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {

  private router = inject(Router);
  private store = inject(Store);
  private signInService = inject(SignInService);

  isCreateAccount = signal(false);
  isTransitioning = signal(false);
  signInError = signal<string | null>(null);
  signInTimeout = signal<string | null>(
     this.router.currentNavigation()?.extras.state?.['isTimedOut'] ?? false
  );
  createAccountError = signal<string | null>(null);

  signInModel = signal({
    email: '',
    password: '',
    rememberMe: false
  });
  signInForm = form(this.signInModel, (schemaPath) => {
    debounce(schemaPath.email, 500);
    required(schemaPath.email, {message: 'Email is required.'});
    email(schemaPath.email, {message: 'Enter a valid email address.'});
    required(schemaPath.password, {message: 'Password is required.'});
  });

  createAccountModel = signal({
    name: '',
    email: '',
    password: ''
  });
  createAccountForm = form(this.createAccountModel, (schemaPath) => {
    required(schemaPath.name, {message: 'Name is required.'});
    debounce(schemaPath.email, 500);
    required(schemaPath.email, {message: 'Email is required.'});
    email(schemaPath.email, {message: 'Enter a valid email address.'});
    debounce(schemaPath.password, 500);
    required(schemaPath.password, {message: 'Password is required.'});
    pattern(schemaPath.password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/, {message: 'Password must be at least 10 characters long and include uppercase, lowercase, and a number.'});
  });

  toggleCreateAccount() {
    this.isTransitioning.set(true);
    this.signInError.set(null);
    this.signInTimeout.set(null);
  }

  onCardAnimationEnd() {
    if (this.isTransitioning()) {
      this.isCreateAccount.update(value => !value);
      this.isTransitioning.set(false);
    }
  }

  goToGroceryList() {
    this.store.dispatch(GroceryListActions.routerGoToGroceryList());
  }

  async handleSignIn(event: Event) {
    event.preventDefault();
    this.signInError.set(null);
    this.signInTimeout.set(null);
    try {
      const response = await this.signInService.signIn(this.signInModel().email, this.signInModel().password);
      
      if (response.error) {
        this.signInError.set(response.error);
      } else {
        this.goToGroceryList();
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred';
      this.signInError.set(errorMessage);
    }
  }

  async handleCreateAccount(event: Event) {
    event.preventDefault();
    this.createAccountError.set(null);
    this.signInTimeout.set(null);

    try {
      const response = await this.signInService.signUp(this.createAccountModel().email, this.createAccountModel().password, this.createAccountModel().name);
      
      if (response.error) {
        this.createAccountError.set(response.error);
      } else {
        console.log('Sign-up successful:', response.data);
        // Now login?
        // this.goToGroceryList();
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred';
      this.createAccountError.set(errorMessage);
    }
  }

}
