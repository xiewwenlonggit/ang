import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-emp-info',
  templateUrl: './emp-info.component.html',
  styleUrls: ['./emp-info.component.css']
})
export class EmpInfoComponent implements OnInit {
  searchValue = '';
  sortName: string | null = null;
  sortValue: string | null = null;
  isVisible = false;
  isOkLoading = false;
  validateForm: FormGroup;
  listOfDisplayData:any[]=[];
  constructor(private message: NzMessageService,private http: HttpService, private fb: FormBuilder,private datePipe: DatePipe,) { }
  listOfData: Array<{ id: string, empname: string; empno: string; entrytime: string; email: string; telephone: string;[key: string]: string | number }>=[];
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      empname: [null, [Validators.required]],
      empno: [null, [Validators.required]],
      entrytime: [null, [Validators.required]],
      email: [null, [Validators.email,Validators.required]],
      telephone: [null, [ Validators.pattern(/^1(3|4|5|7|8)\d{9}$/),Validators.required]],
      remember: [true]
    });
    this.getEmpInfo();
  }
  // 模态框

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    // this.isOkLoading = true;
    // this.isVisible = false;
    this.submitForm();
  }

  handleCancel(e: MouseEvent): void {
    this.isVisible = false;
  }
// 添加数据

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    let emp= {
      empname: this.validateForm.value.empname, empno: this.validateForm.value.empno,
      email: this.validateForm.value.email, telephone:this.validateForm.value.telephone,
      entrytime:this.datePipe.transform(this.validateForm.value.entrytime,'yyyy-MM-dd')
    }
    this.http.doGet('/insertEmp',emp).subscribe((data: any) => {
      if(data=="此员工号已经存在"){
        this.message.create('warning', '员工已存在')
      }else if(data=="添加成功"){
        this.message.create('success', '添加成功');
        this.isVisible = false;
        this.getEmpInfo();
      }else{
        this.message.create('error', '添加失败')
      }
    })
  }


  // 获取数据
  getEmpInfo() {
    this.http.doGet('/getAllEmp').subscribe((data: any) => {
      var arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          id: `${i + 1}`,
          empname: data[i].empname,
          empno: data[i].empno,
          empid: data[i].empid,
          entrytime: data[i].entrytime.split(" ")[0],
          telephone: data[i].telephone,
          email: data[i].email
        })
      }
      this.listOfData = arr;
      this.listOfDisplayData = [...this.listOfData];
      this.updateEditCache();
    })
  }

  // 重置按钮
  reset(): void {
    this.searchValue = '';
    // this.search();
    console.log(this.listOfDisplayData)
    this.listOfData=this.listOfDisplayData;
  }

  // 根据名字筛选数据
  search(): void {
    const filterFunc = (item: { id: string, empname: string; empno: string; entrytime: string; email: string; telephone: string }) => {
      return (
        item.empname.indexOf(this.searchValue) !== -1
      );
    };
    const data = this.listOfData.filter((item: { id: string, empname: string; empno: string; entrytime: string; email: string; telephone: string; }) => filterFunc(item));
    this.listOfData = data.sort((a, b) =>
      this.sortValue === 'ascend'
        ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
        : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
    );
  }




  // 修改删除
  editCache: { [key: string]: any } = {};

  // 修改该数据
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }
  // 取消修改
  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }
  // 保存修改
  saveEdit(id: string): void {
    for(let i=0;i<this.listOfData.length;i++){
      if(this.listOfData[i].id==id){
        var empId=this.listOfData[i].empid;
      }
    }
    var emp = {
      empid: empId, empno: this.editCache[id].data.empno,
      telephone: this.editCache[id].data.telephone, email:this.editCache[id].data.email,
      entrytime:this.editCache[id].data.entrytime,empname:this.editCache[id].data.empname
    }
    this.http.doGet('/updateEmp', emp).subscribe((data: any) => {
      if (data == "修改成功") {
        this.message.create('success', '修改成功');
        const index = this.listOfData.findIndex(item => item.id === id);
        Object.assign(this.listOfData[index], this.editCache[id].data);
        this.editCache[id].edit = false;
      }else if(data=="此员工号已经存在"){
        this.message.create('warning', '和已有员工号重复')
      } 
      else {
        this.message.create('error', '修改失败');
      }
    })

  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  // 删除数据
  deleteRow(id: string): void {
    // this.listOfData = this.listOfData.filter(d => d.id !== id);
    // 数据库操作删除
    // let index = parseInt(id) - 1;
    for(let i=0;i<this.listOfData.length;i++){
      if(this.listOfData[i].id==id){
        var empId=this.listOfData[i].empid;
      }
    }
    // let  bossAndDeptVO={bossid: this.deptData[index].bossid,deptid:this.deptData[index].deptid }
    this.http.doGet('/deleteEmp', { empid: empId }).subscribe((data: any) => {
      // console.log(data)
      if (data == "删除成功") {
        this.message.create('success', '删除成功');
        // 页面操作删除
        this.listOfData = this.listOfData.filter(d => d.id !== id);
        this.getEmpInfo();
      }
      else {
        this.message.create('error', '删除失败');
      }
    })



  }

}
