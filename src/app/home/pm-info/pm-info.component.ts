import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../service/http.service';
import { PostService } from 'src/app/service/post.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-pm-info',
  templateUrl: './pm-info.component.html',
  styleUrls: ['./pm-info.component.css']
})
export class PmInfoComponent implements OnInit {
  isVisible = false;
  listData: any[] = [];
  validateForm: FormGroup;
  selectedDept: string = "";
  selectedValue: string = "";
  optionData: any[] = [];
  selectedValue2: string = "";
  optionData2: any[] = [];
  optionDeptData: any[] = [];
  constructor(private message: NzMessageService, private fb: FormBuilder, private http: HttpService, private commucation: PostService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      itemname: [null, [Validators.required]],
      // itemdept: [null, [Validators.required]],
      itemlead: [null, [Validators.required]],
      // empno: [null, [Validators.required]],
      selectedValue: [null, [Validators.required]],
      selectedDept: [null, [Validators.required]],
      itemdescribe: [null, [Validators.required]],
      remember: [true]
    });

    // 获取子部门名称
    this.getDept();

    //根据员工姓名 获取员工号
    this.validateForm.get('itemlead').valueChanges.subscribe(val => {
      this.http.doGet('/getEmpno', { empname: val }).subscribe((data: any) => {
        this.selectedValue = data.empno[0];
        this.optionData = data.empno;
        this.validateForm.get('selectedValue').setValue(this.selectedValue);
      })
    })
    // 获取项目信息
    this.getPmInfo();

    this.commucation.messageSource.subscribe((Message: { action: string, olddeptname: string, deptname: string }) => {
      if (Message.action == "add") {
        this.optionDeptData.push(Message.deptname);
      } if (Message.action == "update") {
        for (let i = 0; i < this.optionDeptData.length; i++) {
          if (this.optionDeptData[i] == Message.olddeptname) {
            this.optionDeptData.splice(i, 1, Message.deptname);
            this.validateForm.get('selectedDept').setValue(this.optionDeptData[0]);

          }
        }
      } else {
        for (let i = 0; i < this.optionDeptData.length; i++) {
          if (this.optionDeptData[i] == Message.deptname) {
            this.optionDeptData.splice(i, 1);
            this.validateForm.get('selectedDept').setValue(this.optionDeptData[0]);

          }
        }
      }
    })

  }

  checkName(name) {
    this.http.doGet('/getEmpno', { empname: name }).subscribe((data: any) => {
      this.selectedValue2 = data.empno[0];
      this.optionData2 = data.empno;
      // this.validateForm.get('selectedValue').setValue(this.selectedValue);
    })
  }



  // 模态框
  showModal(): void {
    this.isVisible = true;
  }
  // 点击确认
  handleOk(): void {
    this.submitForm();
  }
  // 点击取消
  handleCancel(e: MouseEvent): void {
    this.isVisible = false;
  }
  getDept() {
    this.http.doGet('/getDeptname').subscribe((data: { [deptname: string]: string[] }) => {
      this.selectedDept = data.deptname[0];
      this.optionDeptData = data.deptname;
      this.validateForm.get('selectedDept').setValue(this.selectedDept);
    })
  }

  // 提交数据
  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    // 传递添加项目的名称
    this.commucation.changemessage({ action: "add", itemname: this.validateForm.value.itemname })

    let item = {
      itemname: this.validateForm.value.itemname, deptname: this.validateForm.value.selectedDept,
      empno: this.validateForm.value.selectedValue,
      itemdescribe: this.validateForm.value.itemdescribe, empname: this.validateForm.value.itemlead
    }
    this.http.doGet('/insertItem', item).subscribe((data: any) => {
      if (data == "添加成功") {
        this.message.create('success', '添加成功');
        this.isVisible = false;
        this.getPmInfo();

      } else if (data == "此项目已经存在") {
        this.message.create('warning', '此项目已经存在')
      } else {
        this.message.create('error', '添加失败');
      }

    })

  }
  // 获取项目信息
  getPmInfo() {
    this.http.doGet('/getItem').subscribe((data: any[]) => {
      this.listData = data;
      this.updateEditCache();
    })
  }



  // 修改删除
  editCache: { [key: string]: any } = {};

  // 修改该数据
  startEdit(id: string): void {
    this.editCache[id].edit = true;
    let ind = parseInt(this.editCache[id].data.id) - 1;
    this.selectedValue2 = this.listData[ind].empno;
    this.optionData2 = [this.listData[ind].empno];
  }

  cancelEdit(id: string): void {
    const index = this.listData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {

    let ind = parseInt(this.editCache[id].data.id) - 1;
    //  传递修改时项目的名称
    this.commucation.changemessage({ action: "update", olditemname: this.listData[ind].itemname, itemname: this.editCache[id].data.itemname })

    var item = {
      itemid: this.listData[ind].itemid,
      itemname: this.editCache[id].data.itemname, itemdept: this.editCache[id].data.itemdept,
      empno: this.selectedValue2, empname: this.editCache[id].data.empname, itemdescribe: this.editCache[id].data.itemdescribe
    }
    this.http.doGet('/updateItem', item).subscribe((data: any) => {
      // console.log(data);
      if (data == "修改成功") {
        this.message.create('success', '修改成功');
        this.getPmInfo();

        // const index = this.listData.findIndex(item => item.id === id);
        // Object.assign(this.listData[index], this.editCache[id].data);
        this.editCache[id].edit = false;
      } else if (data == "此项目已经存在") {
        this.message.create('warning', '项目名重复')
      }
      else {
        this.message.create('error', '修改失败');
      }
    })

  }

  updateEditCache(): void {
    this.listData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  // 删除数据
  deleteRow(id: string): void {
    // this.listData = this.listData.filter(d => d.id !== id);
    // 数据库操作删除
    let index = parseInt(id) - 1;
    // 删除时传递数据
    this.commucation.changemessage({ action: "delete", itemname: this.listData[index].itemname })
    // let  bossAndDeptVO={bossid: this.deptData[index].bossid,deptid:this.deptData[index].deptid }
    this.http.doGet('/deleteItem', { itemid: this.listData[index].itemid }).subscribe((data: any) => {
      // console.log(data)
      if (data == "删除成功") {
        this.message.create('success', '删除成功');
        // 页面操作删除
        this.listData = this.listData.filter(d => d.id !== id);
        this.getPmInfo();
      }
      else {
        this.message.create('error', '删除失败');
      }
    })



  }
}
