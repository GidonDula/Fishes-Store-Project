import { Component, OnInit } from '@angular/core';

import { Product } from '../Models/product.interface';
import { ProductsService } from '../Services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productsArr:any;


  constructor(private productsService:ProductsService,private router:Router) { }

  ngOnInit(): void {
    this.productsService.loadAllProducts().subscribe((res:any)=>{
      this.productsArr=res;
  })
  console.log(this.productsArr);
  }

  AboutUs (){
    this.router.navigate(['/AboutUs'])
  }

}
