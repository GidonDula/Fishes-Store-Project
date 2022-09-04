import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective,NgForm} from '@angular/forms';
import { UsersService } from '../Services/users.service';

import { OrdersService } from '../Services/orders.service';
import { ProductsService } from '../Services/products.service';

import { Product } from '../Models/product.interface';

import { MatTable } from '@angular/material/table';
import { IsLoggedInService } from '../Services/is-logged-in.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  updateFormdata:any;
  index:Number=0;
  updateColumn:boolean=false;
  OrdersArr:any;
  user:any;
  selectedName:String="";
  updateQuantity!:number;
  updatedId:any;
  IsAdmin:boolean=false;
  availableProducts:any;
  availableNames:String[]=[];
  numberSelected:number=-1;

  displayColumns: string[] = ['Id','ProductId','UserId','UserEmail','ProductName','OrderdQuantity','OrderDate','delete','Update'];

  @ViewChild(MatTable,{static:true}) table!: MatTable<any>;

  constructor(private usersService:UsersService,private OrdersService:OrdersService,private ProductsService:ProductsService,private islolggedInService:IsLoggedInService, private router:Router) { }

  ngOnInit(): void {
    if(this.islolggedInService.getToken()!==' '){
    let indexO=0;

    this.user = this.usersService.getLoggedInUser().getValue();
    this.IsAdmin=this.user.role==="Admin";
    console.log(this.user.email);

  if(this.IsAdmin){
    this.loadAllOrders();
  }
  else{
    this.loadOrdersByUser(this.user.email);
  }



    this.loadProducts();


}
else{
  this.router.navigate(['/login']);
}

  }

  private loadAllOrders(){
    this.OrdersService.loadAllOrders().subscribe((res:any)=>{
      this.OrdersArr=res;
    })
  }

  private loadOrdersByUser(UserEmail:any) {
    this.OrdersService.loadOrdersByUser(UserEmail).subscribe((res: any) => {
      this.OrdersArr = res;
    });

  }



  private loadProducts() {
    this.ProductsService.loadAllProducts().subscribe((res: any) => {
      this.availableProducts = res;
      console.log(this.availableProducts.length);
      for(let i=0; i<this.availableProducts.length; i++){
        this.availableNames[i]=this.availableProducts[i].name;
      }
      console.log(this.availableNames);
    });
  }



  delete(id:any){
    console.log(id);
    console.log(this.availableProducts);
    let index1=-1;
    for(let i=0; i<this.OrdersArr.length; i++){

      if((Object.values(this.OrdersArr[i])[0]===id))
        index1=i;
    }

   console.log(index1);

    let ProductId= Object.values(this.OrdersArr[index1])[1];
    let ProductName= Object.values(this.OrdersArr[index1])[4];
    let Oquantity=Number( Object.values(this.OrdersArr[index1])[5]);
    console.log(ProductId,ProductName,Oquantity);
    let index2=-1;
    for(let i=0; i<this.availableProducts.length; i++){
      if(Object.values(this.availableProducts[i])[0]===ProductId)
        index2=i;
    }

    console.log(index2);

    let quantity=Number(this.availableProducts[index2].quantity);
    let UPquantity=quantity+Oquantity;
    this.availableProducts[index2].quantity=UPquantity;

    this.OrdersService.deleteOrder(id).subscribe((res:any)=>{

      console.log(res);

      if(this.IsAdmin){
        this.loadAllOrders();
      }
      else{
        this.loadOrdersByUser(this.user.email);
      }

    }
    );
    let updatedProduct:Product={
      name:String(ProductName),
      quantity:this.availableProducts[index2].quantity,
      price:this.availableProducts[index2].price,
      ImageUrl:this.availableProducts[index2].Image
    }
    console.log(updatedProduct);
    this.ProductsService.updateProduct(ProductId,updatedProduct).subscribe ((res: any) => {

        console.log(res);
        this.loadProducts();


    });

  }



  update(id:any){
    this.updateColumn=true;
    for(let i=0; i<this.OrdersArr.length;i++){

      if((Object.values(this.OrdersArr[i])[0]===id))
        this.numberSelected=i;
    }
     this.updatedId=id;
    console.log(this.numberSelected);
    this.updateFormdata = new FormGroup({
      selectedName:new FormControl(),
      updateQuantity: new FormControl("", Validators.required),

  });

  this.updateFormdata.patchValue({
    selectedName:this.OrdersArr[this.numberSelected].ProductName,
    updateQuantity:this.OrdersArr[this.numberSelected].OrderdQuantity
  })




  }


  onUpdateClickSubmit(data:any) {
    let index1=-1;
    console.log(this.updatedId);
    for(let i=0; i<this.OrdersArr.length; i++){
      console.log(this.OrdersArr[i]);
      if((Object.values(this.OrdersArr[i])[0]===this.updatedId))
        index1=i;
    }
    console.log(index1);
    let PrevProductId=Object.values(this.OrdersArr[index1])[1];
    let PrevProductName=String (Object.values(this.OrdersArr[index1])[4]);
    let PrevQuantity:number=Number (Object.values(this.OrdersArr[index1])[5]);
    console.log(data);
    console.log(PrevProductId,PrevProductName,PrevQuantity);
    this.selectedName=data.selectedName;
    this.updateQuantity=Number(data.updateQuantity);
    let index2=-1;
    for(let i=0; i<this.availableProducts.length; i++){
      if(Object.values(this.availableProducts[i])[0]===PrevProductId)
        index2=i;
    }
    console.log(index2);
    if(this.selectedName===PrevProductName){
      console.log("You Selected the Same product just updating quantity");

      let diffrence:number=this.updateQuantity-PrevQuantity;
      console.log(diffrence);

         if((this.availableProducts[index2].quantity-diffrence)>0){
             this.availableProducts[index2].quantity-=diffrence;

             let UpdatedOrder={
               ProductId:PrevProductId,
               ProductName:PrevProductName,
               OrderdQuantity:PrevQuantity+diffrence
             }
             console.log(UpdatedOrder);
             this.OrdersService.updateOrder(this.updatedId,UpdatedOrder).subscribe((res: any) => {
              // everything OK
                console.log(res);
                if(this.IsAdmin){
                  this.loadAllOrders();
                }
                else{
                  this.loadOrdersByUser(this.user.email);
                }


              }

            );
            let updatedProduct:Product={
              name:PrevProductName,
              quantity:this.availableProducts[index2].quantity,
              price:this.availableProducts[index2].price,
              ImageUrl:this.availableProducts[index2].Image
            }
            console.log(updatedProduct);
            this.ProductsService.updateProduct(PrevProductId,updatedProduct).subscribe((res: any) => {

                console.log(res);
                this.loadProducts();


            });

         }

      }


  else{
    let quantity=Number(this.availableProducts[index2].quantity);
    let UPquantity=quantity+PrevQuantity;
    this.availableProducts[index2].quantity=UPquantity;

    let updatedPrevProduct:Product={
      name:PrevProductName,
      quantity:this.availableProducts[index2].quantity,
      price:this.availableProducts[index2].price,
      ImageUrl:this.availableProducts[index2].Image
    }
    console.log(updatedPrevProduct);
    this.ProductsService.updateProduct(PrevProductId,updatedPrevProduct).subscribe( (res: any) => {
     // everything OK
        console.log(res);
        this.loadProducts();


    });
    let index3=-1;
    for(let i=0; i<this.availableProducts.length; i++){
      if(Object.values(this.availableProducts[i])[1]===this.selectedName)
        index3=i;
    }

    console.log(index3);

    this.availableProducts[index3].quantity-=this.updateQuantity;
    const newProductId=Object.values(this.availableProducts[index3])[0];
    let UpdatedOrder={
      ProductId:newProductId,
      ProductName:this.selectedName,
      OrderdQuantity:this.updateQuantity
    }
    console.log(UpdatedOrder);
    this.OrdersService.updateOrder(this.updatedId,UpdatedOrder).subscribe ((res: any) => {

       console.log(res);
       if(this.IsAdmin){
        this.loadAllOrders();
      }
      else{
        this.loadOrdersByUser(this.user.email);
      }


     }

   );
   let updatedNewProduct:Product={
    name:this.selectedName,
    quantity:this.availableProducts[index3].quantity,
    price:this.availableProducts[index3].price,
    ImageUrl:this.availableProducts[index3].Image
  }
  console.log(updatedNewProduct);
  this.ProductsService.updateProduct(newProductId,updatedNewProduct).subscribe ((res: any) => {

      console.log(res);
      this.loadProducts();


  });

  }

  this.updateColumn=false;
  }


}
