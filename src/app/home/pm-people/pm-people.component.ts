import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { HttpService } from '../../service/http.service';
import { PostService } from 'src/app/service/post.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-pm-people',
  templateUrl: './pm-people.component.html',
  styleUrls: ['./pm-people.component.css']
})
export class PmPeopleComponent implements OnInit {
  isVisible = false;
  flag: boolean = false;
  listData: any[] = [];
  controlArray: Array<{ id: number; controlInstance: string; }> = [];
  validateForm: FormGroup;
  arr: any[] = [];
  selectedItemName: string = '';
  optionItemData: any[] = [];
  selectedgroup: any[] = [];
  optionData: any[] = [];
  selectedNo: string = '';
  optionNoData: any[] = [];
  empno: any[] = [];
  selectedLeadno: string = '';
  optionLeadData: any[] = [];
  selectedEmpValue: string = '';
  optionEmpData: any[] = [];
  // 滚动配置
  scrollConfig = { x: '1200px', y: '550px' };
  arrData: any[] = [];
  constructor(private message: NzMessageService,private fb: FormBuilder, private http: HttpService, private commucation: PostService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      selectedItemName: [null, [Validators.required]],
      groupname: [null, [Validators.required]],
      groupleadname: [null, [Validators.required]],
      selectedgroup: [null, [Validators.required]],
      selectedNo: [null, [Validators.required]],
      remember: [true]
    });
    // 合并行函数
    this.getArr(this.listData);
    // 获取项目名称
    this.getItemName();
    // 添加成员
    this.addField();
    // 获取项目组信息
    this.getItemInfo();

    this.commucation.messageSource.subscribe((Message: { action: string, olditemname: string, itemname: string }) => {
      if (Message.action == "add") {
        this.optionItemData.push(Message.itemname);
      } if (Message.action == "update") {
        for (let i = 0; i < this.optionItemData.length; i++) {
          if (this.optionItemData[i] == Message.olditemname) {
            this.optionItemData.splice(i, 1, Message.itemname);
            this.validateForm.get('selectedItemName').setValue(this.optionItemData[0]);

          }
        }
      } else {
        for (let i = 0; i < this.optionItemData.length; i++) {
          if (this.optionItemData[i] == Message.itemname) {
            this.optionItemData.splice(i, 1);
            this.validateForm.get('selectedItemName').setValue(this.optionItemData[0]);

          }
        }
      }
    })

  }


  getItemName() {
    this.http.doGet('/getItemname').subscribe((data: { [deptname: string]: string[] }) => {
      // console.log(data)
      this.selectedItemName = data.itemname[0];
      this.optionItemData = data.itemname;
      this.validateForm.get('selectedItemName').setValue(this.selectedItemName);
    })
  }



  // 根据项目组长姓名获取员工号
  checkGroupName(name) {
    this.http.doGet('/getEmpno', { empname: name }).subscribe((data: any) => {
      this.selectedgroup = data.empno[0];
      this.optionData = data.empno;
      this.validateForm.get('selectedgroup').setValue(this.selectedgroup);
    })
  }
  //根据组员姓名 获取员工号
  checkName(val, index) {
    this.http.doGet('/getEmpno', { empname: val }).subscribe((data: any) => {
      if (data.empno != '' && data.empno != undefined && data.empno != null) {
        this.arr.push(data.empno);
        // console.log(this.arr)
        // this.selectedNo[index] =this.arr[index][0];
        this.optionNoData = this.arr[index];
      }
    })
  }


  // 添加项目组成员

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.controlArray.length > 0 ? this.controlArray[this.controlArray.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `passenger${id}`,
    };
    const index = this.controlArray.push(control);
    // console.log(this.controlArray[this.controlArray.length - 1]);
    this.validateForm.addControl(
      this.controlArray[index - 1].controlInstance,
      new FormControl(null, Validators.required),

    );
  }
  //移除项目组成员
  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.controlArray.length > 1) {
      const index = this.controlArray.indexOf(i);
      this.controlArray.splice(index, 1);
      console.log(this.controlArray);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  getFormControl(name: string): AbstractControl {
    return this.validateForm.controls[name];
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


  // 提交数据
  submitForm() {
    var newArr = [];
    Object.keys(this.validateForm.value).forEach((key) => {

      if (key.indexOf("passenger") != -1) {
        newArr.push(this.validateForm.value[key]);
      }
      this.empno = newArr
    })
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    let itempeopleVO = {
      itemname: this.validateForm.value.selectedItemName, groupname: this.validateForm.value.groupname,
      groupleadname: this.validateForm.value.groupleadname,
      groupleadno: this.validateForm.value.selectedgroup,
      empno: this.empno
    }
    this.http.doGet('/insertItemPeople', itempeopleVO).subscribe((data: any) => {
      if (data == "添加成功") {
        this.message.create('success', '添加成功');
        this.isVisible = false;
        this.getItemInfo();

      } else if (data == "此项目已经存在") {
        this.message.create('warning', '此项目已经存在')
      } else {
        this.message.create('error', '添加失败');
      }

    })

  }
  // 获取项目组信息
  getItemInfo() {
    this.http.doGet('/getItemGroup').subscribe((data: any[]) => {
      this.listData = data;
      this.updateEditCache();
      this.getArr(this.listData);
    })
  }





  // 因为级别数，分数行数相同，可以用一个方法实现合并行
  getArr(value) {
    var arr = new Array(value.length);
    var x = "";
    var count = 0;
    var startIndex = 0;
    for (let i = 0; i < value.length; i++) {
      var val = value[i].itemname;
      if (i == 0) {
        x = val;
        count = 1;
        arr[0] = 1;
      } else {
        if (val == x) {
          count++;
          arr[startIndex] = count;
          arr[i] = 0
        } else {
          count = 1;
          x = val;
          startIndex = i;
          arr[i] = 1
        }
      }
    }
    this.arrData = arr;
  }

  // 控制合并行
  renderContent(inb) {
    if (this.arrData[inb] !== 0) {
      return this.arrData[inb];
    }
  }
  // 控制影藏
  show(inb) {
    if (this.arrData[inb] != 0) {
      return true;
    } else {
      return false;
    }
  }


  /* 修改组长时根据员工姓名回填员工号 */
  checkLeadName(val) {
    this.http.doGet('/getEmpno', { empname: val }).subscribe((data: any) => {
      this.selectedLeadno = data.empno[0];
      this.optionLeadData = data.empno;
      // this.validateForm.get('selectedgroup').setValue(this.selectedgroup);
    })
  }
  /* 修改普通组员根据姓名回填员工号 */
  checkEmpName(val){
    this.http.doGet('/getEmpno', { empname: val }).subscribe((data: any) => {
      this.selectedEmpValue = data.empno[0];
      this.optionEmpData = data.empno;
      // this.validateForm.get('selectedgroup').setValue(this.selectedgroup);
    })
  }







  // 修改删除
  editCache: { [key: string]: any } = {};

  // 修改该数据
  startEdit(id: string): void {
    if (this.flag == false) {
      this.editCache[id].edit = true;
      let ind = parseInt(this.editCache[id].data.id) - 1;
      this.optionLeadData = [this.listData[ind].groupleadno];
      this.selectedLeadno = this.listData[ind].groupleadno;
      this.selectedEmpValue = this.listData[ind].empno;
      this.optionEmpData = [this.listData[ind].empno];
      this.flag = true;
    }
    
  }

  cancelEdit(id: string): void {
    this.flag=false;
    const index = this.listData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {

    let ind = parseInt(this.editCache[id].data.id) - 1;

    var itempeople= {
      itempeopleid: this.listData[ind].itempeopleid,
      groupleadname:this.editCache[id].data.groupleadname,
      empname:this.editCache[id].data.empname,
      groupleadno: this.selectedLeadno, empno: this.selectedEmpValue,
      // empno: this.selectedValue2, empname: this.editCache[id].data.empname, itemdescribe: this.editCache[id].data.itemdescribe
    }
    this.http.doGet('/updateItempeople', itempeople).subscribe((data: any) => {
      // console.log(data);
      if (data == "修改成功") {
        this.message.create('success', '修改成功');
        this.getItemInfo();
        this.flag = false;
        // const index = this.listData.findIndex(item => item.id === id);
        // Object.assign(this.listData[index], this.editCache[id].data);
        this.editCache[id].edit = false;
      } 
      else {
        this.message.create('success', '修改成功');
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
    // 数据库操作删除
    let index = parseInt(id) - 1;
    console.log(this.listData[index])
    // let  bossAndDeptVO={bossid: this.deptData[index].bossid,deptid:this.deptData[index].deptid }
    this.http.doGet('/deleteItempeople', { itempeopleid: this.listData[index].itempeopleid }).subscribe((data: any) => {
      // console.log(data)
      if (data == "删除成功") {
        this.message.create('success', '删除成功');
        // 页面操作删除
        // this.listData = this.listData.filter(d => d.id !== id);
        this.getItemInfo();
      }
      else {
        this.message.create('error', '删除失败');
      }
    })



  }
}