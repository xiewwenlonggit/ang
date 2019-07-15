import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable(
  {
    providedIn: 'root'
  }
)
export class PostService {
  constructor() { }
  public messageSource = new BehaviorSubject<Object>('Start');
  changemessage(Message): void {
    this.messageSource.next(Message);
  }
 

}
