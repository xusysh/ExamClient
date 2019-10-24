import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs, NzFormatEmitEvent } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MyServerResponse } from '../../login/login.component';
import { QuestionInfo } from '../check-question/check-question.component';

@Component({
  selector: 'app-generate-paper',
  templateUrl: './generate-paper.component.html',
  styleUrls: ['./generate-paper.component.css']
})

export class GeneratePaperComponent implements OnInit {

  search_value = '';
  selected_values = null;

  knowledge: Array<object> = []
  knowledge_loading: boolean = true;

  all_filtered_questions: Array<QuestionInfo> = []
  all_filtered_questions_loading: boolean = true;

  categorys: Array<string> = new Array<string>();
  new_category_str: string = '';
  edit_category_flags:Array<boolean> = new Array<boolean>();


  category_to_questions = new Map<string, Array<PaperQuestionInfo>>();
  paper_question_scores: Array<string> = [];

  selected_questions = []

  nzEvent(event: NzFormatEmitEvent): void {
    //  console.log(event);
  }

  GetQuestionHead(question: object): string {
    switch (question['type']) {
      case 'single': return '[' + '单选题' + '] ' + question['content'];
      case 'multi': return '[' + '多选题' + '] ' + question['content'];
      case 'judge': return '[' + '判断题' + '] ' + question['content'];
      case 'subjective': return '[' + '主观题' + '] ' + question['content'];
      default: return '';
    }
  }

  @ViewChild('content_canvas', { static: false }) content_canvas_element_view: ElementRef;
  public canvas_height: number = 0;
  public elem_height_str: string = '500px';

  ngAfterViewInit(): void {
    this.canvas_height = this.content_canvas_element_view.nativeElement.offsetHeight;
    this.elem_height_str = Math.ceil(this.canvas_height * 0.85).toString() + 'px';
  }

  constructor(private http_client: HttpClient, @Inject('BASE_URL') private base_url: string,
    private message: NzMessageService) {
    this.GetKnowledge();
    this.GetAllQuestions();
  }

  ngOnInit(): void {
  }

  GetAnswerStr(question: QuestionInfo): string {
    if (question.type == 'subjective') return question.answer[0].content;
    var answers_info = '';
    var answers = question.answer;
    for (let i = 0; i < answers.length; i++) {
      answers_info += String.fromCharCode(answers[i].id + 0x41);
      answers_info += ',';
    }
    answers_info = answers_info.substring(0, answers_info.length - 1);
    return answers_info;
  }

  GetKnowledgeStr(question: QuestionInfo): string {
    if (question.knowledge.length == 0 || question.knowledge == null) return '无';
    let knowledge_str = '';
    for (let i = 0; i < question.knowledge.length; i++) {
      knowledge_str += question.knowledge[i];
      knowledge_str += ', ';
    }
    return knowledge_str.substring(0, knowledge_str.length - 2);
  }

  GetAllQuestions() {
    this.all_filtered_questions_loading = true;
    this.http_client.get<MyServerResponse>(this.base_url + 'question/all').subscribe(
      response => {
        this.all_filtered_questions = response.data;
        this.paper_question_scores = new Array<string>(this.all_filtered_questions.length);
        this.selected_values=new Array<string>(this.all_filtered_questions.length);
        for (let i = 0; i < this.all_filtered_questions.length; i++) {
          this.all_filtered_questions[i].options = JSON.parse(this.all_filtered_questions[i].options);
          this.all_filtered_questions[i].answer = JSON.parse(this.all_filtered_questions[i].answer);
        }
        this.all_filtered_questions_loading = false;
      },
      error => {
        this.message.create('error', '知识点信息获取失败：连接服务器失败');
      });
  }

  GetFilteredQuestions() {
    this.all_filtered_questions = []
    this.all_filtered_questions_loading = true;
    this.http_client.get<MyServerResponse>(this.base_url + 'question/all').subscribe(
      response => {
        this.all_filtered_questions = response.data;
        for (let i = 0; i < this.all_filtered_questions.length; i++) {
          this.all_filtered_questions[i].options = JSON.parse(this.all_filtered_questions[i].options);
          this.all_filtered_questions[i].answer = JSON.parse(this.all_filtered_questions[i].answer);
        }
        this.all_filtered_questions_loading = false;
      },
      error => {
        this.message.create('error', '知识点信息获取失败：连接服务器失败');
      });
    this.paper_question_scores = new Array<string>(this.all_filtered_questions.length);
    this.selected_values=new Array<string>(this.all_filtered_questions.length);
  }

  AddCategory() {
    if(this.new_category_str.trim()=='') {
      this.message.warning('请输入大题名称');
      return;
    }
    if (this.new_category_str in this.categorys) {
      this.message.warning('大题已存在');
      return;
    }
    this.categorys.push(this.new_category_str);
    this.edit_category_flags.push(false);
    this.new_category_str = '';
    this.message.success('添加成功');
  }

  GetOptionLabel(i: number): string {
    return String.fromCharCode(i + 0x41) + '. ';
  }

  GetKnowledge() {
    this.knowledge_loading = true;
    this.http_client.get<MyServerResponse>(this.base_url + 'keypoint/all').subscribe(
      response => {
        this.knowledge = response.data;
        this.knowledge_loading = false;
      },
      error => {
        this.message.create('error', '知识点信息获取失败：连接服务器失败');
      });
  }

  CategorySelectChanged(index:number) {
    var current_category = this.selected_values[index];
    if(current_category == '') return;
    if(this.paper_question_scores[index] == undefined) {
      this.message.warning('请设置题目分数');
      return;
    }
    let current_score = parseFloat(this.paper_question_scores[index]);
    if(Number.isNaN(current_score)) {
      this.message.warning('试题分数格式不合法');
      return;
    }
    var question = this.all_filtered_questions[index];
    let paper_question_info: PaperQuestionInfo = {
      type: question.type,
      score:current_score,
      description:question.description,
      content:question.content,
      must_or_not:0,
      category_content:current_category,
      option_list:question.options,
      answer_list:question.answer
    }
    if(this.category_to_questions.has(this.selected_values[index])) {
      this.category_to_questions.get(this.selected_values[index]).push(paper_question_info);
    }
    else {
      this.category_to_questions.set(this.selected_values[index],[paper_question_info])
    }
  }

  EditCateGoryDone(index:number) {
    this.edit_category_flags[index]=false;
  }

  GetCategoryTitle(index:number) {
    var category = this.categorys[index];
    if(!this.category_to_questions.has(category)) return category + '（0分）'
    let questions = this.category_to_questions.get(category);
    var sum:number = 0;
    for(let i=0;i<questions.length;i++) {
      sum = sum + questions[i].score;
    }
    return category + '（'+sum +'分）';
  }

  test(i) {
    console.log(this.categorys[i]);
  }

  CategoryNameChanged(old_val,new_val) {
    if(!this.category_to_questions.has(old_val)) return;
    this.category_to_questions.set(new_val,this.category_to_questions.get(old_val));
    this.category_to_questions.delete(old_val);
  }

}

interface PaperQuestionInfo {
  type: string,
  score: number,
  description: string,
  content: string,
  must_or_not: 0,
  category_content: string,
  option_list: Array<any>,
  answer_list: Array<any>
}