import { Component, OnInit,ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective,NgForm} from '@angular/forms';
import { OrdersService } from '../Services/orders.service';
import { ProductsService } from '../Services/products.service';
import { UsersService } from '../Services/users.service';
import { Router } from '@angular/router';



import { Product } from '../Models/product.interface';

import { Orders } from '../Models/orders.interface';

import { MatTable } from '@angular/material/table';

import { IsLoggedInService } from '../Services/is-logged-in.service';


@Component({
  selector: 'app-products-user',
  templateUrl: './products-user.component.html',
  styleUrls: ['./products-user.component.css']
})
export class ProductsUserComponent implements OnInit {

  formdata:any;
  index:Number=0;

  inserColumn:boolean=false;
  name:String="";
   quantity!:number;
   price!:number;
   Image:any;
   previewUrl:any=null;
   user:any;
   IsAdmin:boolean=false;

   updatedId:any;

   updateColumn:boolean=false;

   updateFormdata:any;
   updateName:String="";
   updateQuantity!:number;
   updatePrice!:number;
   updateImage:any=null;
   orderQuantity:any;


   updatePreviewUrl:any=null;
   numberSelected:number=-1;


   @ViewChild(MatTable,{static:true}) table!: MatTable<any>;

  constructor(private productsService:ProductsService,private usersService:UsersService,private ordersService:OrdersService,private router:Router,private islogedInService:IsLoggedInService) { }

  productsArr:any;

  displayColumns: string[] = [];
   productColumnsAdmin:string[]=['Id','name','quantity','price','ImageUrl','dateAdded','delete','Update'];
  productsCoulmnsCustomer:string[] = ['Id','name','quantity','price','ImageUrl','dateAdded','Order-Quantity','Make-Order'];

  ngOnInit(): void {
    if(this.islogedInService.getToken()!==' '){
    this.loadProducts();
  console.log(this.productsArr);



  this.user = this.usersService.getLoggedInUser().getValue();
  this.IsAdmin=this.user.role==="Admin";
    if(this.IsAdmin){
      this.displayColumns=this.productColumnsAdmin;
    }else{
      this.displayColumns=this.productsCoulmnsCustomer;
    }
  }
  else{
    this.router.navigate(['/login']);
  }
  }

  private loadProducts() {
    this.productsService.loadAllProducts().subscribe((res: any) => {
      this.productsArr = res;
    });
  }

  fileProgress(fileInput: any) {
    this.Image = <File>fileInput.target.files[0];
    if (this.Image) {
      const reader = new FileReader();
      reader.readAsDataURL(this.Image);
      reader.onload = (_event) => {
        this.previewUrl = reader.result;
        console.log(this.previewUrl);
      }
    }
  }

  insertNewProduct(){
   this.inserColumn=true;
   this.formdata = new FormGroup({
    name: new FormControl("", Validators.required),
    quantity: new FormControl("", Validators.required),
    price:new FormControl("",Validators.required),
    Image:new FormControl("",Validators.required),
});
  }



  onClickSubmit(data:any) {
    console.log(data)
    this.name=data.name;
    this.quantity=data.quantity;
    this.price=data.price;
    this.Image=data.Image;

    let AddedProduct:Product={
      name:this.name,
      quantity:this.quantity,
      price:this.price,
      ImageUrl:this.previewUrl
    }
    console.log(AddedProduct);
    this.productsService.addProduct(AddedProduct).subscribe( (res) => {


      this.loadProducts();
        console.log(res);

      });

    this.inserColumn=false;


  }

  delete(id:any){
      console.log(id);
     this.productsService.deleteProduct(id).subscribe((res:any)=>{

       console.log(res);
       this.loadProducts();
     }
     );

  console.log(this.productsArr);

  let deletetIndex=-1;
  for(let i=0; i<this.productsArr.length; i++){
    if(this.productsArr[i]._id===id){
      deletetIndex=i;
    }

   if(deletetIndex>=0){
     this.productsArr.splice(deletetIndex,1);
   }
  }

  }

  update(id:any){
    this.updateColumn=true;
    this.updatedId=id;
    for(let i=0; i<this.productsArr.length; i++){
      if(this.productsArr[i]._id===id){
        this.numberSelected=i;
      }
    }
    console.log(this.updatedId,this.numberSelected)
    this.updateFormdata = new FormGroup({
      updateName: new FormControl("", Validators.required),
      updateQuantity: new FormControl("", Validators.required),
      updatePrice:new FormControl("",Validators.required),
      updateImage:new FormControl("",Validators.required),
  });
  this.updatePreviewUrl=this.productsArr[this.numberSelected].Image;
  this.updateFormdata.patchValue({
    updateName:this.productsArr[this.numberSelected].name,
    updateQuantity:this.productsArr[this.numberSelected].quantity,
    updatePrice:this.productsArr[this.numberSelected].price,
    updateImage:this.productsArr[this.numberSelected].Image
  })

  }


  updateFileProgress(fileInput: any) {
    this.updateImage = <File>fileInput.target.files[0];
    if (this.updateImage) {
      const reader = new FileReader();
      reader.readAsDataURL(this.updateImage);
      reader.onload = (_event) => {
        this.updatePreviewUrl = reader.result;
        console.log(this.updatePreviewUrl);
      }
    }
  }

  onUpdateClickSubmit(data:any) {

    console.log(data)
    this.updateName=data.updateName;
    this.updateQuantity=data.updateQuantity;
    this.updatePrice=data.updatePrice;
    this.updateImage=data.updateImage;

    let updatedProduct:Product={
      name:this.updateName,
      quantity:this.updateQuantity,
      price:this.updatePrice,
      ImageUrl:this.updatePreviewUrl
    }
    console.log(updatedProduct);

    console.log(this.updatedId);

    this.productsService.updateProduct(this.updatedId,updatedProduct).subscribe((res) => {

        console.log(res);

        this.loadProducts();


    });
    this.updateColumn=false;

  }

  setOrderQuantity(id: any, event: any) {
    let OrderIndex=-1;
    for(let i=0; i<this.productsArr.length; i++){
      if(this.productsArr[i]._id===id){
        OrderIndex=i;
      }
    }


    if((OrderIndex != -1)&&(event.target.value>0)) {
      this.orderQuantity = event.target.value;

    }
  }


  makeOrder(Id:any){
    let orderIndex=-1;
    for(let i=0; i<this.productsArr.length; i++){
      if(this.productsArr[i]._id===Id){
           orderIndex=i;
      }
    }
     console.log(Id,orderIndex);

     if((orderIndex !== -1)&&(this.productsArr[orderIndex].quantity>this.orderQuantity)) {
      let userId=this.user._id;
      console.log(userId);
      let userEmail=this.user.email;
      console.log(userEmail);
      let newOrder:Orders={
        ProductId:this.productsArr[orderIndex]._id,
        UserId:userId,
        UserEmail:userEmail,
        ProductName:this.productsArr[orderIndex].name,
        OrderdQuantity:this.orderQuantity
      }
      console.log(newOrder);
      this.ordersService.addOrder(newOrder).subscribe ((res) => {

         console.log(res);

       }
     );

      this.productsArr[orderIndex].quantity-=this.orderQuantity;
      let updatedProduct:Product={
        name:this.productsArr[orderIndex].name,
        quantity:this.productsArr[orderIndex].quantity,
        price:this.productsArr[orderIndex].price,
        ImageUrl:this.productsArr[orderIndex].Image

      }
      console.log(updatedProduct);
      this.productsService.updateProduct(Id,updatedProduct).subscribe ((res) => {


          console.log(res);
         this.router.navigate(['/orders'])


      });

    }

  }

}
