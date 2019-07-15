import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  data:string='';
  constructor(public router:ActivatedRoute,private el:ElementRef,private routes:Router) { }

  ngOnInit() {
    this.router.queryParams.subscribe(data=>{
      // console.log(data);
      this.data=data.empno;
    });
    
    
  }
  ngAfterViewInit(){
        //  切换页面
  let lis= this.el.nativeElement.querySelectorAll('.showBtn');
  let divs= this.el.nativeElement.querySelectorAll('.page');
  for(let i=0;i<lis.length;i++){
    lis[i].onclick=function(){
      for(var k = 0; k < divs.length; k++) {
        divs[k].style.display = "none";
      }
      divs[i].style.display = "block";
    }
  }
}

// goSelf(){
//   console.log(11)
//   this.routes.navigate(['self'],{queryParams:{empno:this.data}});
// }
// goOther(){
//   this.routes.navigate(['./other'],{queryParams:{empno:this.data}});
// }
}
