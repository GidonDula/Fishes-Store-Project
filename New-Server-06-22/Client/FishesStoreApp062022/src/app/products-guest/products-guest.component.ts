import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../Services/products.service';
import {Observable} from "rxjs";
import { Product } from '../Models/product.interface';

@Component({
  selector: 'app-products-guest',
  templateUrl: './products-guest.component.html',
  styleUrls: ['./products-guest.component.css']
})
export class ProductsGuestComponent implements OnInit {

    productsArr:any;

 productColumns:String[]=['Id','name','quantity','price','ImageUrl','dateAdded'];

  constructor(private productsService:ProductsService) { }

  ngOnInit(): void {
    this.productsService.loadAllProducts().subscribe((res:any)=>{
      for(let i=0; i<res.length; i++){

      }
      this.productsArr=res;
    })
    console.log(this.productsArr);

  }

  }


