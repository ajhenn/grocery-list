import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroceryListComponent } from './grocery-list.component';
import { Store } from '@ngrx/store';

describe.todo('GroceryListComponent', () => {
  let component: GroceryListComponent;
  let fixture: ComponentFixture<GroceryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryListComponent],
      providers: [Store]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroceryListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
