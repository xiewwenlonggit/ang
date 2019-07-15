import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import  {LoginComponent} from './login/login.component';
import {RouteguardService} from './service/route-guard.service'
const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',  //项目启动的第一个路由为login
    pathMatch: 'full'
  },
  {
    path: 'login',
    component:LoginComponent,
    canActivate:[RouteguardService]

  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule',
    canActivate:[RouteguardService]

  },
  {
     path:'count',
     loadChildren: './count/count.module#CountModule',
     canActivate:[RouteguardService]
  },
  {
    path: 'user',
    loadChildren: './user/user.module#UserModule',
    canActivate:[RouteguardService]

  },
  {
    path: '**',   // 错误路由重定向[写在最后一个]
    redirectTo: 'login',
    pathMatch: 'full'  // 必须要设置
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[RouteguardService]
})
export class AppRoutingModule { }
