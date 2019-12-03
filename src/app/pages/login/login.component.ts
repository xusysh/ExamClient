import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { AuthService } from 'src/app/tools/AuthService.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user_name: string = null;
  public password: string = null;
  public is_checking: boolean = false;
  //electron桌面版标志
  public is_electron: boolean = false;
  public server_base_url: string = '';

  constructor(private router: Router, private message: NzMessageService, private auth_service: AuthService,
    private http_client: HttpClient, @Inject('BASE_URL') private base_url: string,
    @Inject('DBG_BASE_URL') private dbg_base_url: string) {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') > -1) {
      // Electron-specific code
      this.is_electron = true;
    }
  }


  ngOnInit() {
  }

  LoginCheck(): void {
    if (this.user_name == '' || this.user_name == null) {
      this.user_name = '';
      return;
    }
    if (this.password == '' || this.password == null) {
      this.password = '';
      return;
    }
    this.is_checking = true;
    let user_check_info: UserCheckInfo = {
      user_name: this.user_name,
      password: this.password,
    };
    if (this.server_base_url == '') {
      sessionStorage.setItem('server_base_url', this.base_url);
    }
    else {
      sessionStorage.setItem('server_base_url', this.server_base_url);
      this.base_url = this.server_base_url;
    }
    let server_url = this.base_url + 'upi/user/login';

    this.http_client.post<MyServerResponse>(server_url, user_check_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '登陆失败:' + response.msg);
          this.is_checking = false;
        }
        else {
          sessionStorage.setItem('auth_token',response.data.auth_token);
          if (response.data.user_info.role == "student") {
            sessionStorage.setItem('username', this.user_name);
            sessionStorage.setItem('userid', response.data.id);
            this.message.create('success', "考生用户 " + this.user_name + ' 登陆成功');
            this.router.navigateByUrl("/student");
            this.is_checking = false;
          }
          else if (response.data.user_info.role == "admin") {
            sessionStorage.setItem('username', this.user_name);
            sessionStorage.setItem('userid', response.data.id);
            this.message.create('success', "管理员用户 " + this.user_name + ' 登陆成功');
            this.router.navigate(['/admin']);
            this.is_checking = false;
          }
        }
      }, error => {
        this.message.create('error', '登陆失败：连接服务器失败');
        this.is_checking = false;
      });
  }

}

export interface MyServerResponse {
  status: number;
  msg: string;
  data: any;
}

interface UserInfo {
  id: number;
  name: string;
  password: string;
  role: string;
}

interface UserCheckInfo {
  user_name: string;
  password: string;
}
