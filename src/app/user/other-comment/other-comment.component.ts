import { Component, OnInit,Input, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
const count = 5;
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

@Component({
  selector: 'app-other-comment',
  templateUrl: './other-comment.component.html',
  styleUrls: ['./other-comment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherCommentComponent implements OnInit {
 @Input() data:any;
//  listData:any[]=[];
//  empInfo:any[]=[];
 
 initLoading = true; // bug
 loadingMore = false;
 newData: any[] = [];
 list: Array<{ loading: boolean; name: any }> = [];

 constructor(private http: HttpClient, private msg: NzMessageService) {}

 ngOnInit(): void {
   this.getData((res: any) => {
     console.log(res);
     this.newData = res.results;
     this.list = res.results;
     this.initLoading = false;
   });
 }

 getData(callback: (res: any) => void): void {
   this.http.get('/api/getOthercomment',{params:{empno:this.data}}).subscribe((res: any) => callback(res));
 }

 onLoadMore(): void {
   this.loadingMore = true;
   this.list = this.newData.concat([...Array(count)].fill({}).map(() => ({ loading: true, name: {} })));
   this.http.get(fakeDataUrl).subscribe((res: any) => {
     this.newData = this.newData.concat(res.results);
     this.list = [...this.newData];
     this.loadingMore = false;
   });
 }

 edit(item: any): void {
   this.msg.success(item.email);
 }
}




