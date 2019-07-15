import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public api = '/api';
  // public api = 'http://localhost:4200/';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
 
  };
  constructor(public http: HttpClient) {}

  // get请求
  doGet(url: any,params?: any) {
    console.log(params);
    return new Observable(observer => {
      this.http.get(this.api + url,{params:params}).subscribe(response => {
        observer.next(response);
        console.log(response)
      }, err => {
        observer.error(err);
      });
    });
  }

  // post请求
  doPost(url: any, params?: any) {

    // params.timespan = new Date().getTime();

    // params.signature = this.encryption(params);

    return new Observable(observer => {
      this.http.post(this.api + url, params, this.httpOptions).subscribe(response => {
        observer.next(response);
      }, err => {
        observer.error(err);
      });
    });
  }

  // 加密处理
  // encryption(data: any) {
  //   let str = '';
  //   for (const key in data) {
  //     if (true) {
  //       if (typeof data[key] === 'object') {
  //         data[key] = JSON.stringify(data[key]);
  //       }
  //       str += key + data[key];
  //     }
  //   }
  //   return Md5.hashStr(str);
  // }

}

