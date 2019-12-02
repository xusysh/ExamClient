import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

    constructor(private httpClient: HttpClient) {
    }

    CheckAuth(server_url: string) {
        return new Promise(() => {
            setTimeout(() => {
                alert('promise done');
            }, 1000);
        });
    }

}