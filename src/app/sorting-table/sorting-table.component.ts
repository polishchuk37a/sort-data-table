import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {PersonInfo} from "../interfaces/person-info";
import {Subject} from "rxjs";
import {PersonInfoService} from "../services/person-info.service";
import {finalize, takeUntil, tap} from "rxjs/operators";
import {Order} from "../enums/order";
import {SortData} from "../interfaces/sort-data";

@Component({
  selector: 'app-sorting-table',
  templateUrl: './sorting-table.component.html',
  styleUrls: ['./sorting-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortingTableComponent implements OnInit, OnDestroy {
  personInfoData: PersonInfo[];
  columnName = [
    {title: 'id', order: Order.Default},
    {title: 'name', order: Order.Default},
    {title: 'username', order: Order.Default}
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(private readonly personInfoService: PersonInfoService,
              private readonly changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.personInfoService.getPersonInfo()
      .pipe(
        tap(value => {
          this.personInfoData = value;
        }),
        finalize(() => this.changeDetectorRef.markForCheck()),
        takeUntil(this.unsubscribe$)
      ).subscribe();
  }

  resetOrderOnOrderChange(sortData: SortData) {
    this.columnName = this.columnName.map(column => {
      if (column.title !== sortData.title) {
        column.order = Order.Default;

        return column;
      } else {
        column.order = sortData.order;
      }

      return column;
    })
  }

  sortData(sortData: SortData): void {
    this.resetOrderOnOrderChange(sortData);

    switch (sortData.order) {
      case Order.Asc:
        this.personInfoData = this.personInfoData.sort((a, b) => a[sortData.title] > b[sortData.title] ? 1 : -1);
        break;

      case Order.Desc:
        this.personInfoData = this.personInfoData.sort((a, b) => a[sortData.title] < b[sortData.title] ? 1 : -1);
        break;

      case Order.Default:
        this.personInfoData = this.personInfoData.sort((a, b) => a.id > b.id ? 1 : -1);
        break;

      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
