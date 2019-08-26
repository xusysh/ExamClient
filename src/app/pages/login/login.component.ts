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
  validateForm: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
    private http_client: HttpClient, @Inject('BASE_URL') private base_url: string) {
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    var user_check_info: UserCheckInfo = {
      user_name: 'admin',
      password: 'admin'
    };
    let a = null
    this.http_client.post<MyServerResponse>(this.base_url + '/login/check', user_check_info).
      subscribe(response =>{
        if (response.msg == "valid") {
          this.message.create('success', "user_name" + ' 登陆成功');
          this.router.navigateByUrl("student");
        }
        else {
          this.message.create('error', '登陆失败：用户名或密码错误');
        }
      }, error => this.message.create('error', '登陆失败：连接服务器失败'));


  }


}

interface MyServerResponse {
  msg: string;
}

interface UserCheckInfo {
  user_name: string;
  password: string;
}