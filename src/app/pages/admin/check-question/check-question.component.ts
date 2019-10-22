import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { forkJoin, from } from 'rxjs';
import { MyServerResponse } from '../../login/login.component'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'

@Component({
  selector: 'app-check-question',
  templateUrl: './check-question.component.html',
  styleUrls: ['./check-question.component.css']
})

export class CheckQuestionComponent implements OnInit {

  public page_index: number = 1;
  public page_size: number = 5;
  public listOfData: Array<object> = [];
  public loading: boolean = true;
  public sortValue: string | null = null;
  public sortKey: string | null = null;
  public searchGenderList: string[] = [];
  public is_downloading_template = false;
  public question_info_list: Array<QuestionInfo> = [];

  public drawer_visible: boolean = false;
  public dialog_visible: boolean = false;
  public dialog_ok_loading: boolean = false;
  public is_allDisplay_data_checked = false;
  public is_indeterminate = false;

  public edit_question_id: number = 0;
  public edit_question_type: string = '';
  public edit_question_content: string = '';
  public edit_question_description: string = '';
  public edit_question_options: Array<object> = [];
  public edit_question_answer: Array<any> = [];
  public edit_question_knowledge: Array<string> = [];

  public user_group_tags = [];
  public inputVisible = false;
  public inputValue = '';
  public edit_question_info_loading = false;

  public current_select_question: number = 0;
  public all_knowledge_info: Array<object> = [];
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);
  //简答题编辑器和内容
  public editor = ClassicEditor;
  public editor_config = {
    // 配置语言
    language: 'zh-cn',
    // 工具栏
    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo']
  };

  //假数据
  public users_group_list = [['产品开发科', '招投标项目组', '考试系统小组'], ['需求分析科'], ['产品开发科', '人工智能小组'],
  ['鑫源融信公司', '招投标项目组'], ['运营支持科', '考试系统小组', '微服务小组']];

  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  constructor(private table_update_service: TableUpdateService, private http_client: HttpClient,
    @Inject('BASE_URL') private base_url: string, private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.UpdateTableData();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.UpdateTableData();
  }

  UpdateTableData(reset: boolean = false): void {
    if (reset) {
      this.page_index = 1;
    }
    this.loading = true;
    this.http_client.get<MyServerResponse>(this.base_url + 'question/all').subscribe(
      response => {
        this.question_info_list = response.data;
        for (let i = 0; i < this.question_info_list.length; i++) {
          this.question_info_list[i].options = JSON.parse(this.question_info_list[i].options);
          this.question_info_list[i].answer = JSON.parse(this.question_info_list[i].answer);
        }
        this.loading = false;
      },
      error => {
        this.message.create('error', '用户信息获取失败：连接服务器失败');
        this.loading = false;
      });
  }

  GetOptionLabel(i: number): string {
    return String.fromCharCode(i + 0x41) + '. ';
  }

  GetTypeStr(index: number): string {
    let current_question = (this.page_index - 1) * this.page_size + index;
    let type = this.question_info_list[current_question].type;
    switch (type) {
      case 'single': return '单选题';
      case 'multi': return '不定项选择题';
      case 'judge': return '判断题';
      case 'subjective': return '简答题';
      default: break;
    }
  }

  GetAnswer(index: number): string {
    let current_question = (this.page_index - 1) * this.page_size + index;
    if (this.question_info_list[current_question].type == 'subjective') return '鼠标悬浮查看详情';
    var answers_info = '';
    var answers = this.question_info_list[current_question].answer;
    for (let i = 0; i < answers.length; i++) {
      answers_info += String.fromCharCode(answers[i].id + 0x41);
      answers_info += ',';
    }
    answers_info = answers_info.substring(0, answers_info.length - 1);
    return answers_info;
  }

  updateFilter(value: string[]): void {
    this.searchGenderList = value;
    this.UpdateTableData(true);
  }

  //todo：拷贝对象
  CheckQuestionInfo(index: number): void {
    this.current_select_question = (this.page_index - 1) * this.page_size + index;
    this.edit_question_id = this.question_info_list[this.current_select_question].id;
    this.edit_question_type = this.question_info_list[this.current_select_question].type;
    this.edit_question_content = this.question_info_list[this.current_select_question].content;
    this.edit_question_description = this.question_info_list[this.current_select_question].description;
    this.edit_question_options = this.question_info_list[this.current_select_question].options;
    this.edit_question_answer = this.question_info_list[this.current_select_question].answer;
    this.edit_question_knowledge = this.question_info_list[this.current_select_question].knowledge;
    this.drawer_visible = true;
    this.UpdateKnowledgeInfo();
  }

  test() {
    console.log(this.edit_question_answer);
  }

  UpdateKnowledgeInfo() {
    this.all_knowledge_info = []
    this.http_client.get<MyServerResponse>(this.base_url + 'keypoint/all').subscribe(
      response => {
        this.all_knowledge_info = response.data;
      },
      error => {
        this.message.create('error', '知识点信息获取失败：连接服务器失败');
      });
  }

  AddEditOption() {
    let option:Option={
      id:this.edit_question_options.length,
      content:''
    }
    this.edit_question_options.push(option);
  }

  EditUserInfo(): void {
    this.edit_question_info_loading = true;
    this.edit_question_id = this.question_info_list[this.current_select_question].id;
    let question_edit_info: QuestionInfo = {
      id: this.edit_question_id,
      type: this.edit_question_type,
      content: this.edit_question_content,
      description: this.edit_question_description,
      options: this.edit_question_options,
      answer: this.edit_question_answer,
      knowledge:this.edit_question_knowledge
    }
    this.http_client.post<MyServerResponse>(this.base_url + '/upi/usergroup/relation', question_edit_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '试题编辑失败:' + response.msg);
        }
        else {
          this.message.create('success', '试题 ' + this.edit_question_content + ' 编辑成功');
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '试题编辑失败：连接服务器失败');
      });
    this.edit_question_info_loading = false;
    this.drawer_visible = false;
  }

  //删除单个试题
  DeleteUser(index: number): void {
    this.current_select_question = (this.page_index - 1) * this.page_size + index;
    let question_delete_info = {
      id: [this.question_info_list[this.current_select_question].id]
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: question_delete_info
    };
    this.http_client.delete<MyServerResponse>(this.base_url + 'upi/user/multi', httpOptions).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '用户删除失败:' + response.msg);
        }
        else {
          //    this.message.create('success', '用户 ' + this.question_info_list[this.current_select_user].userName + ' 删除成功');
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '用户删除失败：连接服务器失败');
      });
    this.drawer_visible = false;
  }

  AddStudentInfo(): void {
    this.edit_question_id = 0;
    this.edit_question_type = 'single'
    this.edit_question_content = '';
    this.edit_question_description = '';
    this.edit_question_options = [];
    this.edit_question_answer = [];
    this.drawer_visible = true;
  }

  DrawerClose(): void {
    this.drawer_visible = false;
  }

  DialogOKHandle(): void {
    this.dialog_ok_loading = true;
    this.UpdateTableData();
    setTimeout(() => {
      this.dialog_visible = false;
      this.dialog_ok_loading = false;
    }, 2000);
  }

  DialogCancelHandle(): void {
    this.dialog_visible = false;
  }

  refreshStatus(): void {
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.user_group_tags.indexOf(this.inputValue) === -1) {
      this.user_group_tags = [...this.user_group_tags, this.inputValue];
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

  DownloadTemplate(): void {
    this.is_downloading_template = true;
    this.http_client.post(this.base_url + 'upi/user/template', null, {
      responseType: 'arraybuffer'
    }
    ).subscribe(response => this.DownloadFile(response, "application/ms-excel"),
      error => {
        this.message.create('error', '文件下载失败：连接服务器失败');
        this.is_downloading_template = false;
      });
  }

  DownloadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = "导入模板.xls";
    anchor.href = url;
    anchor.click();
    this.message.create('success', '文件下载成功');
    this.is_downloading_template = false;
  }

  customReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    formData.set('files[]', item.file as any, 'files[]');
    const req = new HttpRequest('POST', item.action!, formData, {
      reportProgress: true,
      withCredentials: true
    });
    return this.http_client.request(req).subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total! > 0) {
            (event as any).percent = (event.loaded / event.total!) * 100;
          }
          item.onProgress!(event, item.file!);
        } else if (event instanceof HttpResponse) {
          item.onSuccess!(event.body, item.file!, event);
        }
      },
      err => {
        item.onError!(err, item.file!);
      }
    );
  };

  customBigReq = (item: UploadXHRArgs) => {
    const size = item.file.size;
    const chunkSize = parseInt(size / 3 + '', 10);
    const maxChunk = Math.ceil(size / chunkSize);
    const reqs = Array(maxChunk)
      .fill(0)
      .map((_: {}, index: number) => {
        const start = index * chunkSize;
        let end = start + chunkSize;
        if (size - end < 0) {
          end = size;
        }
        const formData = new FormData();
        formData.append('file', item.file.slice(start, end));
        formData.append('start', start.toString());
        formData.append('end', end.toString());
        formData.append('index', index.toString());
        const req = new HttpRequest('POST', item.action!, formData, {
          withCredentials: true
        });
        return this.http_client.request(req);
      });
    return forkJoin(...reqs).subscribe(
      () => {
        item.onSuccess!({}, item.file!, event);
      },
      err => {
        item.onError!(err, item.file!);
      }
    );
  };

  
  limit() {
    if (this.edit_question_answer[0].content.length > 20000) 
      this.edit_question_answer[0].content = this.edit_question_answer[0].content.substring(0, 20000);
  }

}

export interface QuestionInfo {
  id: number,
  content: string,
  type: string,
  description: string,
  knowledge:Array<string>,
  answer: any,
  options: any
}

interface Option {
  id: number,
  content: string
}

interface Answer {
  id: number,
  content: string
}
