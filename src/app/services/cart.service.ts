import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = new Array<CartItem>();
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  addToCart(theCartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem!: CartItem | undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === theCartItem.id
      );

      // for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //   }
      // }
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      if (existingCartItem) {
        existingCartItem.quantity++;
      }
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    // this.logCartData(totalPriceValue, totalQuantityValue);
  }

  // logCartData(totalPriceValue: number, totalQuantityValue: number) {
  //   console.log('contents of the cart:');
  //   for (let tempCartItem of this.cartItems) {
  //     const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
  //     console.log(
  //       `name: ${tempCartItem.name}, unitPrice = ${tempCartItem.unitPrice}, subTotal = ${subTotalPrice}`
  //     );
  //   }
  //   console.log(`total Price = ${totalPriceValue.toFixed(2)}`);
  //   console.log(`----------------------`);
  // }

  substractToCart(theCartItem: CartItem) {
    let existingCartItem!: CartItem | undefined;
    existingCartItem = this.cartItems.find(
      (tempCartItem) => tempCartItem.id === theCartItem.id
    );
    if (existingCartItem) {
      if (existingCartItem.quantity > 1) {
        existingCartItem.quantity--;
      } else if (existingCartItem.quantity == 1) {
        const index = this.cartItems.indexOf(existingCartItem);
        this.cartItems.splice(index, 1);
      }
    }
    this.computeCartTotals();
  }
  removeItem(theCartItem: CartItem) {
    let existingCartItem!: CartItem | undefined;
    existingCartItem = this.cartItems.find(
      (tempCartItem) => tempCartItem.id === theCartItem.id
    );
    if (existingCartItem) {
      const index = this.cartItems.indexOf(existingCartItem);
      this.cartItems.splice(index, 1);
    }

    this.computeCartTotals();
  }
}
