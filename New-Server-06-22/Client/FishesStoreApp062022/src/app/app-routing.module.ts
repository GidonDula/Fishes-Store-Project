import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

import { AuthGuard } from './Services/auth.guard';
import { GalleryComponent } from './gallery/gallery.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ProductsGuestComponent } from './products-guest/products-guest.component';
import { ProductsUserComponent } from './products-user/products-user.component';
import { ChatComponent } from './chat/chat.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { UpdateUserComponent } from './update-user/update-user.component';

const routes: Routes = [

  {path:'login',
component:LoginComponent
},
{
path:'register',
component:RegisterComponent

},

{
path:'gallery',
component:GalleryComponent

},
{
path:'home',
component:HomeComponent

},
{
path:'AboutUs',
component:AboutUsComponent

},

{
path:'contactUs',
component:ContactUsComponent

},
{
path:'products-guest',
component:ProductsGuestComponent

},
{
  path:'chat',
  component:ChatComponent,
  canActivate: [AuthGuard],
  },
  {
    path:'orders',
    component:OrdersComponent,
    canActivate: [AuthGuard],
    },
    {
      path:'User',
      component:UsersComponent,
      canActivate: [AuthGuard],
      },
      {
        path:'updateUser',
        component:UpdateUserComponent,
        canActivate: [AuthGuard],
        },
    {
      path:'profile',
      component:ProfileComponent,
      canActivate: [AuthGuard],
      },

{
  path:'products-User',
  component:ProductsUserComponent,
  canActivate: [AuthGuard],
  },

{

  path:'',
  redirectTo:'home',
  pathMatch:'full'


},{
path:'**',
redirectTo:''
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled',useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
