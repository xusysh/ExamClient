import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs, NzFormatEmitEvent } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MyServerResponse } from '../../login/login.component';

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

  questions = [
    {
      'student_answer': "<h2><strong>管道：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且只存在于内存中。</li></ul><h2><strong>消息队列：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，<strong>并且只存在于内存中。</strong></li></ul>",
      'answer': ["<h2><strong>管道：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且只存在于内存中。</li></ul><h2><strong>消息队列：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，<strong>并且只存在于内存中。</strong></li></ul><h2><strong>共享内存：</strong></h2><ul><li>共享内存是最快的一种 IPC，因为进程是直接对内存进行存取。</li><li>因为多个进程可以同时操作，所以需要进行同步。</li><li>信号量+共享内存通常结合在一起使用，信号量用来同步对共享内存的访问。</li></ul><p>&nbsp;</p>"],
      'content': '请简述Linux操作系统中进程通信的方式',
      'description': '追加描述',
      'options': [],
      'total_point': 10
    }
  ]

  student_answers = {
    "paper_code": 12345,
    "student_answers_detail": [
      {
        "student_id": 1,
        "student_name": '郭靖与',
        "paper_status": {
          "objective_grade": 60,
          "subjective_answers": [
            {
              "id": 6,
              "content": "简答题1",
              "description": "简答题1追加描述",
              "total_point": 10,      //题目满分的分数
              'answer': "<h2><strong>管道：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且只存在于内存中。</li></ul><h2><strong>消息队列：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，<strong>并且只存在于内存中。</strong></li></ul><h2><strong>共享内存：</strong></h2><ul><li>共享内存是最快的一种 IPC，因为进程是直接对内存进行存取。</li><li>因为多个进程可以同时操作，所以需要进行同步。</li><li>信号量+共享内存通常结合在一起使用，信号量用来同步对共享内存的访问。</li></ul><p>&nbsp;</p>",
              'student_answer': "<h2><strong>管道：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且只存在于内存中。</li></ul><h2><strong>消息队列：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，<strong>并且只存在于内存中。</strong></li></ul>"
            },
            {
              "id": 7,
              "content": "简答题2",
              "description": "简答题2追加描述",
              "total_point": 10,      //题目满分的分数
              "answer": "参考答案2",
              "student_answer": "学生1填写的答案"
            }
          ]
        }
      },
      {
        "student_id": 2,
        "student_name": '王涛',
        "paper_status": {
          "objective_grade": 66,
          "subjective_answers": [
            {
              "id": 6,
              "content": "简答题1",
              "description": "简答题1追加描述",
              "total_point": 10,      //题目满分的分数
              'answer': "<h2><strong>管道123：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且只存在于内存中。</li></ul><h2><strong>消息队列：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，<strong>并且只存在于内存中。</strong></li></ul><h2><strong>共享内存：</strong></h2><ul><li>共享内存是最快的一种 IPC，因为进程是直接对内存进行存取。</li><li>因为多个进程可以同时操作，所以需要进行同步。</li><li>信号量+共享内存通常结合在一起使用，信号量用来同步对共享内存的访问。</li></ul><p>&nbsp;</p>",
              'student_answer': "<h2><strong>管道：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且只存在于内存中。</li></ul><h2><strong>消息队列：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，<strong>并且只存在于内存中。</strong></li></ul>"
            },
            {
              "id": 7,
              "content": "简答题2",
              "description": "简答题2追加描述",
              "total_point": 10,      //题目满分的分数
              "answer": "参考答案2",
              "student_answer": "学生2填写的答案"
            }
          ]
        }
      }
    ]
  }

  public current_student_index: number = 0;

  judge_exam_id: number;
  judge_student_id: number;

  all_student_judge_info: StudentPaperJudgeInfo = null;

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
    private message: NzMessageService) {
    for (let i = 0; i < this.questions.length; i++) {
      this.questions[i]['point'] = '0';
    }
  }

  ngOnInit() {
    this.judge_exam_id = parseInt(sessionStorage.getItem('judge_exam_id'));
    this.judge_student_id = parseInt(sessionStorage.getItem('judge_student_id'));
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
          for(var student_answers_detail of this.all_student_judge_info.student_answers_detail) {
            for(var subjective_answers of student_answers_detail.paper_status.subjective_answers) {
              subjective_answers.answer = JSON.parse(subjective_answers.answer);
              subjective_answers.student_answer = JSON.parse(subjective_answers.student_answer);
            }
          }
          this.message.create('success', '获取考生答题信息成功');
        }
      }, error => {
        this.message.create('error', '获取考生答题信息失败：连接服务器失败');
      });
  }

  SubmitStudentGrade() {

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
  question_status: 0,
  id: number,
  total_point: number,
  content: string
}

interface AnswerInfo {
  id: number,
  content: string
}