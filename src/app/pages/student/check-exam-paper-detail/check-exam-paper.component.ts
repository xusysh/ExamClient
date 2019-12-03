import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Router } from '@angular/router';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { MyServerResponse } from '../../login/login.component';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { PaperJudgeDetail } from '../../admin/check-exam-paper-detail/check-exam-paper.component';


@Component({
  selector: 'app-check-exam-paper',
  templateUrl: './check-exam-paper.component.html',
  styleUrls: ['./check-exam-paper.component.css']
})

export class CheckExamPaperComponent implements OnInit {

  public get_paper_loading: boolean = false;
  public student_paper_info: PaperJudgeDetail = null;


  exam_id: number = 0;
  user_id: number = 0;

  //当前页
  public page_index_char: string = '';
  //考试名
  public exam_name: string = "考试信息获取中";
  student_score: string = "";
  total_score: string = "";
  //考试结束标志
  public exam_end: boolean = false;
  public autosave_interval = 60;
  //考试剩余时间
  public remain_seconds: number = 9999;
  public hour = 0;
  public min = 0;
  public sec = 0;

  //大题列表
  public categorys: Array<string> = ["数据结构", "计算机组成原理", "计算机网络", "数据库原理"];
  //当前所在的大题
  public current_category: number = 0;
  //当前选择的题目
  public current_question: number = 0;

  public emm: number = 0;

  //当前选中的单选项
  //  public radio_value: string = String.fromCharCode(0x41);
  //当前选中的多选项
  //  public checkbox_values: Array<boolean> = [];
  //控制选择框不同状态的背景色
  //  public option_bgcolor: Array<string> = [];
  public option_default_bgcolor: string = '#FFFFFF';
  //选项颜色
  //  public option_bdcolor: Array<string> = [];
  public option_default_bdcolor: string = '#d4d4d4';

  right_color: string = "rgba(160, 255, 160, 0.2)";
  wrong_color: string = "rgba(255, 160, 160, 0.2)";

  //简答题编辑器和内容
  public editor = ClassicEditor;
  public editor2 = ClassicEditor;
  public editor_data = '';
  public editor_config = {
    // 配置语言
    language: 'zh-cn',
    // 工具栏
    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo'],
  };
  confirm_modal: NzModalRef;
  @ViewChild('content_canvas', { static: false }) content_canvas_element_view: ElementRef;
  public canvas_height: number = 0;
  public elem_height_str: string = Math.ceil(document.documentElement.clientHeight * 0.68).toString() + 'px';


  ngAfterViewInit(): void {
    this.canvas_height = this.content_canvas_element_view.nativeElement.offsetHeight;
  }

  constructor(private router: Router, private message: NzMessageService,
    private http_client: HttpClient,private base_url: string, private modal: NzModalService) {
      this.base_url = sessionStorage.getItem('server_base_url');
    console.log(this.elem_height_str);
    this.exam_id = parseInt(sessionStorage.getItem('student_check_exam_id'));
    this.exam_name = sessionStorage.getItem('student_check_exam_name');
    this.student_score = sessionStorage.getItem('student_check_exam_student_score');
    this.total_score = sessionStorage.getItem('student_check_exam_total_score');
    this.user_id = parseInt(sessionStorage.getItem('userid'));
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
    let question = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question];
    let options = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question].options;
    if (question['radio_value'] == '' || question['radio_value'] == null) {
      question['option_bdcolor'].fill(this.option_default_bdcolor);
      question['option_bgcolor'].fill(this.option_default_bgcolor);
      return;
    }
    for (let i = 0; i < options.length; i++) {
      if (question['radio_value'].charCodeAt(0) == 0x41 + i) {
        if(question.student_point == question.score)
          question['option_bgcolor'][i] = this.right_color;
        else
          question['option_bgcolor'][i] = this.wrong_color;
        question['option_bdcolor'][i] = this.option_default_bdcolor;
      }
      else {
        question['option_bgcolor'][i] = this.option_default_bgcolor;
        question['option_bdcolor'][i] = this.option_default_bdcolor;
      }
    }
  }

  updateCheckboxStatus() {
    let question = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question];
    let options = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question].options;
    for (let i = 0; i < options.length; i++) {
      if (question['checkbox_values'][i] == true) {
        if(question.student_point == question.score)
          question['option_bgcolor'][i] = this.right_color;
        else
          question['option_bgcolor'][i] = this.wrong_color;
        question['option_bdcolor'][i] = this.option_default_bdcolor;
      }
      else {
        question['option_bgcolor'][i] = this.option_default_bgcolor;
        question['option_bdcolor'][i] = this.option_default_bdcolor;
      }
    }
  }


  limit() {
    if (this.editor_data.length > 20000) this.editor_data = this.editor_data.substring(0, 20000);
  }

  GetPaperInfo() {
    this.get_paper_loading = true;
    let exam_info = {
      exam_id: this.exam_id,
      stu_id: this.user_id
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'spi/stuans', exam_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '获取考生答题信息失败：' + response.msg);
          this.get_paper_loading = false;
        }
        else {
          this.student_paper_info = response.data;
          for (let i = 0; i < this.student_paper_info.categoryList.length; i++) {
            for (let j = 0; j < this.student_paper_info.categoryList[i].questionList.length; j++) {
              let question = this.student_paper_info.categoryList[i].questionList[j];
              question.options = JSON.parse(question.options);
              question.def_ans = JSON.parse(question.def_ans);
              if (question.student_answer == "" || question.student_answer == null)
                question.student_answer = []
              else
                question.student_answer = JSON.parse(question.student_answer);
              if (question.type == 'subjective') {
                if (question.student_answer.length > 0)
                  question['editor_value'] = question.student_answer[0].content;
                else
                  question['editor_value'] = '';
              }
              else {
                question['option_bgcolor'] = new Array<string>(question.options.length);
                question['option_bdcolor'] = new Array<string>(question.options.length);
                if (question.type == 'multi') {
                  question['checkbox_values'] = new Array<boolean>(question.options.length).fill(false);
                  for (let ans_obj of question.student_answer) {
                    question['checkbox_values'][ans_obj.id] = true;
                  }
                }
                else {
                  if (question.student_answer.length > 0)
                    question['radio_value'] = String.fromCharCode(question.student_answer[0].id + 0x41);
                  else
                    question['radio_value'] = '';
                }
              }
            }
          }
          this.message.create('success', '获取试卷信息成功');
          this.get_paper_loading = false;
          this.SwitchQuestion(0, 0);
        }
      }, error => {
        this.get_paper_loading = false;
        this.message.create('error', '获取考生答卷信息失败：连接服务器失败');
      });
  }

  SwitchQuestion(i: number, j: number) {
    this.current_category = i;
    this.current_question = j;
    let current_question_info = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question];
    if (current_question_info.type == 'multi') {
      this.updateCheckboxStatus();
    }
    else if (current_question_info.type != 'subjective') {
      this.updateRadioStatus();
    }
  }

  PrevQuestion() {
    if (this.current_question == 0) {
      if (this.current_category != 0) {
        this.current_category--;
        this.current_question = this.student_paper_info.categoryList[this.current_category].questionList.length - 1;
      }
    }
    else this.current_question--;
    let current_question_info = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question];
    if (current_question_info.type == 'multi') {
      this.updateCheckboxStatus();
    }
    else if (current_question_info.type != 'subjective') {
      this.updateRadioStatus();
    }
  }

  NextQuestion() {
    if (this.current_question == this.student_paper_info.categoryList[this.current_category].questionList.length - 1) {
      if (this.current_category != this.student_paper_info.categoryList.length - 1) {
        this.current_category++;
        this.current_question = 0;
      }
    }
    else this.current_question++;
    let current_question_info = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question];
    if (current_question_info.type == 'multi') {
      this.updateCheckboxStatus();
    }
    else if (current_question_info.type != 'subjective') {
      this.updateRadioStatus();
    }
  }

  GetDefAnsStr():Array<string> {
    let ans_strs:Array<string> = [];
    let cur_question = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question];
    for(var ans_obj of cur_question.def_ans) {
      ans_strs.push(String.fromCharCode(ans_obj.id + 0x41))
    }
    return ans_strs;
  }

}
