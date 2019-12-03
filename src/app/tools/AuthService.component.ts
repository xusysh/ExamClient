import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(private http_client: HttpClient) {
  }

  CheckAuth(server_url: string) {
    let auth_token = sessionStorage.getItem("auth_token");
    let auth_info = {"auth_token":auth_token};
    return this.http_client.post(server_url,auth_info);
  }

}