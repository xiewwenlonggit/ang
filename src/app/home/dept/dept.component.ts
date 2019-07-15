import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../service/http.service';
import { PostService } from 'src/app/service/post.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-dept',
  templateUrl: './dept.component.html',
  styleUrls: ['./dept.component.css']
})
export class DeptComponent implements OnInit {
  isVisible = false;
  validateForm: FormGroup;
  deptData: any[] = [];
  newArr: any[] = [];
  selectedValue: string = "";
  optionData: any[] = [];
  selectedBossValue: string = '';
  optionBossData: any[] = [];
  selectedValue2: string = "";
  optionData2: any[] = [];
  selectedBossValue2: string = "";
  optionBossData2: any[] = [];
  scrollConfig = { x: '1000px', y: '550px' };
  flag: boolean = false;

  constructor(private message: NzMessageService, private fb: FormBuilder, private http: HttpService, private commucation: PostService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      deptName: [null, [Validators.required]],
      dutyName: [null, [Validators.required]],
      bigBossName: [null, [Validators.required]],
      selectedValue: [null, [Validators.required]],
      selectedBossValue: [null, [Validators.required]],
      remember: [true]
    });
    //根据部门负责人姓名 获取员工号
    this.validateForm.get('bigBossName').valueChanges.subscribe(val => {
      console.log(val)
      this.http.doGet('/getEmpno', { empname: val }).subscribe((data: any) => {
        this.selectedBossValue = data.empno[0];
        this.optionBossData = data.empno;
        this.validateForm.get('selectedBossValue').setValue(this.selectedBossValue);
      })
    })


    //根据子部门负责人姓名 获取员工号
    this.validateForm.get('dutyName').valueChanges.subscribe(val => {
      console.log(val)
      this.http.doGet('/getEmpno', { empname: val }).subscribe((data: any) => {
        this.selectedValue = data.empno[0];
        this.optionData = data.empno;
        this.validateForm.get('selectedValue').setValue(this.selectedValue);
      })
    })

    this.getData();
  }

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
  getData() {
    this.http.doGet('/selectAllSondept').subscribe((data: any) => {
      console.log(data)
      var arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          id: `${i + 1}`,
          bigbossname: data[i].bigbossname,
          bigbossno: data[i].bigbossno,
          bossid: data[i].bossid,
          deptid: data[i].deptid,
          deptname: data[i].deptname,
          bossname: data[i].bossname,
          empno: data[i].empno
        })
      }
      this.deptData = arr;
      // 编辑渲染执行编辑操作
      this.updateEditCache();

      // this.getArr(this.deptData);
    })
  }



  /* 提交数据 */


  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    // 传递子部门信息数据
    this.commucation.changemessage({ action: "add", deptname: this.validateForm.value.deptName });

    let sondept = { bigbossname: this.validateForm.value.bigBossName, bigbossno: this.validateForm.value.selectedBossValue, deptname: this.validateForm.value.deptName, bossname: this.validateForm.value.dutyName, empno: this.validateForm.value.selectedValue };
    this.http.doGet('/insertSondept', sondept).subscribe((data: any) => {
      if (data == "添加成功") {
        this.message.create('success', '添加成功');
        this.isVisible=false;
        this.getData();
        this.updateEditCache();
      }
      else {
        this.message.create('error', '添加失败')
      }
    })
  }


  checkBossName(name) {
    this.http.doGet('/getEmpno', { empname: name }).subscribe((data: any) => {
      this.selectedBossValue2 = data.empno[0];
      this.optionBossData2 = data.empno;

    })
  }

  checkName(name) {
    this.http.doGet('/getEmpno', { empname: name }).subscribe((data: any) => {
      this.selectedValue2 = data.empno[0];
      this.optionData2 = data.empno;

    })
  }

  // 修改删除
  editCache: { [key: string]: any } = {};

  // 修改该数据
  startEdit(id: string): void {
    if (this.flag == false) {
      this.editCache[id].edit = true;
      // this.selectedValue2.id=`${id}`
      this.selectedValue2 = this.deptData[parseInt(id) - 1].empno;
      this.optionData2 = [this.deptData[parseInt(id) - 1].empno];
      this.selectedBossValue2 = this.deptData[parseInt(id) - 1].bigbossno;
      this.optionBossData2 = [this.deptData[parseInt(id) - 1].bigbossno];
      this.flag = true;
    }
  }

  cancelEdit(id: string): void {
    this.flag = false;
    const index = this.deptData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.deptData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {


    let ind = parseInt(id) - 1;

    // 修改时传递数据
    this.commucation.changemessage({ action: "update", olddeptname: this.deptData[ind].deptname, deptname: this.editCache[id].data.deptname });

    var sondept = {
      bigbossname: this.editCache[id].data.bigbossname,
      bigbossno: this.selectedBossValue2,
      deptname: this.editCache[id].data.deptname, bossname: this.editCache[id].data.bossname,
      deptid: this.deptData[ind].deptid, empno: this.selectedValue2
    }
    this.http.doGet('/updateSondept', sondept).subscribe((data: any) => {
      if (data == "修改成功") {
        this.message.create('success', '修改成功');
        const index = this.deptData.findIndex(item => item.id === id);
        Object.assign(this.deptData[index], this.editCache[id].data);
        this.editCache[id].edit = false;
        this.flag = false;
      } else {
        this.message.create('error', '修改失败');
      }
    })



  }

  updateEditCache(): void {
    this.deptData.forEach(item => {
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
    // 删除时传递数据
    this.commucation.changemessage({ action: "delete", deptname: this.deptData[index].deptname })
    let deptid = { deptid: this.deptData[index].deptid }
    this.http.doGet('/deleteSondept', deptid).subscribe((data: any) => {
      // console.log(data)
      if (data == "删除成功") {
        this.message.create('success', '删除成功');
        // 页面操作删除
        this.deptData = this.deptData.filter(d => d.id !== id);
        this.getData();
      }
      else {
        this.message.create('error', '删除失败');
      }
    })
  }





}
