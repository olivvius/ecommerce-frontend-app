import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: Boolean = false;
  thePageNumber: number = 1;
  thePageSize: number = 20;
  theTotalElements: number = 0;
  previousKeyword: string | null = null;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService : CartService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    const hasCategoryId: Boolean =
      this.activatedRoute.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = Number(
        this.activatedRoute.snapshot.paramMap.get('id')
      );
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: {
      _embedded: { products: Product[] };
      page: { number: number; size: number; totalElements: number };
    }) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  handleSearchProducts() {
    const theKeyword: string | null =
      this.activatedRoute.snapshot.paramMap.get('keyword');

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    // this.productService.SearchProductsPaginate(
    //   this.thePageNumber - 1,
    //   this.thePageSize,
    //   theKeyword).subscribe(this.processResult);

    this.productService
      .searchProducts(theKeyword)
      .subscribe((data) => (this.products = data));
  }

  updatePageSize(event: Event) {
    this.thePageSize = +(event.target as HTMLInputElement).value;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`product added :${theProduct.name} `);
      const theCartItem = new CartItem(theProduct);
      this.cartService.addToCart(theCartItem);
  }
}
