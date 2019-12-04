import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;

  constructor(private http_client: HttpClient) {
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    // ...
    //    console.log('unload');
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    // ...
    //    console.log('before unload');
    let base_url = sessionStorage.getItem("server_base_url");
    let userid = sessionStorage.getItem("userid");
    if (base_url == null || base_url == undefined || base_url == '') return;
    if (userid == null || userid == undefined || userid == '') return;
    let user_info = {
      user_id: userid
    };
    this.http_client.post(base_url + 'upi/user/logout', user_info);
  }

}
