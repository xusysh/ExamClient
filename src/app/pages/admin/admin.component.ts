import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public user_name: string = null;

  constructor(private router:Router) { }

  ngOnInit() {

    this.user_name=sessionStorage.getItem('username')
    //判断是否已经登录，未登录则进行跳转
/*    if (!this.user_name) {
      alert("请登录");
      this.router.navigateByUrl("/login");
    }  */
  }

  Logout():void{
    sessionStorage.clear();
    this.router.navigateByUrl("/login");
  }

}
