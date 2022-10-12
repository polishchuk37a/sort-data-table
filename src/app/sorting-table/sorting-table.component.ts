import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {PersonInfoService} from "../services/person-info.service";
import {finalize, takeUntil, tap} from "rxjs/operators";
import {Order} from "../enums/order";
import {Sort} from "../interfaces/sort";
import {SortService} from "../services/sort.service";
import {Album} from "../interfaces/album";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-sorting-table',
  templateUrl: './sorting-table.component.html',
  styleUrls: ['./sorting-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortingTableComponent implements OnInit, OnDestroy {
  tableData: Album[];
  albums: Album[];

  tableHeaderColumn = [
    {title: 'id', order: Order.Default},
    {title: 'title', order: Order.Default}
  ];

  albumCount = [
    {count: 5},
    {count: 10},
    {count: 15}
  ];

  albumCountControl = new FormControl(5);
  selectedCount = this.albumCountControl.value;
  selectedPage = 1;

  private unsubscribe$ = new Subject<void>();

  get pageNumbers(): number[] {
    if (this.tableData) {
      return Array(Math.ceil(this.tableData.length / this.selectedCount))
        .fill(0).map((value, index) => index + 1);
    }

    return [];
  }

  get isFirstPageBtnDisabled(): boolean {
    return this.selectedPage === 1;
  }

  get isLastPageBtnDisabled(): boolean {
    return this.selectedPage === this.pageNumbers.length;
  }

  constructor(private readonly personInfoService: PersonInfoService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly sortService: SortService) { }

  ngOnInit(): void {
    this.albumCountControl.valueChanges
      .pipe(
        tap(value => this.selectedCount = Number(value)),
        finalize(() => this.changeDetectorRef.markForCheck()),
        takeUntil(this.unsubscribe$)
      ).subscribe();

    this.personInfoService.getPersonAlbums()
      .pipe(
        tap(value => {
          this.tableData = value;
          let pageIndex = (this.selectedPage - 1) * this.selectedCount;
          this.albums = this.tableData.slice(pageIndex, this.selectedCount);
        }),
        finalize(() => this.changeDetectorRef.markForCheck()),
        takeUntil(this.unsubscribe$)
      ).subscribe();
  }

  changePage(page: number): void {
    this.selectedPage = page;
    this.sliceAlbum();
  }

  changeTableSize(count: number): void {
    this.selectedCount = Number(count);
    this.changePage(1);
  }

  sliceAlbum(): void {
    let startIndex = (this.selectedPage - 1) * this.selectedCount;
    let endIndex = (this.selectedPage - 1) * this.selectedCount + this.selectedCount;
    this.albums = this.tableData.slice(startIndex, endIndex);
  }

  resetOrderOnOrderChange(sort: Sort): void {
    this.tableHeaderColumn = this.tableHeaderColumn.map(column => {
      if (column.title !== sort.title) {
        column.order = Order.Default;

        return column;
      }

      column.order = sort.order;

      return column;
    });
  }

  sortData(sort: Sort): void {
    this.resetOrderOnOrderChange(sort);
    this.albums = this.sortService.sort(sort, this.albums);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
