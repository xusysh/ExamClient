import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';


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
    this.is_checking=true;
    let user_check_info: UserCheckInfo = {
      username: this.user_name,
      password: this.password,
    };
    this.http_client.post<MyServerResponse>(this.base_url + '/userinfo/login', user_check_info).
      subscribe(response => {
        if (response.msg == "student") {
          this.message.create('success', "考生用户 " + "user_name" + ' 登陆成功');
          this.router.navigateByUrl("/student");
          this.is_checking=false;
        }
        else if (response.msg == "admin") {
          this.message.create('success', "考生用户 " + "user_name" + ' 登陆成功');
          this.router.navigateByUrl("/admin");
          this.is_checking=false;
        }
        else {
          this.message.create('error', '登陆失败：用户名或密码错误');
          this.is_checking=false;
        }
      }, error => {
        this.message.create('error', '登陆失败：连接服务器失败');
        this.is_checking=false;
      });
  }

}

interface MyServerResponse {
  msg: string;
}

interface UserCheckInfo {
  username: string;
  password: string;
}