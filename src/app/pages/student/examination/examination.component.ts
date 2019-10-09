import { Component, OnInit, Injectable, Inject } from '@angular/core';

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})

export class ExaminationComponent implements OnInit {

  //题目列表
  public questions:Array<object> = new Array<object>(50);
  //当前页
  public page_index_char:string = '';
  //考试名
  public exam_name:string = "2019年10月金融科技部考试";
  //考试截止时间（毫秒）
  public deadline: number = Date.now() + 1000 * 60 * 40;
  //大题列表
  public categorys: Array<string> = ["数据结构","计算机组成原理", "计算机网络", "数据库原理" ];
  //当前所在的大题
  public current_category: number = 1;
  //题目
  public question_desc:string = "对于 int *pa[5]; 的描述，正确的是（    ）";
  //选项
  public options:Array<string> = ["pa是一个指向数组的指针，所指向的数组是5个int型元素",
  "pa是一个指向某个数组第5个元素的指针，该元素是int型变量",
  "pa[5]表示某个数组第5个元素的值",
  "pa是一个具有5个元素的指针数组，每个元素是一个int型指针"];
  //当前选中的单选项
  public radio_value:string = String.fromCharCode(0x41);
  //控制选择框不同状态的背景色
  public option_bgcolor:Array<string> = new Array<string>(this.options.length);
  public option_default_bgcolor:string = '#FFFFFF';
  //选项颜色
  public option_bdcolor:Array<string> = new Array<string>(this.options.length);
  public option_default_bdcolor:string = '#d4d4d4';

  emm:boolean=false;

  constructor() {
    this.updateRadioStatus();
  }

  ngOnInit(): void {

  }

  getValue(i:number):string{
    return String.fromCharCode(0x41+i);
  }

  getPageValue(i:number):string{
    return String.fromCharCode(i);
  }

  updateRadioStatus(){
    for(let i=0;i<this.options.length;i++){
      if(this.radio_value.charCodeAt(0) == 0x41+i) {
        this.option_bdcolor[i] = '#0099FF';
        this.option_bgcolor[i] = this.option_default_bgcolor;
      }
      else {
        this.option_bgcolor[i] = this.option_default_bgcolor;
        this.option_bdcolor[i] = this.option_default_bdcolor;
      }
    }
  }

    openMap: { [name: string]: boolean } = {
    sub1: true,
    sub2: false,
    sub3: false,
    sub4:false
  };

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

}