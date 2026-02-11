import { Component, inject, OnInit, signal } from '@angular/core';
import { GroceryListService } from '../../services/grocery-list.service';
import { AuthService, AuthState } from '../../services/auth-state.service';
import { Store } from '@ngrx/store';
import * as GroceryListActions from '../../store/grocery-list.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { form, FormField, required } from '@angular/forms/signals';

@Component({
  selector: 'app-grocery-list',
  imports: [FormField, MatButtonModule, MatExpansionModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatAccordion, MatListModule],
  templateUrl: './grocery-list.component.html',
  styleUrl: './grocery-list.component.css',
})
export class GroceryListComponent implements OnInit {

  private store = inject(Store);
  private authService = inject(AuthService);
  private groceryListService = inject(GroceryListService);

  groceryListItems = signal<Array<{ item: string; quantity?: number }>>([]);

  getListError = signal<string | null>(null);
  addItemItemError = signal<string | null>(null);

  itemSuccessfullyAdded = signal<boolean>(false);

  userInfo = signal<AuthState | null>(null);

  listModel = signal({
      itemString: '',
      itemQuantity: 1
    });
  listForm = form(this.listModel, (schemaPath) => {
      required(schemaPath.itemString, {message: 'Item name is required.'});
      required(schemaPath.itemQuantity, {message: 'Item quantity is required.'});
  });

  ngOnInit(): void {
    const user = this.authService.getAuthState();
    if (user.isLoggedIn) {
      this.userInfo.set(user);
      this.getGroceryList();
    } else {
       this.store.dispatch(GroceryListActions.routerGoToSignIn({isTimedOut: true}));
    }
  }

  async getGroceryList() {
    this.getListError.set(null);

    try {
      const response = await this.groceryListService.getGroceryList();
      
      if (response.error) {
        this.getListError.set(response.error);
      } else {
        console.log('Got list data! :', response.data);
        const data = [{ id: 'test', item: 'Apples', quantity: 1 }, { id: 'test2', item: 'Bananas', quantity: 2 }];

        this.groceryListItems.set(response.data || []);

        // this.listForm().reset();
        // this.listModel.set({itemString: '', itemQuantity: 1});

        this.listForm.itemString().value.set('');
        this.listForm.itemQuantity().value.set(1);
 
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred';
      this.getListError.set(errorMessage);
    }
  }

  async addItem(event: Event) {
    event.preventDefault();
    this.addItemItemError.set(null);

    try {
      const response = await this.groceryListService.addGroceryItem(this.listModel().itemString);
      
      if (response.error) {
        this.addItemItemError.set(response.error);
      } else {
        console.log('Item added successfully:', response.data);
        this.itemSuccessfullyAdded.set(true);
        // this.getGroceryList();
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred';
      this.addItemItemError.set(errorMessage);
    }
  }

  viewList() {
    if (this.itemSuccessfullyAdded()) {
      this.getGroceryList();
      this.itemSuccessfullyAdded.set(false);
    }
  }
}
