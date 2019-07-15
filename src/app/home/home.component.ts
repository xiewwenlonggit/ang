import { OnInit } from '@angular/core';
import { Component, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  empno:string='';
  constructor(private router:ActivatedRoute,private el: ElementRef,private routes:Router) {
    
  }

  ngOnInit() {
    this.router.queryParams.subscribe(data=>{
      this.empno=data.empno;
    });
  }
  checkCount(){
      this.routes.navigate(['/count/check'],{queryParams:{empno:this.empno}})
  }
  destory(){
    window.sessionStorage.removeItem('page');
    window.sessionStorage.removeItem('account');
    window.sessionStorage.removeItem('isLogin');
    this.routes.navigate(['login'])   
  }
  goUser(){
    this.routes.navigate(['/user/user'])
  }
  ngAfterViewInit() {
    //  切换页面
    let lis = this.el.nativeElement.querySelectorAll('.showBtn');
    let divs = this.el.nativeElement.querySelectorAll('.page');
    for (let i = 0; i < lis.length; i++) {
      lis[i].onclick = function () {
        for (var k = 0; k < divs.length; k++) {
          divs[k].style.display = "none";
        }
        divs[i].style.display = "block";
      }
    }
  }

}
