import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Router } from '@angular/router';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { MyServerResponse } from '../../login/login.component';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';


@Component({
  selector: 'app-check-exam-paper',
  templateUrl: './check-exam-paper.component.html',
  styleUrls: ['./check-exam-paper.component.css']
})

export class CheckExamPaperComponent implements OnInit {

  public get_paper_loading: boolean = false;
  public student_paper_info: ServerStudentPaperInfo = {
    paperCode: '',
    title: '',
    paperDescription: '',
    createTime: '',
    lastModifiedTime: '',
    createUserId: 0,
    categoryList: [],
    leftTime:0
  };

  //当前页
  public page_index_char: string = '';
  //考试名
  public exam_name: string = "考试信息获取中";
  //考试结束标志
  public exam_end:boolean = false;
  public autosave_interval = 60;
  //考试剩余时间
  public remain_seconds: number = 9999;
  public hour = 0;
  public min = 0;
  public sec =0;

  //大题列表
  public categorys: Array<string> = ["数据结构", "计算机组成原理", "计算机网络", "数据库原理"];
  //当前所在的大题
  public current_category: number = 0;
  //当前选择的题目
  public current_question: number = 0;

  public emm:number = 0;

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

  //简答题编辑器和内容
  public editor = ClassicEditor;
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
  public elem_height_str: string = '500px';

  ngAfterViewInit(): void {
    this.canvas_height = this.content_canvas_element_view.nativeElement.offsetHeight;
    this.elem_height_str = Math.ceil(this.canvas_height * 0.85).toString() + 'px';
  }

  constructor(private router: Router, private message: NzMessageService,
    private http_client: HttpClient, @Inject('BASE_URL') private base_url: string, private modal: NzModalService) {
    this.GetPaperInfo();
    const timer = interval(1000).subscribe(() => {
      if(this.remain_seconds > 0 && !this.exam_end) {
        if(this.remain_seconds % this.autosave_interval == 0) {
          this.SubmitAnswer(0);
        }
        this.remain_seconds--;
        this.min = Math.floor(this.remain_seconds / 3600);
        this.min = Math.floor(this.remain_seconds / 60);
        this.sec = this.remain_seconds % 60;
      }
      else {
        this.EndStudentExam();
        timer.unsubscribe();
      }
      });
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
        question['option_bdcolor'][i] = '#0099FF';
        question['option_bgcolor'][i] = this.option_default_bgcolor;
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
        question['option_bdcolor'][i] = '#0099FF';
        question['option_bgcolor'][i] = this.option_default_bgcolor;
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
          this.router.navigateByUrl("/student");
        }
        else {
          this.student_paper_info = response.data;
          this.exam_name = this.student_paper_info.title;
          this.remain_seconds = Math.round(this.student_paper_info.leftTime / 1000);
          for (let i = 0; i < this.student_paper_info.categoryList.length; i++) {
            for (let j = 0; j < this.student_paper_info.categoryList[i].questionList.length; j++) {
              let question = this.student_paper_info.categoryList[i].questionList[j];
              question.options = JSON.parse(question.options);
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
        this.message.create('error', '获取试卷信息失败：连接服务器失败');
        this.get_paper_loading = false;
      });
  }

  SwitchQuestion(i: number, j: number) {
    this.current_category = i;
    this.current_question = j;
    let current_question = this.student_paper_info.categoryList[this.current_category].questionList[this.current_question];
    if (current_question.type == 'multi') {
      this.updateCheckboxStatus();
    }
    else if (current_question.type != 'subjective') {
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
  }

  NextQuestion() {
    if (this.current_question == this.student_paper_info.categoryList[this.current_category].questionList.length - 1) {
      if (this.current_category != this.student_paper_info.categoryList.length - 1) {
        this.current_category++;
        this.current_question = 0;
      }
    }
    else this.current_question++;
  }

  ShowSubmitConfirm() {
    this.confirm_modal = this.modal.confirm({
      nzTitle: '是否提交考试答案?',
      nzContent: '',
      //todo:等待关闭
      nzOnOk: () => {
        this.EndStudentExam();
      }
    });
  }

  SubmitAnswer(end_flag: number) {
    var msg = '';
    if (end_flag == 0) msg = '自动保存';
    else msg = '提交';
    let user_question_answer_info = [];
    for (var category of this.student_paper_info.categoryList) {
      for (let question of category.questionList) {
        question.student_answer = []
        if (question.type == 'subjective') {
          question.student_answer.push({
            id: 0,
            content: question['editor_value']
          });
        }
        else {
          if (question.type == 'multi') {
            question.student_answer = [];
            for (let i = 0; i < question['checkbox_values'].length; i++) {
              if (question['checkbox_values'][i] == true) {
                question.student_answer.push({
                  id: i,
                  content: question.options[i]
                });
              }
            }
          }
          else {
            question.student_answer = [];
            let index = question['radio_value'].charCodeAt(0) - 0x41;
            question.student_answer.push({
              id: index,
              content: question.options[index]
            });
          }
        }
        let submit_question: QuestionUpdateInfo = {
          id: question.ques_id,
          content: question.content,
          type: question.type,
          description: question.description,
          total_point: question.score,
          stamp: question.stamp,
          mustOrNot: 0,
          student_answer: question.student_answer
        }
        user_question_answer_info.push(submit_question)
      }
    }
    let user_paper_answer_info: UserPaperAnswerInfo = {
      paper_code: sessionStorage.getItem('paper_code'),
      exam_id: sessionStorage.getItem('exam_id'),
      student_id: sessionStorage.getItem('userid'),
      end_flag: end_flag,
      paper_status: user_question_answer_info
    }
    this.http_client.post<MyServerResponse>(this.base_url + '/spi/do', user_paper_answer_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', msg + '试卷信息失败:' + response.msg);
          this.get_paper_loading = false;
        }
        else {
          this.message.create('success', msg + '试卷信息成功');
          this.get_paper_loading = false;
          if(end_flag == 1) {
            this.router.navigateByUrl("/student");
          }
        }
      }, error => {
        this.message.create('error', msg + '试卷信息失败：连接服务器失败');
        this.get_paper_loading = false;
      });

  }

  EndStudentExam() {
    this.SubmitAnswer(1);
    this.exam_end = true;
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
  leftTime:number
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
  mustOrNot: 0,
  stamp: number
}

interface QuestionUpdateInfo {
  id: number,
  content: string,
  type: string,
  description: string,
  total_point: number,
  stamp: number
  mustOrNot: number,
  student_answer: Array<AnswerInfo>
}

interface AnswerInfo {
  id: number,
  content: string
}

interface OptionInfo {
  id: number,
  content: string
}

interface UserPaperAnswerInfo {
  exam_id: string,
  paper_code: string,
  student_id: string,
  end_flag: number,
  paper_status: Array<QuestionUpdateInfo>
}
