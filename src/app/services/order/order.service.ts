import { Injectable } from '@angular/core';
import {Product} from "../../model/product";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Order} from "../../model/order";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) {
  }

  orderProduct(order: Order): Observable<any> {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   }),
    //   responseType: 'text' as 'json'
    // };
    const url = 'http://localhost:9000/api/order';
    return this.httpClient.post<any>(url, order);
    // return this.httpClient.post<any>('http://localhost:9000/api/order', order, httpOptions);
  }
}
