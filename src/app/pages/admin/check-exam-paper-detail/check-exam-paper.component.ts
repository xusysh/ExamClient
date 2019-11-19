import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs, NzFormatEmitEvent } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MyServerResponse } from '../../login/login.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StudentPaperBaseInfo } from '../check-exam/check-exam.component';

@Component({
  selector: 'app-check-exam-paper',
  templateUrl: './check-exam-paper.component.html',
  styleUrls: ['./check-exam-paper.component.css']
})

export class CheckExamPaperComponent implements OnInit {

  public objective_grade: number = 0;

  public user_ans: string = "<h2><strong>管道：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且只存在于内存中。</li></ul><h2><strong>消息队列：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，<strong>并且只存在于内存中。</strong></li></ul><h2><strong>共享内存：</strong></h2><ul><li>共享内存是最快的一种 IPC，因为进程是直接对内存进行存取。</li><li>因为多个进程可以同时操作，所以需要进行同步。</li><li>信号量+共享内存通常结合在一起使用，信号量用来同步对共享内存的访问。</li></ul><p>&nbsp;</p>"

  search_value = '';
  selected_value = null;

  public current_student_index: number = 0;

  judge_exam_id: number;
  judge_student_id: number;

  all_student_judge_info: Array<StudentPaperBaseInfo> = [];

  student_paper_judge_detail:PaperJudgeDetail = null;

  right_color:string = "rgba(160, 255, 160, 0.3)";
  wrong_color:string = "rgba(255, 160, 160, 0.3)";
  not_completely_right_or_wrong_color:string = "rgba(160, 160, 255, 0.3)";

  nzEvent(event: NzFormatEmitEvent): void {
    //  console.log(event);
  }

  @ViewChild('content_canvas', { static: false }) content_canvas_element_view: ElementRef;
  public canvas_height: number = 0;
  public elem_height_str: string = '500px';

  ngAfterViewInit(): void {
    this.canvas_height = this.content_canvas_element_view.nativeElement.offsetHeight;
    this.elem_height_str = Math.ceil(this.canvas_height * 0.85).toString() + 'px';
  }

  constructor(private http_client: HttpClient, @Inject('BASE_URL') private base_url: string,
    private message: NzMessageService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.judge_exam_id = parseInt(sessionStorage.getItem('judge_exam_id'));
    this.judge_student_id = parseInt(sessionStorage.getItem('judge_student_id'));
    this.all_student_judge_info = JSON.parse(sessionStorage.getItem('all_student_judge_info'));
    this.GetStudentJudgePapers();
  }


  GetStudentJudgePapers() {
    let exam_info = {
      exam_id: this.judge_exam_id,
      stu_id: this.all_student_judge_info[this.current_student_index].studentId
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'spi/stuans', exam_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '获取考生答题信息失败：' + response.msg);
        }
        else {
          this.student_paper_judge_detail = response.data;
          for(var category of this.student_paper_judge_detail.categoryList) {
            for(var question of category.questionList) {
              question.options = JSON.parse(question.options);
              question.def_ans = JSON.parse(question.def_ans);
              question.student_answer = JSON.parse(question.student_answer);
            }
          }
          this.message.create('success', '获取考生答题信息成功');
        }
      }, error => {
        this.message.create('error', '获取考生答题信息失败：连接服务器失败');
      });
  }

  SwitchStudent(index:number) {
    this.current_student_index = index;
  }

  GetRichHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  GetCategoryTitle(i:number,title:string) {
    return this.NumToRoman(i+1) + '. ' + title;
  }
  
  GetObjectiveAnswer(answer:Array<AnswerInfo>):Array<string> {
    let ans_str:Array<string> = [];
    for(let ans of answer) {
      ans_str.push(String.fromCharCode(ans.id + 0x41));
    }
    return ans_str;
  }

  GetOptionStr(option:OptionInfo):string {
    return String.fromCharCode(option.id + 0x41) + '. ' + option.content;
  }

  NumToRoman(num):string {
    var ans = "";
    var k = Math.floor(num / 1000);
    var h = Math.floor((num % 1000) / 100);
    var t = Math.floor((num % 100) / 10);
    var o = num % 10;
    var one = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    var ten = ['X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
    var hundred = ['C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM']
    var thousand = 'M';
    for (var i = 0; i < k; i++) {
        ans += thousand;
    }
    if (h)
        ans += hundred[h - 1];
    if (t)
        ans += ten[t - 1];
    if (o)
        ans += one[o - 1];
    return ans;
}

GetQuestionColor(question:QuestionInfo) {
  if(question.score == question.student_point)
    return this.right_color;
  else if(question.student_point == 0)
    return this.wrong_color;
  else 
    return this.not_completely_right_or_wrong_color;
}

}

interface PaperJudgeDetail {
  paperCode: string,
  title: string,
  paperDescription: string,
  createTime: string,
  lastModifiedTime: string,
  createUserId: number,
  objectiveGrade: number,
  objectiveStatus: number,
  subjectiveGrade: number,
  subjectiveStatus: number,
  paperTotalPoint: number,
  studentTotalPoint: number,
  endFlag: number,
  categoryList: Array<CategoryInfo>
}


interface CategoryInfo {
  paperCode: string,
  categoryContent: string,
  questionList: Array<QuestionInfo>
}

interface QuestionInfo {
  ques_id: 29,
  content: string,
  description: string,
  type: string,
  score: number,
  options: any,
  student_answer: any,
  def_ans: any,
  student_point: number,
}

//old
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

interface OptionInfo {
  id:number,
  content:string
}