import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';


import { TokenInterceptorService } from './Services/token-interceptor.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductsUserComponent } from './products-user/products-user.component';
import { ProductsGuestComponent } from './products-guest/products-guest.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UsersComponent } from './users/users.component';
import { OrdersComponent } from './orders/orders.component';
import { ChatComponent } from './chat/chat.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { environment } from '../environments/environment';

const config: SocketIoConfig = { url: environment.baseUrl, options: {
  transports: ['websocket', 'polling']
} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductsUserComponent,
    ProductsGuestComponent,
    UpdateUserComponent,
    UsersComponent,
    OrdersComponent,
    ChatComponent,
    AboutUsComponent,
    ContactUsComponent,
    HomeComponent,
    GalleryComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptorService,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
