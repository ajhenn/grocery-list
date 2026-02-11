import { inject, Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { LoaderService } from './loader.service';

/**
 * Generic service response wrapper
 */
export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class GroceryListService {

  private loaderService = inject(LoaderService);


  async addGroceryItem(item: string): Promise<ServiceResponse<any>> {
    this.loaderService.show();
    try {
      const userResult = await supabase.auth.getUser();
      const user = userResult?.data?.user;
      if (!user) return { data: null, error: 'Not authenticated' };

      const { data, error } = await supabase
        .from('grocery_lists')
        .insert({ user_id: user.id, item })
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data || null, error: null };
    } catch (err: any) {
      return { data: null, error: err?.message || 'Unexpected error adding item' };
    } finally {
      this.loaderService.hide();
    }
  }

  async getGroceryList(): Promise<ServiceResponse<any[]>> {
    this.loaderService.show();
    try {
      const userResult = await supabase.auth.getUser();
      const user = userResult?.data?.user;
      if (!user) return { data: [], error: 'Not authenticated' };

      const { data, error } = await supabase
        .from('grocery_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: data || [], error: null };
    } catch (err: any) {
      return { data: [], error: err?.message || 'Unexpected error fetching list' };
    } finally {
      this.loaderService.hide();
    }
  }

  async deleteUserItems(items: string[]) {
    this.loaderService.show();
    try {
      const userResult = await supabase.auth.getUser();
      const user = userResult?.data?.user;
      if (!user) return { data: [], error: 'Not authenticated' };

      const { data, error } = await supabase
        .from('grocery_lists')
        .delete()
        .in('id', items)
        .eq('user_id', user.id);

      if (error) return { data: [], error: error.message };
      return { data: data || [], error: null };
    } catch (err: any) {
      return { data: [], error: err?.message || 'Unexpected error deleting items' };
    } finally {
      this.loaderService.hide();
    }
}

}
