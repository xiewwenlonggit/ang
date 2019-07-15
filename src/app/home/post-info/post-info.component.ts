import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../service/http.service';
// 实现订阅者模式服务
import { PostService } from 'src/app/service/post.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-post-info',
  templateUrl: './post-info.component.html',
  styleUrls: ['./post-info.component.css']
})
export class PostInfoComponent implements OnInit {
  listOfData: any[] = [];
  isVisible = false;
  isOkLoading = false;
  constructor(private message: NzMessageService,private fb: FormBuilder, private http: HttpService, private communication: PostService) {

  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      postName: [null, [Validators.required]],
      rank: [null, [Validators.required]],
      remember: [true]
    });
    this.getPost();

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

  // 获取数据
  getPost() {
    this.http.doGet('/getAllPost').subscribe((data: any) => {
      var arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          id: `${i + 1}`,
          postid: data[i].postid,
          postname: data[i].postname,
          postrankcount: data[i].postrankcount
        })
      }
      this.listOfData = arr;
      // 编辑渲染执行编辑操作
      this.updateEditCache();
    })

  }

  validateForm: FormGroup;

  // 验证和提交数据
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    // 添加操作
    let post = { postname: this.validateForm.value.postName, postrankcount: this.validateForm.value.rank };
    // 订阅者模式将岗位名称和级别数数据传给岗位规则兄弟组件
    let newPost= {action:"add", postname: this.validateForm.value.postName, postrankcount: this.validateForm.value.rank }
    this.communication.changemessage(newPost);


    this.http.doGet('/addPost', post).subscribe((data: any) => {
      if (data == "添加成功") {
        this.message.create('success', '添加成功');
        this.isVisible = false;
        this.getPost();
        this.updateEditCache();

      }
      else {
        this.message.create('error', '添加失败')
      }
    })

  }






  editCache: { [key: string]: any } = {};
  // 修改该数据
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {


    // 发送请求，修改数据
    // console.log(this.editCache[id].data);
    let ind = parseInt(id) - 1;
    var post = { postname: this.editCache[id].data.postname, postrankcount: this.editCache[id].data.postrankcount, postid: this.listOfData[ind].postid };
    // 修改时实现异步刷新
    let newPost={action:"update",oldpostname:this.listOfData[ind].postname, postname: this.editCache[id].data.postname, postrankcount: this.editCache[id].data.postrankcount, postid: this.listOfData[ind].postid}
    this.communication.changemessage(newPost);
    this.http.doGet('/updateRankCount', post).subscribe((data: any) => {
      // console.log(data);
      if (data == "修改成功") {
        this.message.create('success', '修改成功');
        const index = this.listOfData.findIndex(item => item.id === id);
        Object.assign(this.listOfData[index], this.editCache[id].data);
        this.editCache[id].edit = false;

      } else {
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
    // 数据库操作删除
    let index = parseInt(id) - 1;
    //实现级别规则删除操作时数据刷新 
    let post={action:"delete",postname:this.listOfData[index].postname,postrankcount:this.listOfData[index].postrankcount}
    this.communication.changemessage(post);

    this.http.doGet('/delPost', { postid: this.listOfData[index].postid }).subscribe((data: any) => {
      // console.log(data)
      if (data == "删除成功") {
        this.message.create('success', '删除成功');
        // 页面操作删除
        this.listOfData = this.listOfData.filter(d => d.id !== id);
        // this.getPost();
      }
      else {
        this.message.create('error', '删除失败');
      }
    })

  }
}
