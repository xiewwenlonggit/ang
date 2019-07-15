import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../service/http.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css']
})
export class CountComponent implements OnInit {
  validateForm: FormGroup;
  empno: string = '';
  ngOnInit() {
    this.router.queryParams.subscribe(data => {
      this.empno = data.empno;
    });
  }
  constructor(private message:NzMessageService,private http: HttpService, private fb: FormBuilder, private router: ActivatedRoute, private routes: Router) {
    this.validateForm = this.fb.group({
      // userName: ['', [Validators.required], [this.userNameAsyncValidator]],
      oldpassword: ['', Validators.required],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],
    });

  }
  submitForm = ($event: any, value: any) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    let emp = { empno: this.empno, oldpassword: value.oldpassword, password: value.password };
    this.http.doPost('/updatePassword', emp).subscribe((data: any) => {
      console.log(data);
      if (data === '你输入的原密码不正确') {
        this.message.create('error','你输入的原密码不正确');
      } else if (data === '修改成功') {
        this.message.create('success','修改密码成功');
        let page =window.sessionStorage.getItem('page');
        if(page==="home"){
          this.routes.navigate(['home/home'],{queryParams:{empno:this.empno}});
        }else{
          this.routes.navigate(['user/user'],{queryParams:{empno:this.empno}});
        }
      } else {
        this.message.create('warning','修改密码失败');
         
      }
    })
  };

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };



}
