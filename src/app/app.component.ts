import { Component,ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public constructor(private viewcontainer:ViewContainerRef){}
  title = '定岗定级系统';

}
