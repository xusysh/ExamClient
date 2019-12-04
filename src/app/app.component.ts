import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;

  constructor(private http_client: HttpClient,private router:Router) {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  /*  let base_url = sessionStorage.getItem("server_base_url");
    let userid = sessionStorage.getItem("userid");
    if (base_url == null || base_url == undefined || base_url == '' ||
    userid == null || userid == undefined || userid == '') {
      alert('请登录')
      this.router.navigateByUrl("/login");
      return;
    }  */
    //auth token check with server
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    // ...
    console.log('unload');
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    // ...
    console.log('before unload');
    let base_url = sessionStorage.getItem("server_base_url");
    let userid = sessionStorage.getItem("userid");
    if (base_url == null || base_url == undefined || base_url == '') return;
    if (userid == null || userid == undefined || userid == '') return;
    let user_info = {
      user_id: userid
    };
    console.log('base_url:'+base_url);
    console.log('userid:'+userid);
    this.http_client.post(base_url + 'upi/user/logout', user_info).toPromise().then(()=>{});
  }

}
