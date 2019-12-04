import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  public user_id: string = null;
  public user_name:string = null;

  constructor(private router:Router,private http_client:HttpClient) { }

  ngOnInit() {

    this.user_id=sessionStorage.getItem('userid')
    this.user_name=sessionStorage.getItem('username')
    //判断是否已经登录，未登录则进行跳转
    if (!this.user_id) {
      alert("请登录");
      this.router.navigateByUrl("/login");
    }  
  }

  Logout():void{
    let base_url = sessionStorage.getItem("server_base_url");
    let userid = sessionStorage.getItem("userid");
    if (base_url == null || base_url == undefined || base_url == '') return;
    if (userid == null || userid == undefined || userid == '') return;
    let user_info = {
      user_id: userid
    };
    this.http_client.post(base_url + 'upi/user/logout', user_info);
    sessionStorage.clear();
    this.router.navigateByUrl("/login");
  }

}
