import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product/product.service';
import { Router } from '@angular/router';
import { Order } from '../../model/order';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  isAuthenticated = false;
  products: Array<Product> = [];
  quantityIsNull = false;
  orderSuccess = false;
  orderFailed = false;

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;

        this.productService.getProducts().subscribe(product => {
          this.products = product;
        });
      }
    );
  }

  goToCreateProductPage() {
    this.router.navigateByUrl('/add-product');
  }
  // Overloaded method to handle product ordering
  orderProduct(product: Product, quantity: string) {
    console.log('Product:', product);
    console.log('Quantity:', quantity);

    // Validate product and quantity
    if (!product || !product.name || typeof product.name !== 'string' || !quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      this.orderFailed = true;
      this.orderSuccess = false;
      console.error('Invalid OrderRequest: SKU Code and Quantity must not be null or invalid.');
      console.error('Product:', product);
      return;
    }

    // Map product.name to skuCode
    const order: Order = {
      skuCode: product.name, // Use `skuCode` as per `Order` type
      price: parseFloat(product.price.toString()), // Ensure price is a number
      quantity: parseInt(quantity, 10), // Ensure quantity is an integer
      userDetails: {
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe'
      }
    };

    console.log('Order Pay', order);

    this.orderService.orderProduct(order).subscribe({
      next: () => {
        this.orderSuccess = true;
        this.orderFailed = false;
        console.log('Order placed successfully.');
      },
      error: (error) => {
        this.orderFailed = true;
        this.orderSuccess = false;
        console.error('Order failed:', error);
      }
    });
  }
}
