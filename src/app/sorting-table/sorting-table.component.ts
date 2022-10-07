import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Person} from "../interfaces/person";
import {Subject} from "rxjs";
import {PersonInfoService} from "../services/person-info.service";
import {finalize, takeUntil, tap} from "rxjs/operators";
import {Order} from "../enums/order";
import {Sort} from "../interfaces/sort";
import {SortService} from "../services/sort.service";

@Component({
  selector: 'app-sorting-table',
  templateUrl: './sorting-table.component.html',
  styleUrls: ['./sorting-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortingTableComponent implements OnInit, OnDestroy {
  tableData: Person[];
  tableHeaderColumn = [
    {title: 'id', order: Order.Default},
    {title: 'name', order: Order.Default},
    {title: 'username', order: Order.Default}
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(private readonly personInfoService: PersonInfoService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly sortService: SortService) { }

  ngOnInit(): void {
    this.personInfoService.getPersonInfo()
      .pipe(
        tap(value => {
          this.tableData = value;
        }),
        finalize(() => this.changeDetectorRef.markForCheck()),
        takeUntil(this.unsubscribe$)
      ).subscribe();
  }

  resetOrderOnOrderChange(sort: Sort): void {
    this.tableHeaderColumn = this.tableHeaderColumn.map(column => {
      if (column.title !== sort.title) {
        column.order = Order.Default;

        return column;
      }

      column.order = sort.order;

      return column;
    })
  }

  sortData(sort: Sort): void {
    this.resetOrderOnOrderChange(sort);
    this.tableData = this.sortService.sort(sort, this.tableData);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
