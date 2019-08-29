import { Component, OnInit } from '@angular/core';
import{ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  public user_name: string = 'undefined';

  constructor(private activedRoute:ActivatedRoute) { }

  ngOnInit() {
    
    this.activedRoute.queryParams.subscribe(params =>{
      this.user_name = params.user_name;
     
  });
  }

}
