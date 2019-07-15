import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../service/http.service';
import { PostService } from 'src/app/service/post.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-level-rule',
  templateUrl: './level-rule.component.html',
  styleUrls: ['./level-rule.component.css']
})
export class LevelRuleComponent implements OnInit {
  isVisible = false;
  isOkLoading = false;
  listData: any[] = [];
  postNameData: any[] = [];
  rankData: any[] = [];
  newRankData:any[]=[];
  arrData: any[] = [];
  arrData2: any[] = [];
  scrollConfig = { x: '1200px', y: '570px' };
  // selectedPostName: string;
  // selectedRank: string;
  postMessage: Object = {};
  rankRuleData: any[] = [];
  constructor(private message: NzMessageService, private fb: FormBuilder, private http: HttpService, private communication: PostService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      selectedPostName: [null, [Validators.required]],
      selectedRank: [null, [Validators.required]],
      score: [null, [Validators.required]],
      lowscore: [null, [Validators.required]],
    });
    this.addField();
    this.getArr(this.listData);
    this.updateEditCache();

    //获取级别规则数据 
    this.getRankRules();

    // 获取级联数据
    this.selectData();
    // 添加岗位级别时异步获取数据
    this.communication.messageSource.subscribe((Message: { action: string, oldpostname: string, postname: string, postrankcount: string }) => {
      // this.info = Message;
      // {postname: "ui测试", postrankcount: "4"}
      let rank = parseInt(Message.postrankcount);
      var arr = [];
      for (let i = 1; i <= rank; i++) {
        let str = i + "级"
        arr.push(str);
      }
      this.postMessage = { [Message.postname]: arr };
      //  this.selectData();
      if (Message.action == "add") {
        this.postNameData.push(Message.postname);
        Object.assign(this.rankData, this.postMessage);
      } else if (Message.action == "delete") {
        for (let i = 0; i < this.postNameData.length; i++) {
          if (this.postNameData[i] == Message.postname) {
            this.postNameData.splice(i, 1);

            this.validateForm.value.selectedPostName = this.postNameData[0];
          }

        }
      } else {
        for (let i = 0; i < this.postNameData.length; i++) {
          if (this.postNameData[i] == Message.oldpostname) {
            this.postNameData.splice(i, 1, Message.postname);
            var arr = [];
            for (let i = 0; i < parseInt(Message.postrankcount); i++) {
              arr.push(i + 1 + "级");
            }
            delete this.rankData[Message.oldpostname];
            Object.assign(this.rankData, { [Message.postname]: arr });
            this.validateForm.value.selectedPostName = this.postNameData[0];

          }
        }
      }

    });
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


  // 因为级别数，分数行数相同，可以用一个方法实现合并行
  getArr(value) {
    var arr = new Array(value.length);
    var x = "";
    var count = 0;
    var startIndex = 0;
    for (let i = 0; i < value.length; i++) {
      var val = value[i].rankname;
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



  selectData() {
    this.http.doGet('/selectAllPostAndRank').subscribe((data: any) => {
      Object.keys(data).forEach((key) => {
        this.validateForm.value.selectedPostName = key[0];
        this.validateForm.value.selectedRank = data[key][0];
      });
      this.postNameData = Object.keys(data);
      this.rankData = data;
    })
  }
  // 数据级联
  postNameChange(value: string): void {
    this.validateForm.value.selectedRank = this.rankData[value][0];
    this.newRankData=this.rankData[value];
  }
  // 获取页面数据

  getRankRules() {
    this.http.doGet('showRulesInfo').subscribe((data: any) => {
      var arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          id: `${i + 1}`,
          postname: data[i].postname,
          rankscore: data[i].rankscore,
          rankrule: data[i].rankrule,
          rankname: data[i].rankname,
          rankid: data[i].rankid,
          ruleid: data[i].ruleid,
          lowscore: data[i].lowscore
        })
      }
      this.listData = arr;
      // 编辑渲染执行编辑操作
      this.updateEditCache();

      this.getArr(this.listData);
    })

  }


  /**.........动态添加规则............. */
  validateForm: FormGroup;
  controlArray: Array<{ id: number; controlInstance: string }> = [];

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.controlArray.length > 0 ? this.controlArray[this.controlArray.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `rule${id}`
    };
    const index = this.controlArray.push(control);
    this.validateForm.addControl(
      this.controlArray[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.controlArray.length > 1) {
      const index = this.controlArray.indexOf(i);
      this.controlArray.splice(index, 1);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  getFormControl(name: string): AbstractControl {
    return this.validateForm.controls[name];
  }
  // 提交数据
  submitForm(): void {
    // 岗位对应规则数据
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    //此时选中的岗位名称，和对应级别

    // 插入数据
    let score = this.validateForm.value.score;
    let lowscore = this.validateForm.value.lowscore;
    let postname=this.validateForm.value.selectedPostName;
    let rankname= this.validateForm.value.selectedRank;
    delete this.validateForm.value.score;//true  删除分数属性
    delete this.validateForm.value.lowscore;
    delete this.validateForm.value.selectedPostName;
    delete this.validateForm.value.selectedRank;

    var arr = [];
    console.log(this.validateForm.value)
    Object.keys(this.validateForm.value).forEach((key) => {
      arr.push(this.validateForm.value[key]);
    })

    let addRuleVO = {
      postname: postname, rankname: rankname,
      rankscore: score, rulelist: arr, lowscore: lowscore
    }
    this.http.doGet('/insertRules', addRuleVO).subscribe((data: any) => {
      if(data=='添加成功'){
        this.message.create('success', '添加成功');
        this.isVisible = false;
        this.getRankRules();
      }else if(data=='及格分必须小于等于规则分'){
        this.message.create('warning', '及格分必须小于等于规则分')  
      }else{
        this.message.create('error', '添加失败');

      }
 

    })

  }


  // 修改删除
  editCache: { [key: string]: any } = {};

  // 修改该数据
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {

    let ind = parseInt(id) - 1;
    var showRuleVO = {
      rankid: this.listData[ind].rankid, rankscore: this.editCache[id].data.rankscore,
      lowscore: this.editCache[id].data.lowscore,
      rankrule: this.editCache[id].data.rankrule, ruleid: this.listData[ind].ruleid
    }
    this.http.doGet('/updateRankandRule', showRuleVO).subscribe((data: any) => {
      // console.log(data);
      if (data == "修改成功") {
        this.message.create('success', '修改成功');
        const index = this.listData.findIndex(item => item.id === id);
        Object.assign(this.listData[index], this.editCache[id].data);
        this.editCache[id].edit = false;
      } else {
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
    console.log(this.listData[index])
    // let  bossAndDeptVO={bossid: this.deptData[index].bossid,deptid:this.deptData[index].deptid }
    this.http.doGet('/deleteRuleByRuleid', { ruleid: this.listData[index].ruleid }).subscribe((data: any) => {
      // console.log(data)
      if (data == "删除成功") {
        this.message.create('success', '删除成功');
        // 页面操作删除
        this.listData = this.listData.filter(d => d.id !== id);
        this.getRankRules();
      }
      else {
        this.message.create('error', '删除失败');
      }
    })



  }








}
