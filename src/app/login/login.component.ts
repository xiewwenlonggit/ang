import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import {HttpService} from '../service/http.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  // config = {};
  passwordVisible:false;
  password: string;
  
  constructor(private fb: FormBuilder, private http: HttpService,private message: NzMessageService,private routes:Router) {
  }


  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
      window.sessionStorage.setItem('isLogin','false');
  }


  submitForm(type: string): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

     let emp={empno:this.validateForm.value.userName,password:this.validateForm.value.password};
    this.http.doPost('/login',emp).subscribe((data:any)=>{
       if(data!=null){
         window.sessionStorage.setItem('account',data.empno);
        if (data.role=="2"){
          window.sessionStorage.setItem('isLogin','true');
          window.sessionStorage.setItem('page','user');
          this.routes.navigate(['/user/user'],{queryParams:{empno:data.empno}});
        }else{
          window.sessionStorage.setItem('isLogin','true');
          window.sessionStorage.setItem('page','home');

          this.routes.navigate(['/home/home'],{queryParams:{empno:data.empno}});
        }
       }else{
        this.message.create('error', "用户名或密码错误");
       }

    }

    )
  }





}
