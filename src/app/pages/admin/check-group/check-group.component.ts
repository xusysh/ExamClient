import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'

@Component({
  selector: 'app-check-group',
  templateUrl: './check-group.component.html',
  styleUrls: ['./check-group.component.css']
})

export class CheckGroupComponent implements OnInit {
  pageIndex = 1;
  pageSize = 5;
  listOfData = [];
  loading = true;
  sortValue: string | null = null;
  sortKey: string | null = null;
  filterGender = [{ text: 'male', value: 'male' }, { text: 'female', value: 'female' }];
  searchGenderList: string[] = [];

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.UpdateTableData();
  }

  constructor(private table_update_service: TableUpdateService) { }

  UpdateTableData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.table_update_service
      .getUsers(this.pageIndex, 10, this.sortKey!, this.sortValue!, this.searchGenderList)
      .subscribe((data: any) => {
        this.loading = false;
        this.listOfData = data.results;
      });
  }

  updateFilter(value: string[]): void {
    this.searchGenderList = value;
    this.UpdateTableData(true);
  }

  ngOnInit(): void {
    this.UpdateTableData();
  }

}