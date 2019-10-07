import { Component, OnInit, Injectable, Inject } from '@angular/core';

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})

export class ExaminationComponent implements OnInit {

  //考试截止时间（毫秒）
  public deadline: number = Date.now() + 1000 * 60 * 40;

  constructor() {

  }

  ngOnInit(): void {

  }

}