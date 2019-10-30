import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { MyServerResponse } from '../../login/login.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})

export class ExaminationComponent implements OnInit {

  public get_paper_loading: boolean = false;
  public student_paper_info: ServerStudentPaperInfo = {
    paperCode: '',
    title: '',
    paperDescription: '',
    createTime: '',
    lastModifiedTime: '',
    createUserId: 0,
    categoryList: []
  };

  //当前页
  public page_index_char: string = '';
  //考试名
  public exam_name: string = "考试信息获取异常";
  //考试截止时间（毫秒）
  public deadline: number = Date.now() + 1000 * 60 * 40;
  //大题列表
  public categorys: Array<string> = ["数据结构", "计算机组成原理", "计算机网络", "数据库原理"];
  //当前所在的大题
  public current_category: number = 0;
  //当前选择的题目
  public current_question: number = 0;

  //当前选中的单选项
  public radio_value: string = String.fromCharCode(0x41);
  //当前选中的多选项
  public checkbox_values: Array<boolean> = [];
  //控制选择框不同状态的背景色
  public option_bgcolor: Array<string> = [];
  public option_default_bgcolor: string = '#FFFFFF';
  //选项颜色
  public option_bdcolor: Array<string> = [];
  public option_default_bdcolor: string = '#d4d4d4';
  //简答题编辑器和内容
  public editor = ClassicEditor;
  public editor_data = '';
  public editor_config = {
    // 配置语言
    language: 'zh-cn',
    // 工具栏
    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo'],
  };

  @ViewChild('content_canvas', { static: false }) content_canvas_element_view: ElementRef;
  public canvas_height: number = 0;
  public elem_height_str: string = '500px';

  ngAfterViewInit(): void {
    this.canvas_height = this.content_canvas_element_view.nativeElement.offsetHeight;
    this.elem_height_str = Math.ceil(this.canvas_height * 0.85).toString() + 'px';
  }

  constructor(private router: Router, private message: NzMessageService,
    private http_client: HttpClient, @Inject('BASE_URL') private base_url: string, ) {
    sessionStorage.setItem('paper_code', '20191008193539');
    sessionStorage.setItem('exam_id', '3');
    sessionStorage.setItem('userid', '5');
    this.GetPaperInfo();
  }

  ngOnInit(): void {

  }

  GetValue(i: number): string {
    return String.fromCharCode(0x41 + i);
  }

  GetTypeStr(): string {
    let type = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question].type;
    switch (type) {
      case 'single': return '单选题';
      case 'multi': return '不定项选择题';
      case 'judge': return '判断题';
      case 'subjective': return '简答题';
      default: break;
    }
  }

  getPageValue(i: number): string {
    return String.fromCharCode(i);
  }

  updateRadioStatus() {
    let options = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question].options;
    for (let i = 0; i < options.length; i++) {
      if (this.radio_value.charCodeAt(0) == 0x41 + i) {
        this.option_bdcolor[i] = '#0099FF';
        this.option_bgcolor[i] = this.option_default_bgcolor;
      }
      else {
        this.option_bgcolor[i] = this.option_default_bgcolor;
        this.option_bdcolor[i] = this.option_default_bdcolor;
      }
    }
  }

  updateCheckboxStatus() {
    let options = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question].options;
    for (let i = 0; i < options.length; i++) {
      if (this.checkbox_values[i] == true) {
        this.option_bdcolor[i] = '#0099FF';
        this.option_bgcolor[i] = this.option_default_bgcolor;
      }
      else {
        this.option_bgcolor[i] = this.option_default_bgcolor;
        this.option_bdcolor[i] = this.option_default_bdcolor;
      }
    }
  }


  limit() {
    if (this.editor_data.length > 20000) this.editor_data = this.editor_data.substring(0, 20000);
  }

  GetPaperInfo() {
    this.get_paper_loading = true;
    let user_paper_check_info = {
      paper_code: sessionStorage.getItem('paper_code'),
      exam_id: sessionStorage.getItem('exam_id'),
      stu_id: sessionStorage.getItem('userid')
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'spi/stupaper', user_paper_check_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '获取试卷信息失败:' + response.msg);
          this.get_paper_loading = false;
        }
        else {
          this.student_paper_info = response.data;
          this.exam_name = this.student_paper_info.title;
          for (let i = 0; i < this.student_paper_info.categoryList.length; i++) {
            for (let j = 0; j < this.student_paper_info.categoryList[i].questionList.length; j++) {
              let question = this.student_paper_info.categoryList[i].questionList[j];
              question.options = JSON.parse(question.options);
            }
          }
          this.message.create('success', '获取试卷信息成功');
          this.updateRadioStatus();
          this.updateCheckboxStatus();
          this.get_paper_loading = false;
        }
      }, error => {
        this.message.create('error', '获取试卷信息失败：连接服务器失败');
        this.get_paper_loading = false;
      });
  }

  SwitchQuestion(i: number, j: number) {
    this.checkbox_values = new Array<boolean>(this.student_paper_info.categoryList[this.current_category].questionList[this.current_question].options.length);
    this.option_bgcolor = new Array<string>(this.student_paper_info.categoryList[this.current_category].questionList[this.current_question].options.length);
    this.option_bdcolor = new Array<string>(this.student_paper_info.categoryList[this.current_category].questionList[this.current_question].options.length);
    this.current_category = i;
    this.current_question = j;
  }

}

interface ServerStudentPaperInfo {
  paperCode: string,
  title: string,
  paperDescription: string,
  createTime: string,
  lastModifiedTime: string,
  createUserId: number,
  categoryList: Array<CategoryInfo>
}

interface CategoryInfo {
  paperCode: string,
  categoryContent: string,
  questionList: Array<QuestionInfo>
}

interface QuestionInfo {
  score: number,
  ques_id: number,
  options: any,
  student_answer: any,
  description: string,
  type: string,
  content: string,
  mustOrNot: 0
}

interface AnswerInfo {
  id: number,
  content: string
}

interface OptionInfo {
  id: number,
  content: string
}