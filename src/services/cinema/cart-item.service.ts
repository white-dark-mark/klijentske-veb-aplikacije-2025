import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartItem, CartItemStatus } from '../../models/cinema/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartItemService {
  private static lastCartItemId = 1;

  private static retrieveCartItems(): CartItem[] {
    if (!localStorage.getItem('cartItems')) {
      localStorage.setItem('cartItems', JSON.stringify([]));
    }

    const cartItems = JSON.parse(localStorage.getItem('cartItems')!);
    // Update lastCartItemId to ensure unique IDs
    if (cartItems.length > 0) {
      const maxId = Math.max(...cartItems.map((item: CartItem) => item.id));
      CartItemService.lastCartItemId = maxId + 1;
    }
    // Convert string dates back to Date objects if needed
    return cartItems;
  }

  private static saveCartItems(cartItems: CartItem[]): void {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  getAll(): Observable<CartItem[]> {
    return of(CartItemService.retrieveCartItems());
  }

  getByUserId(userId: number): Observable<CartItem[]> {
    const cartItems = CartItemService.retrieveCartItems();
    const userItems = cartItems.filter(item => item.userId === userId);
    return of(userItems);
  }

  create(cartItem: CartItem): Observable<CartItem> {
    const cartItems = CartItemService.retrieveCartItems();
    
    cartItem.id = CartItemService.lastCartItemId++;
    cartItem.status = CartItemStatus.BOOKED; // 'rezervisano'
    cartItem.bookedAt = new Date();
    
    cartItems.push(cartItem);
    CartItemService.saveCartItems(cartItems);
    
    return of(cartItem);
  }

  updateStatus(id: number, status: CartItemStatus): Observable<CartItem | undefined> {
    const cartItems = CartItemService.retrieveCartItems();
    const item = cartItems.find(i => i.id === id);
    
    if (item) {
      item.status = status;
      CartItemService.saveCartItems(cartItems);
    }
    
    return of(item);
  }

  delete(id: number): Observable<void> {
    const cartItems = CartItemService.retrieveCartItems();
    const filteredItems = cartItems.filter(item => item.id !== id);
    CartItemService.saveCartItems(filteredItems);
    return of(void 0);
  }

  clearUserCart(userId: number): Observable<void> {
    const cartItems = CartItemService.retrieveCartItems();
    const remainingItems = cartItems.filter(item => item.userId !== userId);
    CartItemService.saveCartItems(remainingItems);
    return of(void 0);
  }

  getUserBookedItems(userId: number): Observable<CartItem[]> {
    const cartItems = CartItemService.retrieveCartItems();
    return of(cartItems.filter(item => 
      item.userId === userId && item.status === CartItemStatus.BOOKED
    ));
  }

  rateProjection(cartItemId: number, rating: number): Observable<CartItem | undefined> {
    const cartItems = CartItemService.retrieveCartItems();
    const item = cartItems.find(i => i.id === cartItemId);
    
    if (item && (item.status === CartItemStatus.WATCHED || item.status === 'WATCHED' || item.status === 'gledano')) {
      item.rating = rating;
      CartItemService.saveCartItems(cartItems);
    }
    
    return of(item);
  }

  updateCartItem(cartItemId: number, updatedItem: Partial<CartItem>): Observable<CartItem | undefined> {
    const cartItems = CartItemService.retrieveCartItems();
    const itemIndex = cartItems.findIndex(i => i.id === cartItemId);
    
    if (itemIndex !== -1) {
      cartItems[itemIndex] = { ...cartItems[itemIndex], ...updatedItem };
      CartItemService.saveCartItems(cartItems);
      return of(cartItems[itemIndex]);
    }
    
    return of(undefined);
  }
} 