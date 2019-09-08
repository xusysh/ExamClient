import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'

@Component({
  selector: 'app-check-group',
  templateUrl: './check-group.component.html',
  styleUrls: ['./check-group.component.css']
})

export class CheckGroupComponent implements OnInit {

  constructor(private table_update_service: TableUpdateService) { }

  ngOnInit(): void {
  }

}