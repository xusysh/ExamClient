import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  public user_id: string = null;

  constructor(private router:Router) { }

  ngOnInit() {

    this.user_id=sessionStorage.getItem('userid')
    //判断是否已经登录，未登录则进行跳转
    if (!this.user_id) {
      alert("请登录");
      this.router.navigateByUrl("/login");
    }  
  }

  Logout():void{
    sessionStorage.clear();
    this.router.navigateByUrl("/login");
  }

}
