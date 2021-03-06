import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs, NzFormatEmitEvent } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MyServerResponse } from '../../login/login.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-judge-paper',
  templateUrl: './judge-paper.component.html',
  styleUrls: ['./judge-paper.component.css']
})

export class JudgePaperComponent implements OnInit {

  public objective_grade: number = 0;

  public user_ans: string = "<h2><strong>管道：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且只存在于内存中。</li></ul><h2><strong>消息队列：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，<strong>并且只存在于内存中。</strong></li></ul><h2><strong>共享内存：</strong></h2><ul><li>共享内存是最快的一种 IPC，因为进程是直接对内存进行存取。</li><li>因为多个进程可以同时操作，所以需要进行同步。</li><li>信号量+共享内存通常结合在一起使用，信号量用来同步对共享内存的访问。</li></ul><p>&nbsp;</p>"

  search_value = '';
  selected_value = null;

  public current_student_index: number = 0;

  judge_exam_id: string;
  judge_student_id: string;

  all_student_judge_info: Array<StudentPaperJudgeInfo> = [];
  base_url: string;

  nzEvent(event: NzFormatEmitEvent): void {
    //  console.log(event);
  }

  @ViewChild('content_canvas', { static: false }) content_canvas_element_view: ElementRef;
  public canvas_height: number = 0;
  public elem_height_str: string = Math.ceil(document.documentElement.clientHeight * 0.68).toString() + 'px';

  ngAfterViewInit(): void {
    this.canvas_height = this.content_canvas_element_view.nativeElement.offsetHeight;
  }

  constructor(private http_client: HttpClient,
    private message: NzMessageService,private sanitizer: DomSanitizer) {
      this.base_url = sessionStorage.getItem('server_base_url');
  }

  ngOnInit() {
    this.judge_exam_id = sessionStorage.getItem('judge_exam_id');
    this.judge_student_id = sessionStorage.getItem('judge_student_id');
    this.GetStudentJudgePapers();
  }


  GetStudentJudgePapers() {
    let exam_info = {
      exam_id: this.judge_exam_id
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'spi/subanswers', exam_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '获取考生答题信息失败：' + response.msg);
        }
        else {
          this.all_student_judge_info = response.data;
          var i = 0;
          for(var student_answers_detail of this.all_student_judge_info[0].student_answers_detail) {
            if(student_answers_detail.student_id.toString() == this.judge_student_id)
              this.current_student_index = i;
            for(var subjective_answers of student_answers_detail.paper_status.subjective_answers) {
              subjective_answers.answer = JSON.parse(subjective_answers.answer);
              subjective_answers.student_answer = JSON.parse(subjective_answers.student_answer);
              if(subjective_answers.question_status == 0) {
                subjective_answers['point'] = '-1.0';
              }
              else {
                subjective_answers['point'] = subjective_answers.tech_point.toString();
              }
            }
            i++;
          }
          this.message.create('success', '获取考生答题信息成功');
        }
      }, error => {
        this.message.create('error', '获取考生答题信息失败：连接服务器失败');
      });
  }

  StudentAllJudged(index:number) {
    var student_answers_detail = this.all_student_judge_info[0].student_answers_detail[index];
    for(var subjective_answers of student_answers_detail.paper_status.subjective_answers) {
      if(subjective_answers['point'] == '-1.0')
        return false;
    }
    return true;
  }

  SubmitStudentGrade() {
    this.http_client.post<MyServerResponse>(this.base_url + 'spi/techsub', this.all_student_judge_info[0]).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '保存考生阅卷信息失败：' + response.msg);
        }
        else {
          this.message.create('success', '保存考生阅卷信息成功');
        }
      }, error => {
        this.message.create('error', '保存考生阅卷信息失败：连接服务器失败');
      });
  }

  GetRichHtml(html:string):SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


}

interface StudentPaperJudgeInfo {
  exam_id: number,
  paper_code: string,
  student_answers_detail: Array<StudentAnswerDetail>
}

interface StudentAnswerDetail {
  student_id: number
  student_name: string,
  paper_status: PaperStatus,
}

interface PaperStatus {
  objective_grade: 0,
  subjective_answers: Array<SubjectiveAnswer>
}

interface SubjectiveAnswer {
  answer: any,
  student_answer: any,
  question_status: number,
  id: number,
  tech_point: number,
  total_point: number,
  content: string
}

interface AnswerInfo {
  id: number,
  content: string
}