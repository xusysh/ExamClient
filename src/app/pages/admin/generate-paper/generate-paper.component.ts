import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs, NzFormatEmitEvent, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MyServerResponse } from '../../login/login.component';
import { QuestionInfo } from '../check-question/check-question.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { summaryFileName } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-generate-paper',
  templateUrl: './generate-paper.component.html',
  styleUrls: ['./generate-paper.component.css']
})

export class GeneratePaperComponent implements OnInit {

  search_value = '';
  selected_values = null;

  exam_name: string = '点击此处修改考试名称';
  total_points: number = 0;

  knowledge: Array<object> = []
  knowledge_loading: boolean = true;

  all_filtered_questions: Array<QuestionInfo> = []
  all_filtered_questions_loading: boolean = true;

  categorys: Array<string> = new Array<string>();
  new_category_str: string = '';
  edit_category_flags: Array<boolean> = new Array<boolean>();

  category_to_questions = new Map<string, Array<PaperQuestionInfo>>();
  paper_question_scores: Array<string> = [];

  selected_questions = []
  confirm_modal: NzModalRef;
  submit_loading: boolean = false;

  ques_types = [
    { label: '单选题', value: 'single' },
    { label: '不定项选择题', value: 'multi' },
    { label: '判断题', value: 'judge' },
    { label: '简答题', value: 'subjective' }
  ];

  ques_name_filter: Array<string> = []
  ques_type_filter: Array<string> = []
  ques_knowledge_filter: Array<string> = []
  new_ques_name_filter_item_str: string = ''

  nzEvent(event: NzFormatEmitEvent): void {
    //  console.log(event);
  }

  GetQuestionHead(question: object): string {
    switch (question['type']) {
      case 'single': return '[' + '单选题' + '] ' + question['content'];
      case 'multi': return '[' + '不定项选择题' + '] ' + question['content'];
      case 'judge': return '[' + '判断题' + '] ' + question['content'];
      case 'subjective': return '[' + '简答题' + '] ' + question['content'];
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
    private message: NzMessageService, private modal: NzModalService) {
    this.GetKnowledge();
    this.GetAllQuestions();
    var cur_paper_code = sessionStorage.getItem('paper_code')
    if (cur_paper_code != null) {
      let paper_req = {
        paper_code: cur_paper_code
      }
      this.http_client.post<MyServerResponse>(this.base_url + 'paper/single', paper_req).subscribe(
        response => {
          if (response.status != 200) {
            this.message.create('error', '试卷信息获取失败：' + response.msg);
            return;
          }
          let paper_info: ServerPaperInfo = response.data;
          this.exam_name = paper_info.title;
          this.categorys = []
          for (let i = 0; i < paper_info.categoryList.length; i++) {
            let category_name = paper_info.categoryList[i].categoryContent;
            let category_question_list = paper_info.categoryList[i].questionList;
            this.categorys.push(category_name);
            let question_list: Array<PaperQuestionInfo> = []
            for (let i = 0; i < category_question_list.length; i++) {
              let question: PaperQuestionInfo = {
                id: category_question_list[i].ques_id,
                type: category_question_list[i].type,
                score: category_question_list[i].score,
                description: category_question_list[i].description,
                content: category_question_list[i].content,
                must_or_not: 0,
                category_content: category_name,
                option_list: JSON.parse(category_question_list[i].options),
                answer_list: JSON.parse(category_question_list[i].defAnswer)
              }
              question_list.push(question)
            }
            this.category_to_questions.set(category_name, question_list)
          }
          this.message.create('success', '试卷信息获取成功');
        },
        error => {
          this.message.create('error', '试卷信息获取失败：连接服务器失败');
        });
    }
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
        if (this.all_filtered_questions == null || this.all_filtered_questions == undefined)
          this.all_filtered_questions = [];
        this.paper_question_scores = new Array<string>(this.all_filtered_questions.length);
        this.selected_values = new Array<string>(this.all_filtered_questions.length);
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
    let filter: QuestionFilter = {
      ques_knowledge_filter: this.ques_knowledge_filter,
      ques_name_filter: this.ques_name_filter,
      ques_type_filter: this.ques_type_filter
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'question/filter', filter).subscribe(
      response => {
        this.all_filtered_questions = response.data;
        if (this.all_filtered_questions == null || this.all_filtered_questions == undefined)
          this.all_filtered_questions = []
        this.paper_question_scores = new Array<string>(this.all_filtered_questions.length);
        this.selected_values = new Array<string>(this.all_filtered_questions.length);
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
    this.selected_values = new Array<string>(this.all_filtered_questions.length);
  }

  AddCategory() {
    if (this.new_category_str.trim() == '') {
      this.message.warning('请输入大题名称');
      return;
    }
    if (this.categorys.indexOf(this.new_category_str) != -1) {
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

  CategorySelectChanged(index: number) {
    var current_category = this.selected_values[index];
    if (current_category == '') return;
    if (this.paper_question_scores[index] == undefined) {
      this.message.warning('请设置题目分数');
      return;
    }
    let current_score = parseFloat(this.paper_question_scores[index]);
    if (Number.isNaN(current_score)) {
      this.message.warning('试题分数格式不合法');
      return;
    }
    var question = this.all_filtered_questions[index];
    let paper_question_info: PaperQuestionInfo = {
      id: question.id,
      type: question.type,
      score: current_score,
      description: question.description,
      content: question.content,
      must_or_not: 0,
      category_content: current_category,
      option_list: question.options,
      answer_list: question.answer
    }
    if (this.category_to_questions.has(this.selected_values[index])) {
      this.category_to_questions.get(this.selected_values[index]).push(paper_question_info);
    }
    else {
      this.category_to_questions.set(this.selected_values[index], [paper_question_info])
    }
  }

  EditCateGoryDone(index: number) {
    this.edit_category_flags[index] = false;
  }

  GetCategoryTitle(index: number) {
    var category = this.categorys[index];
    if (!this.category_to_questions.has(category)) return category + '（0分）'
    let questions = this.category_to_questions.get(category);
    var sum: number = 0;
    for (let i = 0; i < questions.length; i++) {
      sum = sum + questions[i].score;
    }
    return category + '（' + sum + '分）';
  }

  GetExamTitle() {
    var sum: number = 0;
    if (this.categorys == undefined) return this.exam_name + '（0分）';
    for (let i = 0; i < this.categorys.length; i++) {
      if (this.category_to_questions.has(this.categorys[i])) {
        let questions = this.category_to_questions.get(this.categorys[i]);
        for (let j = 0; j < questions.length; j++) {
          sum = sum + questions[j].score;
        }
      }
    }
    this.total_points = sum;
    return this.exam_name + '（' + this.total_points + '分）';
  }

  test(i) {
    console.log(this.categorys[i]);
  }

  CategoryNameChanged(old_val, new_val) {
    if (!this.category_to_questions.has(old_val)) return;
    this.category_to_questions.set(new_val, this.category_to_questions.get(old_val));
    this.category_to_questions.delete(old_val);
  }

  drop(list: Array<any>, event: CdkDragDrop<string[]>) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }

  ShowSubmitConfirm() {
    this.confirm_modal = this.modal.confirm({
      nzTitle: '是否提交试卷?',
      nzContent: this.exam_name + '（' + this.total_points + '分）',
      //todo:管理员用户id
      //todo:等待关闭
      nzOnOk: () => {
        /*
                new Promise((resolve, reject) => {
                  
                }).catch(() => console.log('Oops errors!'))
            */
        let all_question_list: Array<PaperQuestionInfo> = []
        for (let i = 0; i < this.categorys.length; i++) {
          let question_list = this.category_to_questions.get(this.categorys[i]);
          all_question_list.push(...question_list);
        }
        let new_paper_info: PaperInfo = {
          title: this.exam_name,
          description: '',
          paper_code: '',
          user_id: 1,
          question_list: all_question_list
        }
        this.http_client.post<MyServerResponse>(this.base_url + "paper/new", new_paper_info).
          subscribe(response => {
            if (response.status == 200) {
              this.message.create('success', '添加试卷成功');
            }
            else {
              this.message.create('error', '添加试卷失败:' + response.msg);
            }
          }, error => {
            this.message.create('error', '添加试卷失败：连接服务器失败');
          });
      }
    });
  }

  AddQuesNameFilterItem() {
    if (this.ques_name_filter.indexOf(this.new_ques_name_filter_item_str) == -1)
      this.ques_name_filter.push(this.new_ques_name_filter_item_str);
    this.new_ques_name_filter_item_str = '';
    this.GetFilteredQuestions();
  }

  QuesTypeFilterChange(type: string, checked: any) {
    if (checked) {
      if (this.ques_type_filter.indexOf(type) == -1)
        this.ques_type_filter.push(type);
    }
    else {
      let index = this.ques_type_filter.indexOf(type);
      if (index != -1)
        this.ques_type_filter.splice(index, 1);
    }
    this.GetFilteredQuestions();
  }

  AddQuesKnowledgeFilterItem(event: any) {
    let knowledge = event.node['_title'];
    if (this.ques_knowledge_filter.indexOf(knowledge) == -1)
      this.ques_knowledge_filter.push(knowledge);
    this.GetFilteredQuestions();
  }

}

interface PaperQuestionInfo {
  id: number,
  type: string,
  score: number,
  description: string,
  content: string,
  must_or_not: 0,
  category_content: string,
  option_list: Array<any>,
  answer_list: Array<any>
}

interface PaperInfo {
  title: string,
  description: string,
  paper_code: string,
  user_id: 1,
  question_list: Array<PaperQuestionInfo>
}

interface QuestionFilter {
  ques_name_filter: Array<string>,
  ques_knowledge_filter: Array<string>,
  ques_type_filter: Array<string>
}

interface ServerPaperInfo {
  paperCode: string,
  title: string,
  paperDescription: string,
  createTime: string,
  lastModifiedTime: string,
  createUserId: number,
  categoryList: Array<ServerPaperCategoryInfo>
}

interface ServerPaperCategoryInfo {
  paperCode: string,
  categoryContent: string,
  questionList: Array<ServerPaperQuestionInfo>
}

interface ServerPaperQuestionInfo {
  ques_id: number,
  score: number,
  type: string,
  content: string,
  description: string,
  mustOrNot: number,
  options: any,
  defAnswer: any,
  knowledge: Array<string>
}