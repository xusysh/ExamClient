import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user_name: string = null;
  public password: string = null;
  public is_checking: boolean = false;


  constructor(private router: Router, private message: NzMessageService,
    private http_client: HttpClient, @Inject('BASE_URL') private base_url: string) {
  }

  ngOnInit() {
  }

  LoginCheck(): void {
    if(this.user_name=='' || this.user_name==null){
      this.user_name='';
      return;
    }
    if(this.password=='' || this.password==null){
      this.password='';
      return;
    }
    this.is_checking=true;
    let user_check_info: UserCheckInfo = {
      user_name: this.user_name,
      password: this.password,
    };
    this.http_client.post<MyServerResponse>(this.base_url + '/userinfo/login', user_check_info).
      subscribe(response => {
        if(response.status!=200) {
          this.message.create('error', '登陆失败:'+response.msg);
          this.is_checking=false;
        }
        else if (response.data.userType == "student") {
          sessionStorage.setItem('username', this.user_name);
          this.message.create('success', "考生用户 " + this.user_name + ' 登陆成功');
          this.router.navigateByUrl("/student");
          this.is_checking=false;
        }
        else if (response.data.userType == "admin") {
          this.message.create('success', "管理员用户 " + this.user_name + ' 登陆成功');
          this.router.navigate(['/admin']);
          this.is_checking=false;
        }

      }, error => {
        this.message.create('error', '登陆失败：连接服务器失败');
        this.is_checking=false;
      });
  }

}

interface MyServerResponse {
  status:number;
  msg:string;
  data:UserInfo;
}

interface UserInfo{
  id:number;
  password:string;
  userName:string;
  userType:string;
}

interface UserCheckInfo {
  user_name: string;
  password: string;
}