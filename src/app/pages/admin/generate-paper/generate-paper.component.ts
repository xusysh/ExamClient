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

  selected_questions = [
    {
      'field_name': '数据结构',
      'questions': [
        {
          'type': 'multi',
          'answer': ['A', 'B'],
          'content': '时间复杂度为O(nlog2n)的排序算法有（          ）',
          'description': '',
          'options': ['A.快速排序', 'B.堆排序', 'C.冒泡排序', 'D.折半插入排序']
        },
        {
          'type': 'multi',
          'answer': ['B', 'C'],
          'content': '若入栈序列为A B C D E F，且进栈和出栈可以穿插进行，则不可能的输出序列为',
          'description': '',
          'options': ['']
        },
        {
          'type': 'single',
          'answer': ['B'],
          'content': '若某表最常用的操作是在最后一个结点之后插入一个节点或删除最后一二个结点，则采用（）省运算时间。',
          'description': '',
          'options': ['']
        },
        {
          'type': 'multi',
          'answer': ['A', 'B'],
          'content': '时间复杂度为O(nlog2n)的排序算法有（          ）',
          'description': '',
          'options': ['A.快速排序', 'B.堆排序', 'C.冒泡排序', 'D.折半插入排序']
        },
        {
          'type': 'single',
          'answer': ['C'],
          'content': '对于int *pa[5] ;的描述，正确的是（    ）',
          'description': '',
          'options': [
            "A.pa是一个指向数组的指针，所指向的数组是5个int型元素",
            "B.pa是一个指向某个数组第5个元素的指针，该元素是int型变量",
            "C.pa[5]表示某个数组第5个元素的值",
            "D.pa是一个具有5个元素的指针数组，每个元素是一个int型指针"
          ]
        },
        {
          'type': 'subjective',
          'answer': ["<h2><strong>管道：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且只存在于内存中。</li></ul><h2><strong>消息队列：</strong></h2><ul><li>它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端。</li><li>它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）。</li><li>它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，<strong>并且只存在于内存中。</strong></li></ul><h2><strong>共享内存：</strong></h2><ul><li>共享内存是最快的一种 IPC，因为进程是直接对内存进行存取。</li><li>因为多个进程可以同时操作，所以需要进行同步。</li><li>信号量+共享内存通常结合在一起使用，信号量用来同步对共享内存的访问。</li></ul><p>&nbsp;</p>"],
          'content': '请简述Linux中进程通信的方式',
          'description': '',
          'options': []
        }
      ]
    },
    {
      'field_name': '计算机组成原理',
      'questions': [
        {
          'type': 'single',
          'answer': ['A'],
          'content': '下列关于RISC的叙述中，错误的是（）。',
          'description': '',
          'options': [
            'A.RISC普遍采用微程序控制器',
            'B.RISC大多数指令在一个时钟周期内完成',
            'C.RISC的内部通用寄存器数量相对CISC多',
            'D.RISC的指令数、寻址方式和指令格式种类相对CISC少'
          ]
        },
        {
          'type': 'single',
          'answer': ['A'],
          'content': '指出下列代码的缺陷（      ）。',
          'description': 'float   f[10];\n\
  // 假设这里有对f进行初始化的代码\n\
  ….\n\
  //for循环需要遍历f中所有元素\n\
  for(int i = 0; i < 10;)\n\
  {\n\
  if( f[++i] == 0 )\n\
  break;\n\
  }',
          'options': [
            'A.for(int i = 0; i < 10;)这一行写错了',
            'B.f是float型数据直接做相等判断有风险',
            'C.f[++i]应该是f[i++]',
            'D.没有缺陷']
        }
      ]
    },
    {
      'field_name': '操作系统'
    },
    {
      'field_name': '计算机网络'
    },
    {
      'field_name': '数据库原理'
    }
  ]



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

  GetAnswer(question: QuestionInfo): string {
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

interface Question {

}