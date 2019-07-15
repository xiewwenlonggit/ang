import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { NzMessageService, UploadFile, UploadFilter } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
@Component({
  selector: 'app-self-comment',
  templateUrl: './self-comment.component.html',
  styleUrls: ['./self-comment.component.css']
})
export class SelfCommentComponent implements OnInit {
  @Input() data: any;//接收父组件的值
  selectedValue: string = '';
  // controlArray: Array<{ id: number, numName: string }> = [];
  postData: any[] = [];
  listData: any[] = [];
  arrData: any[] = [];
  uploadData: {} = {};
  avgScore:number=0;
  scrollConfig = { x: "1330px", y: "850px" };
  constructor(private http: HttpService, private msg: NzMessageService) { }

  ngOnInit() {
    this.getPostInfo();
    //  this.getSelfComment();
    this.getArr(this.listData);
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


  // 获取崗位信息
  getPostInfo() {
    this.http.doGet('/getPostname').subscribe((data: { postname: string[] }) => {
      this.selectedValue = data.postname[0];
      this.postData = data.postname;
    })
  }

  // 获取员工自评表
  getRules() {
    let obj = { postname: this.selectedValue, empno: this.data };
    this.http.doGet('/getSelfcomment', obj).subscribe((data: any) => {
      var arr = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].fileurl != '' && data[i].filename != '') {
          arr.push({
            id: `${i + 1}`,
            rankname: data[i].rankname,
            rankscore: '值为0~' + data[i].rankscore + '之间',
            rankrule: data[i].rankrule,
            score: data[i].rankscore,
            selfcommentid: data[i].selfcommentid,
            remind: data[i].selfscore,
            remark: data[i].note,
            fileName: [{ name: data[i].filename, url: data[i].fileurl }]
          })
        } else {
          arr.push({
            id: `${i + 1}`,
            rankname: data[i].rankname,
            rankscore: '值为0~' + data[i].rankscore + '之间',
            rankrule: data[i].rankrule,
            score: data[i].rankscore,
            selfcommentid: data[i].selfcommentid,
            remind: data[i].selfscore,
            remark: data[i].note,
            fileName: []
          })
        }
      }
      this.listData = arr;
      this.updateEditCache();
      this.getArr(this.listData);

    })
  }

/* 计算平均分 */


// getAvg(){
//   this.avgScore=
// }


  /* 文件上传功能 */


  filters: UploadFilter[] = [
    {
      name: 'type',
      fn: (fileList: UploadFile[]) => {
        const filterFiles = fileList.filter(w => ~['image/png', 'image/jpeg', 'application/pdf'].indexOf(w.type));
        if (filterFiles.length !== fileList.length) {
          this.msg.error(`包含文件格式不正确，只支持jpg,png,pdf格式`);
          return filterFiles;
        }
        return fileList;
      }
    },
    {
      name: 'async',
      fn: (fileList: UploadFile[]) => {
        return new Observable((observer: Observer<UploadFile[]>) => {
          // doing
          observer.next(fileList);
          observer.complete();
        });
      }
    }
  ];


  upData(index) {
    var id = parseInt(index) - 1;
    this.uploadData = { selfcommentid: this.listData[id].selfcommentid }

  }

  handleChange(info: any, index): void {
    if (info.type == 'success') {
        this.editCache[index].data.fileName.push({
          name: info.fileList[0].name,
          url: info.fileList[0].response
        })
      //  this.getRules();
       }
  }
dele(index){
  let id=parseInt(index)-1;
  this.http.doGet('/deletefile',{selfcommentid:this.listData[id].selfcommentid}).subscribe((data:any)=>{
    if(data=="删除成功"){
       this.editCache[index].data.fileName=[];
    }
  })

}
  remove=(file:UploadFile):boolean=>{
    return true;
  }


  // 修改删除
  editCache: { [key: string]: any } = {};


  commitScore(): void {
    let arr = [];
    let newArr = [];
    for (let i in this.editCache) {
      newArr.push(this.editCache[i])
    }
    for (let i = 0; i < this.listData.length; i++) {
      if (newArr[i].data.remind == undefined) {
        newArr[i].data.remind = ''
        newArr[i].data.remark = ''
      }
      if (newArr[i].data.remark == undefined) {
        newArr[i].data.remark = '';
      }
      var obj = {
        selfcommentid: this.listData[i].selfcommentid,
        selfscore: newArr[i].data.remind,
        note: newArr[i].data.remark
      }
      arr.push(obj)
    }
    let selfobj = { 'selfobj': JSON.stringify(arr) };
    this.http.doGet('/updateSelfcomment', selfobj).subscribe((data: any) => {
      if (data == "自评成功") {
        this.msg.create('success', '自评成功');
      }
      else {
        this.msg.create('error', '自评失败')
      }
    })

  }

  updateEditCache(): void {
    this.listData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    this.editCache[item.id].data.remind=0;

    });
  }


}
