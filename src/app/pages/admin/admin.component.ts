import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public user_name: string = null;
  public user_id:string = null;

  isCollapsed:boolean = false;
  side_fix:boolean = false;

  constructor(private router:Router,private http_client:HttpClient) { 

  }

  ngOnInit() {

    this.user_name=sessionStorage.getItem('username')
    this.user_id=sessionStorage.getItem('userid')
    let base_url = sessionStorage.getItem("server_base_url");
    if (base_url == null || base_url == undefined || base_url == '' ||
    this.user_id == null || this.user_id == undefined || this.user_id == '') {
      alert('请登录')
      this.router.navigateByUrl("/login");
      return;
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
    this.http_client.post(base_url + 'upi/user/logout', user_info).toPromise().then(
      ()=>{
        sessionStorage.clear();
        this.router.navigateByUrl("/login");
      }
    );

  }

}
