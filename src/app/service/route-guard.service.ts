import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from "@angular/router";
// import userModel from '../model/user.model';
@Injectable()
export class RouteguardService implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // 返回值 true: 跳转到当前路由 false: 不跳转到当前路由
    // 当前路由名称
    var path = route.routeConfig.path;
    console.log(path);
    // nextRoute: 设置需要路由守卫的路由集合
    const nextRoute = ['home', 'user','count'];

    let isLogin = window.sessionStorage.getItem('isLogin');  // 是否登录
    // 当前路由是nextRoute指定页时
    if (nextRoute.indexOf(path) >= 0) {
      if (isLogin==null||isLogin=='false') {
        // 未登录，跳转到login
        this.router.navigate(['login']);
        return false;
      } 
      else {
        // 已登录，跳转到当前路由
        return true;
      }
    }
    // 当前路由是login时 
    let account=window.sessionStorage.getItem('account')
    if (path === 'login') {
      if (isLogin=='false'||isLogin==null) {
        // 未登录，跳转到当前路由
        return true;
      } else {
        if (window.sessionStorage.getItem('page') == 'home') {
          // 已登录，跳转到home
          this.router.navigate(['home/home'],{queryParams:{empno:account}});
        } else {
          this.router.navigate(['user/user'],{queryParams:{empno:account}});
        }
        return false;
      }
    }
  }

}