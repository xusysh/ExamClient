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
  selected_value = null;

  knowledge: Array<object> = []
  knowledge_loading: boolean = true;

  all_filtered_questions: Array<QuestionInfo> = []
  all_filtered_questions_loading: boolean = true;

  categorys = []
  new_category_str:string = '';

  category_to_questions = new Map<string,Array<PaperQuestionInfo>>();

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
  
  GetKnowledgeStr(question: QuestionInfo):string{
    if(question.knowledge.length==0 || question.knowledge==null) return '无';
    let knowledge_str = '';
    for(let i=0;i<question.knowledge.length;i++) {
      knowledge_str += question.knowledge[i];
      knowledge_str += ', ';
    }
    return knowledge_str.substring(0,knowledge_str.length-2);
  }

  GetAllQuestions() {
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
  }

  GetFilteredQuestions() {

  }

  AddCategory() {
    this.categorys.push(this.new_category_str)
    this.new_category_str = ''
    this.message.success('添加成功')
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

}

interface PaperQuestionInfo{

}