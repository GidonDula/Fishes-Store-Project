import { Component, OnInit } from '@angular/core';
import { Product } from '../Models/product.interface';
import { ProductsService } from '../Services/products.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  constructor(private productsService:ProductsService) { }

  productsArr:any;
  ngOnInit(): void {
    this.productsService.loadAllProducts().subscribe((res:any)=>{
      this.productsArr=res;
  })
  console.log(this.productsArr);

  }

}
